'use strict';

const CloudLocal = require('../gcp/cloud-local');
const bodyParser = require('body-parser');

class CloudStorage extends CloudLocal {
  init() {
    // TODO : change this port and pass through config
    this.port = 8000;
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.raw());
    this.app.use(bodyParser.text());
    this.app
      .post(`/storage/v1/b`, (req, res) => {
        const bucketName = req.body.name;
        res.send({
          kind: 'storage#bucket',
          id: `${bucketName}`,
          selfLink:
            'https://www.googleapis.com/storage/v1/b/dilantha-test-bucket',
          projectNumber: '1056551843110',
          name: `${bucketName}`,
          timeCreated: '2018-06-24T15:07:47.289Z',
          updated: '2018-06-24T15:07:47.289Z',
          metageneration: '1',
          location: 'US',
          storageClass: 'STANDARD',
          etag: 'CAE=',
        });
      })
      .get(`/test`, (req, res) => {
        console.log(req);
        res.send({
          test: 'test',
        });
      });
  }
}

module.exports = CloudStorage;
