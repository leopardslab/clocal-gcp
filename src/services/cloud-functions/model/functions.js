'use strict';

const _ = require('lodash');
const AdmZip = require('adm-zip');
const Configstore = require('configstore');
const fs = require('fs');
const got = require('got');
const logger = require('winston');
const os = require('os');
const path = require('path');
const rimraf = require('rimraf');
const spawn = require('child_process').spawn;
const Storage = require('@google-cloud/storage');
const uuid = require('uuid');

const CloudFunction = require('./cloudfunction');
const Errors = require('../utils/errors');
const Operation = require('./operation');
const pkg = require('../../../../package.json');
const Schema = require('../utils/schema');

const GCS_URL = /^gs:\/\/([A-Za-z0-9][\w-.]+[A-Za-z0-9])\/(.+)$/;

class ConfigAdapter {
  constructor(opts = {}) {
    this._functions = new Configstore(path.join(pkg.name, '.functions'));
    this._operations = new Configstore(path.join(pkg.name, '.operations'));
  }

  async createFunction(cloudfunction) {
    return this._functions.set(cloudfunction.name, cloudfunction);
  }

  async createOperation(operation = {}) {
    operation.name = `operations/${uuid.v4()}`;
    this._operations.set(operation.name, operation);
    return operation;
  }

  async deleteFunction(name) {
    return this._functions.delete(name);
  }

  async getFunction(name) {
    return this._functions.get(name);
  }

  async getOperation(name) {
    return this._operations.get(name);
  }

  async listFunctions(opts = {}) {
    const cloudfunctionsObj = this._functions.all;
    const cloudfunctions = Object.values(cloudfunctionsObj);

    return {
      functions: cloudfunctions,
      nextPageToken: '',
    };
  }

  async updateOperation(name, operation) {
    this._operations.set(name, operation);
    return operation;
  }
}

const FunctionsConfigSchema = {
  type: 'object',
  properties: {
    storage: {
      type: 'string',
      enum: ['configstore'],
    },
    host: {
      type: 'string',
    },
    supervisorPort: {
      type: 'number',
    },
  },
  required: ['storage', 'host', 'supervisorPort'],
};

class Functions {
  constructor(config = {}) {
    const errors = Schema.validate(config, FunctionsConfigSchema);
    if (errors) {
      const err = new Errors.InvalidArgumentError(
        'CloudFunctions config is invalid!'
      );
      err.details.push(new Errors.BadRequest(err, errors));
      throw err;
    }
    this.config = _.merge({}, config);
    if (this.config.storage === 'configstore') {
      this.adapter = new ConfigAdapter(this.config);
    }
  }

  _assertFunctionDoesNotExist(name) {
    logger.debug('Functions#_assertFunctionDoesNotExist', name);
    return this.adapter.getFunction(name).then(cloudfunction => {
      if (cloudfunction) {
        const parts = CloudFunction.parseName(name);
        const err = new Errors.ConflictError(
          `Function ${parts.name} in location ${parts.location} in project ${
            parts.project
          } already exists`
        );
        logger.error(err);
        throw err;
      }
    });
  }

  cloudfunction(name, props) {
    if (props instanceof CloudFunction) {
      return props;
    }
    return new CloudFunction(name, props);
  }

  _createFunctionError(name, err) {
    logger.error(err);
    err = new Errors.InternalError(err.message);
    return Promise.reject(err);
  }

  async createFunction(location, cloudfunction = {}) {
    let operation, request;

    request = {
      location,
      function: _.cloneDeep(cloudfunction),
    };

    if (request.function.gcsUrl) {
      request.function.sourceArchiveUrl = request.function.gcsUrl;
      delete request.function.gcsUrl;
    }
    for (let key in request.function) {
      if (!request.function[key]) {
        delete request.function[key];
      }
    }

    try {
      cloudfunction = await this.cloudfunction(
        cloudfunction.name,
        cloudfunction
      );
      await this._assertFunctionDoesNotExist(cloudfunction.name);
    } catch (err) {
      return this._createFunctionError(cloudfunction.name, err);
    }

    const parts = CloudFunction.parseName(cloudfunction.name);

    if (cloudfunction.httpsTrigger) {
      cloudfunction.httpsTrigger.url = `http://${this.config.host}:${
        this.config.supervisorPort
      }/${parts.project}/${parts.location}/${parts.name}`;
    }

    operation = this.operation(Operation.generateId(), {
      done: false,
      metadata: {
        typeUrl:
          'types.googleapis.com/google.cloud.functions.v1beta2.OperationMetadataV1Beta2',
        value: {
          target: cloudfunction.name,
          type: 1,
          request: {
            typeUrl:
              'types.googleapis.com/google.cloud.functions.v1beta2.CreateFunctionRequest',
            value: request,
          },
        },
      },
    });

    await this.adapter.createFunction(cloudfunction);
    await this.adapter.createOperation(operation);

    cloudfunction.latestOperation = operation.name;
    cloudfunction.availableMemoryMb = Math.floor(os.totalmem() / 1000000);

    cloudfunction.status = 'READY';
    operation.done = true;
    operation.response = {
      typeUrl:
        'types.googleapis.com/google.cloud.functions.v1beta2.CloudFunction',
      value: _.cloneDeep(cloudfunction),
    };

    try {
      await this.adapter.updateOperation(operation.name, operation);
      await this.adapter.createFunction(cloudfunction);
    } catch (err) {
      this._createFunctionError(cloudfunction.name, err);
      cloudfunction.status = 'FAILED';
      operation.done = true;
      operation.error = JSON.parse(JSON.stringify(err));
    }
    return operation;
  }

