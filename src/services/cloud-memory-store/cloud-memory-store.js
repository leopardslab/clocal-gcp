'use strict';

const CloudLocal = require('./cloud-local');
const bodyParser = require('body-parser');
const MemoryStore = require('./memory-store');
const express = require('express');

class CloudMemoryStore extends CloudLocal {
  init() {
    this.port = 7070;
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.raw());
    this.app.use(bodyParser.text());
    this.app
      .post(
        `/v1beta1/projects/:projectId/locations/:locationId`,
        this._createInstance
      )
      .patch(
        `/v1beta1/projects/:projectId/locations/:locationId`,
        this._createInstance
      )
      .get(
        `/v1beta1/projects/:projectId/locations/:locationId/instances/:instanceId`,
        this._getInstance
      )
      .delete(
        `/v1beta1/projects/:projectId/locations/:locationId/instances/:instanceId`,
        this._deleteInstance
      )
      .get(
        `/v1beta1/projects/:projectId/locations/:locationId`,
        this._listInstances
      )

      .all('*', (req, res) => {
        console.log(req.url);
        res.send('Endpoint not found');
      });
  }

  _createInstance(req, res) {
    const projectId = req.params.projectId;
    const locationId = req.params.locationId;
    const instanceId = req.query.instanceId;
    const instance = req.body;
    const memoryStore = new MemoryStore();
    const operation = memoryStore.createStore({
      projectId: projectId,
      locationId: locationId,
      instanceId: instanceId,
      instance: instance,
    });
    res.send(operation);
  }

  _getInstance(req, res) {
    const instanceId = req.params.instanceId;
    const memoryStore = new MemoryStore();
    const instance = memoryStore.getStore(instanceId);
    res.send(instance);
  }

  _deleteInstance() {
    const instanceId = req.params.instanceId;
    const memoryStore = new MemoryStore();
    const instance = memoryStore.getStore(instanceId);
    res.send(instance);
  }

  _listInstances(req, res) {
    const memoryStore = new MemoryStore();
    const instances = memoryStore.listStore();
    res.send(instances);
  }
}

module.exports = CloudMemoryStore;
