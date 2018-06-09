'use strict';

const proxyquire = require('proxyquire').noPreserveCache();
const nock = require('nock');
const request = require('supertest');

import test, { beforeEach, afterEach } from 'ava';

let RestService;

beforeEach(() => {
  RestService = proxyquire(
    '../../../src/services/cloud-functions/rest-service',
    {}
  );
});

afterEach(() => {
  nock.cleanAll();
});

test('discovery document', async t => {
  const functionMock = {
    getDiscoveryDoc: () => {
      return Promise.resolve({});
    },
  };

  const service = new RestService(functionMock, {});
  const res = await request(service.app).get('/$discovery/rest');

  t.is(res.status, 200);
});

test('delete function', async t => {
  const functionMock = {
    deleteFunction: () => {
      return Promise.resolve({});
    },
  };

  const service = new RestService(functionMock, {});
  const res = await request(service.app).delete(
    '/v1/projects/fake-project/locations/us-central1/functions/test-function'
  );

  t.is(res.status, 200);
});

test('get function', async t => {
  const functionMock = {
    getFunction: () => {
      return Promise.resolve({});
    },
  };

  const service = new RestService(functionMock, {});
  const res = await request(service.app).get(
    '/v1/projects/fake-project/locations/us-central1/functions/test-function'
  );

  t.is(res.status, 200);
});

test('list function', async t => {
  const functionMock = {
    listFunctions: () => {
      return Promise.resolve({});
    },
  };

  const service = new RestService(functionMock, {});
  const res = await request(service.app).get(
    '/v1/projects/fake-project/locations/us-central1/functions'
  );

  t.is(res.status, 200);
});

test('generateUploadUrl', async t => {
  const functionMock = {
    generateUploadUrl: () => {
      return Promise.resolve({});
    },
  };

  const service = new RestService(functionMock, {});
  const res = await request(service.app).post(
    '/v1/projects/fake-project/locations/us-central1/functions::generateUploadUrl'
  );

  t.is(res.status, 200);
});

test('create function', async t => {
  const functionMock = {
    createFunction: () => {
      return Promise.resolve({});
    },
  };

  const service = new RestService(functionMock, {});
  const res = await request(service.app).post(
    '/v1/projects/fake-project/locations/us-central1/functions'
  );

  t.is(res.status, 200);
});
