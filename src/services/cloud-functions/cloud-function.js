'use strict';

const CloudLocal = require('../gcp/cloud-local');
const path = require('path');
const Configstore = require('configstore');
const got = require('got');
const url = require('url');
const bodyParser = require('body-parser');
const pkg = require('../../../package.json');

const API_VERSION = 'v1';
const DISCOVERY_URL = `https://cloudfunctions.googleapis.com/$discovery/rest?version=${API_VERSION}`;

class CloudFunction extends CloudLocal {
  init() {
    this.port = 7574;
    this._discovery = new Configstore(path.join(pkg.name, '/.discovery'));

    this.app.put(`/upload`, (req, res, next) =>
      this.handleUpload(req, res).catch(next)
    );

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.raw());
    this.app.use(bodyParser.text());
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

    this.app.use((req, res, next) => {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', 0);
      next();
    });

    this.app.get(`/([$])discovery/rest`, (req, res, next) =>
      this.getDiscoveryDoc(req, res).catch(next)
    );
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
            version: req.query.version
          }
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
            protocol: `${req.protocol}:`
          }) + '/';
        res
          .status(200)
          .json(doc)
          .end();
      });
  }

  handleUpload(req, res) {
    return new Promise((resolve, reject) => {
      req
        .pipe(fs.createWriteStream(req.query.archive))
        .on('error', reject)
        .on('finish', () => {
          res.end();
          resolve();
        });
    });
  }
}

module.exports = CloudFunction;
