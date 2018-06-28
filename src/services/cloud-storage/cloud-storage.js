'use strict';

const CloudLocal = require('../gcp/cloud-local');
const bodyParser = require('body-parser');
const Bucket = require('./bucket');

class CloudStorage extends CloudLocal {
  init() {
    // TODO : change this port and pass through config
    this.port = 8000;
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.raw());
    this.app.use(bodyParser.text());
    this.app.post(`/storage/v1/b`, this._insert);
  }

  _insert(req, res) {
    const _bucket = new Bucket();
    const bucketName = req.body.name;
    const bucket = _bucket.insertBucket(bucketName);
    res.send(bucket);
  }
}

module.exports = CloudStorage;