  _deleteFunctionError(name, err, operation) {
    err = new Errors.InternalError(err.message);

    if (operation) {
      operation.done = true;
      operation.error = _.cloneDeep(err);

      this.adapter
        .updateOperation(operation.name, operation)
        .catch(err => this._deleteFunctionError(name, err));
    }

    return Promise.reject(err);
  }

  deleteFunction(name) {
    return this.getFunction(name).then(cloudfunction => {
      const operationName = Operation.generateId();

      const operation = this.operation(operationName, {
        done: false,
        metadata: {
          typeUrl:
            'types.googleapis.com/google.cloud.functions.v1beta2.OperationMetadataV1Beta2',
          value: {
            target: name,
            type: 1,
            request: {
              typeUrl:
                'types.googleapis.com/google.cloud.functions.v1beta2.DeleteFunctionRequest',
              value: { name },
            },
          },
        },
      });

      return this.adapter.createOperation(operation).then(
        () => {
          this.adapter
            .deleteFunction(name)

            .then(
              () => {
                operation.done = true;
                operation.response = {
                  typeUrl: 'types.googleapis.com/google.protobuf.Empty',
                  value: {},
                };

                this.adapter
                  .updateOperation(operation.name, operation)
                  .catch(err => this._deleteFunctionError(name, err));
              },
              err => this._deleteFunctionError(name, err, operation)
            );

          return operation;
        },
        err => this._deleteFunctionError(name, err)
      );
    });
  }

  _getFunctionNotFoundError(name) {
    const parts = CloudFunction.parseName(name);
    const err = new Errors.NotFoundError(
      `Function ${parts.name} in location ${parts.location} in project ${
        parts.project
      } does not exist`
    );
    return Promise.reject(err);
  }

  _getFunctionError(name, err) {
    err = new Errors.InternalError(err.message);
    logger.error(err);
    return Promise.reject(err);
  }

  getFunction(name) {
    logger.debug('Functions#getFunction', name);
    return this.adapter.getFunction(name).then(
      cloudfunction => {
        if (!cloudfunction) {
          return this._getFunctionNotFoundError(name);
        }

        return this.cloudfunction(name, cloudfunction);
      },
      err => this._getFunctionError(name, err)
    );
  }

  getSupervisorHost() {
    return `http://${this.config.bindHost}:${this.config.supervisorPort}`;
  }

  _getOperationNotFoundError(name) {
    const err = new Errors.NotFoundError(`Operation ${name} does not exist`);
    return Promise.reject(err);
  }

  _getOperationError(name, err) {
    err = new Errors.InternalError(err.message);
    logger.error(err);
    return Promise.reject(err);
  }

  getOperation(name) {
    return this.adapter.getOperation(name).then(
      operation => {
        if (!operation) {
          return this._getOperationNotFoundError(name);
        }

        return this.operation(name, operation);
      },
      err => this._getOperationError(err)
    );
  }

  listFunctions(location, opts = {}) {
    return Promise.resolve()
      .then(() => {
        if (!location) {
          throw new Error('"location" is required!');
        } else if (typeof location !== 'string') {
          throw new Error('"location" must be a string!');
        } else if (opts && opts.pageSize) {
          opts.pageSize = parseInt(opts.pageSize, 10);
          if (isNaN(opts.pageSize) || typeof opts.pageSize !== 'number') {
            throw new Error('"pageSize" must be a number!');
          }
        } else if (
          opts &&
          opts.pageToken &&
          typeof opts.pageToken !== 'string'
        ) {
          throw new Error('"pageToken" must be a string!');
        }

        return this.adapter.listFunctions(opts);
      })
      .then(response => {
        response.functions = response.functions.map(func =>
          this.cloudfunction(func.name, func)
        );
        return response;
      });
  }

  operation(name, props) {
    if (props instanceof Operation) {
      return props;
    }
    return new Operation(name, props);
  }
}

module.exports = Functions;
