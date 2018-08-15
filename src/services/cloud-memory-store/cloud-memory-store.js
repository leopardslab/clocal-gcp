'use strict';

const formidable = require('formidable');

const CloudLocal = require('./cloud-local');
const bodyParser = require('body-parser');
const Bucket = require('./bucket');
const express = require('express');

class CloudMemoryStore extends CloudLocal {
  init() {
    // TODO : change this port and pass through config
    this.port = 8080;
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.raw());
    this.app.use(bodyParser.text());
    this.app.get(`/v1beta1`, (req, res) => {
      res.send('Not implemented yet');
    });
  }
}

module.exports = CloudMemoryStore;
