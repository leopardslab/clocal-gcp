'use strict';

const _ = require('lodash');
const querystring = require('querystring');
const tmp = require('tmp');
const url = require('url');

const Errors = require('../utils/errors');
const Schema = require('../utils/schema');

const LOCATION_REG_EXP = /^projects\/([-\w]+)\/locations\/([-\w]+)$/;
const NAME_REG_EXP = /^projects\/([-\w]+)\/locations\/([-\w]+)\/functions\/([A-Za-z][-A-Za-z0-9_]*)$/;
const SHORT_NAME_REG_EXP = /^[A-Za-z][-A-Za-z0-9_]*$/;

const CloudFunctionSchema = {
  type: 'object',
  properties: {
    gcsTrigger: {
      type: 'string',
    },
    gcsUrl: {
      type: 'string',
    },
    eventTrigger: {
      type: ['null', 'object'],
      properties: {
        eventType: {
          type: 'string',
        },
        resource: {
          type: 'string',
        },
        path: {
          type: 'string',
        },
      },
      required: ['eventType'],
    },
    httpsTrigger: {
      type: ['null', 'object'],
      properties: {
        url: {
          type: 'string',
        },
      },
    },
    name: {
      type: 'string',
    },
    pubsubTrigger: {
      type: 'string',
    },
    sourceArchiveUrl: {
      type: 'string',
    },
    sourceUploadUrl: {
      type: 'string',
    },
  },
  required: ['name'],
};

class CloudFunction {
  constructor(name = '', props = {}) {
    let matches, shortName;
    if (name && name.match) {
      matches = name.match(NAME_REG_EXP) || [];
      shortName = matches[3];
    }

    if (
      !shortName ||
      typeof shortName !== 'string' ||
      shortName.length > 63 ||
      !CloudFunction.SHORT_NAME_REG_EXP.test(shortName)
    ) {
      if (typeof name === 'string' && !shortName) {
        shortName = name.split('/').pop();
      }
      if (!shortName) {
        shortName = name;
      }
      const err = new Errors.InvalidArgumentError(
        `Invalid value '${shortName}': Function name must contain only Latin letters, digits and a hyphen (-). It must start with letter, must not end with a hyphen, and must be at most 63 characters long.`
      );
      err.details.push(new Errors.BadRequest(err, 'name'));
      throw err;
    }
    _.merge(this, props, { name });
    const errors = Schema.validate(this, CloudFunction.schema);
    if (errors) {
      const err = new Errors.InvalidArgumentError(
        'Invalid CloudFunction property!'
      );
      err.details.push(new Errors.BadRequest(err, errors));
      throw err;
    }
  }

  static get LOCATION_REG_EXP() {
    return LOCATION_REG_EXP;
  }

  static get NAME_REG_EXP() {
    return NAME_REG_EXP;
  }

  static get SHORT_NAME_REG_EXP() {
    return SHORT_NAME_REG_EXP;
  }

  static getArchive(cloudfunction = {}) {
    const sourceUploadUrl = cloudfunction.sourceUploadUrl || '';
    const parts = url.parse(sourceUploadUrl);
    const query = querystring.parse(parts.query);
    return query.archive;
  }

  static getLocaldir(cloudfunction = {}) {
    const sourceUploadUrl = cloudfunction.sourceUploadUrl || '';
    const parts = url.parse(sourceUploadUrl);
    const query = querystring.parse(parts.query);
    return query.localdir;
  }

  static addLocaldir(cloudfunction, localdir) {
    if (!cloudfunction) {
      return;
    }
    const parts = url.parse(
      cloudfunction.sourceUploadUrl || 'http://localhost:8010'
    );
    const query = querystring.parse(parts.query);
    query.localdir = localdir;
    const newQueryString = querystring.stringify(query);
    parts.search = `?${newQueryString}`;
    parts.query = newQueryString;
    cloudfunction.sourceUploadUrl = url.format(parts);
  }

  static generateUploadUrl(opts = {}) {
    opts.bindHost || (opts.bindHost = 'localhost');
    opts.port || (opts.port = '8010');
    let url = `http://${opts.bindHost}:${opts.port}/upload`;
    const tmpName = tmp.tmpNameSync({
      postfix: '.zip',
    });
    url += `?archive=${tmpName}`;
    return url;
  }

  static get schema() {
    return CloudFunctionSchema;
  }

  get shortName() {
    return this.name.match(CloudFunction.NAME_REG_EXP)[3];
  }

  static formatLocation(project, location) {
    return `projects/${project}/locations/${location}`;
  }

  static formatName(project, location, name) {
    return `projects/${project}/locations/${location}/functions/${name}`;
  }

  static parseLocation(location = '') {
    const matches = location.match(CloudFunction.LOCATION_REG_EXP);
    return {
      project: matches ? matches[1] : null,
      location: matches ? matches[2] : null,
    };
  }

  static parseName(name = '') {
    const matches = name.match(CloudFunction.NAME_REG_EXP);
    return {
      project: matches ? matches[1] : null,
      location: matches ? matches[2] : null,
      name: matches ? matches[3] : null,
    };
  }

  setSourceArchiveUrl(sourceArchiveUrl) {
    if (!sourceArchiveUrl || typeof sourceArchiveUrl !== 'string') {
      throw new Error('"sourceArchiveUrl" must be a non-empty string!');
    }
    this.sourceArchiveUrl = sourceArchiveUrl;
  }
}

module.exports = CloudFunction;
