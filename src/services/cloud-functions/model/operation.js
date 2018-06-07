'use strict';

const _ = require('lodash');
const uuid = require('uuid');

const Errors = require('../utils/errors');
const Schema = require('../utils/schema');

const NAME_REG_EXP = /^operations\/([-A-Za-z0-9]+)$/;

const OperationSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
  required: ['name'],
};

class Operation {
  constructor(name, props = {}) {
    if (
      !name ||
      typeof name !== 'string' ||
      !Operation.NAME_REG_EXP.test(name)
    ) {
      const err = new Errors.InvalidArgumentError(
        `Invalid value '${name}': Operation name must contain only lower case Latin letters, digits and hyphens (-).`
      );
      err.details.push(new Errors.BadRequest(err, 'name'));
      throw err;
    }
    _.merge(this, props, { name });
    const errors = Schema.validate(this, Operation.schema);
    if (errors) {
      const err = new Errors.InvalidArgumentError(
        'Invalid Operation property!'
      );
      err.details.push(new Errors.BadRequest(err, errors));
      throw err;
    }
  }

  static get NAME_REG_EXP() {
    return NAME_REG_EXP;
  }

  static get schema() {
    return OperationSchema;
  }

  static formatName(name) {
    return `operations/${name}`;
  }

  static generateId() {
    return `operations/${uuid.v4()}`;
  }

  static parseName(name = '') {
    const matches = name.match(Operation.NAME_REG_EXP);
    return {
      operation: matches ? matches[1] : null,
    };
  }
}

module.exports = Operation;
