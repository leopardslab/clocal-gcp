'use strict';

const CloudLocal = require('./cloud-local');
const bodyParser = require('body-parser');
const Bucket = require('./bucket');

class CloudStorage extends CloudLocal {
  init() {
    // TODO : change this port and pass through config
    this.port = 8080;
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.raw());
    this.app.use(bodyParser.text());
    this.app.post(`/storage/v1/b`, this._insert).get(`/test`, (req, res) => {
      res.send('hello world');
    });
  }

  _insert(req, res) {
    const _bucket = new Bucket();
    const bucketName = req.body.name;
    const bucket = _bucket.insertBucket(bucketName);
    res.send(bucket);
  }
}

module.exports = CloudStorage;
