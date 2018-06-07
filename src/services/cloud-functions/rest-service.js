'use strict';

const CloudLocal = require('../gcp/cloud-local');
const path = require('path');
const Configstore = require('configstore');
const got = require('got');
const url = require('url');
const bodyParser = require('body-parser');
const pkg = require('../../../package.json');
const Model = require('./model');

const { CloudFunction, Operation } = Model;

const API_VERSION = 'v1';
const DISCOVERY_URL = `https://cloudfunctions.googleapis.com/$discovery/rest?version=${API_VERSION}`;

class RestService extends CloudLocal {
  init() {
    this.functions = Model.functions({
      storage: 'configstore',
      host: 'localhost',
      supervisorPort: 8010,
    });
    this.port = 7574;
    this._discovery = new Configstore(path.join(pkg.name, '/.discovery'));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.raw());
    this.app.use(bodyParser.text());
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );

    this.app.use((req, res, next) => {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', 0);
      next();
    });

    this.app
      .get(`/([$])discovery/rest`, (req, res, next) =>
        this.getDiscoveryDoc(req, res).catch(next)
      )
      .delete(
        `/${API_VERSION}/projects/:project/locations/:location/functions/:name`,
        (req, res, next) => this.deleteFunction(req, res).catch(next)
      )
      .get(
        `/${API_VERSION}/projects/:project/locations/:location/functions/:name`,
        (req, res, next) => this.getFunction(req, res).catch(next)
      )
      .get(
        `/${API_VERSION}/projects/:project/locations/:location/functions`,
        (req, res, next) => this.listFunctions(req, res).catch(next)
      )
      .post(
        `/${API_VERSION}/projects/:project/locations/:location/functions::generateUploadUrl`,
        (req, res, next) => this.generateUploadUrl(req, res).catch(next)
      )
      .post(
        `/${API_VERSION}/projects/:project/locations/:location/functions/:name::call`,
        (req, res, next) => this.callFunction(req, res).catch(next)
      )
      .post(
        `/${API_VERSION}/projects/:project/locations/:location/functions`,
        (req, res, next) => this.createFunction(req, res).catch(next)
      )
      .get(`/${API_VERSION}/operations/:operation`, (req, res, next) =>
        this.getOperation(req, res).catch(next)
      )
      .all('*', (req, res, next) => {
        next({ code: Errors.status.NOT_FOUND });
      });

    this.app.use((err, req, res, next) => {
      res
        .status(200)
        .json({
          test: `${err}`,
        })
        .end();
    });
  }

  getDiscoveryDoc(req, res) {
    return Promise.resolve()
      .then(() => {
        const doc = this._discovery.all;
        if (
          typeof doc === 'object' &&
          Object.keys(doc).length > 0 &&
          doc.version === API_VERSION
        ) {
          return doc;
        }
        return got(DISCOVERY_URL, {
          query: {
            version: req.query.version,
          },
        })
          .then(response => {
            const doc = JSON.parse(response.body);
            this._discovery.set(doc);
            return doc;
          })
          .catch(err => {
            if (err && err.statusCode === 404) {
              return Promise.reject(
                new Errors.NotFoundError(
                  'Discovery document not found for API service.'
                )
              );
            }
            return Promise.reject(err);
          });
      })
      .then(doc => {
        doc.baseUrl = doc.rootUrl =
          url.format({
            hostname: 'localhost',
            port: this.port,
            protocol: `${req.protocol}:`,
          }) + '/';
        res
          .status(200)
          .json(doc)
          .end();
      });
  }

  createFunction(req, res) {
    const location = CloudFunction.formatLocation(
      req.params.project,
      req.params.location
    );

    return this.functions.createFunction(location, req.body).then(operation => {
      res
        .status(200)
        .json(operation)
        .end();
    });
  }

  deleteFunction(req, res) {
    const name = CloudFunction.formatName(
      req.params.project,
      req.params.location,
      req.params.name
    );
    return this.functions.deleteFunction(name).then(operation => {
      res
        .status(200)
        .json(operation)
        .end();
    });
  }

  generateUploadUrl(req, res) {
    return new Promise(resolve => {
      res
        .send({
          uploadUrl: CloudFunction.generateUploadUrl(this.config),
        })
        .end();
      resolve();
    });
  }

  getFunction(req, res) {
    const name = CloudFunction.formatName(
      req.params.project,
      req.params.location,
      req.params.name
    );
    return this.functions.getFunction(name).then(cloudfunction => {
      if (
        req.get('user-agent') &&
        req.get('user-agent').includes('google-cloud-sdk') &&
        cloudfunction.status === 'DEPLOYING'
      ) {
        return Promise.reject(this.functions._getFunctionNotFoundError(name));
      }

      res
        .status(200)
        .json(cloudfunction)
        .end();
    });
  }

  listFunctions(req, res) {
    const location = CloudFunction.formatLocation(
      req.params.project,
      req.params.location
    );
    return this.functions
      .listFunctions(location, {
        pageSize: req.query.pageSize,
        pageToken: req.query.pageToken,
      })
      .then(response => {
        res
          .status(200)
          .json(response)
          .end();
      });
  }
}

module.exports = RestService;
