'use strict';

import test, { beforeEach } from 'ava';
import {
  CloudFunction,
  Operation,
} from '../../../../src/services/cloud-functions/model';

const defaults = {
  bindHost: 'localhost',
  host: 'localhost',
  idlePruneInterval: 60000,
  logFile: 'logs/cloud-functions-emulator.log',
  maxIdle: 300000,
  region: 'us-central1',
  restPort: 8008,
  service: 'rest',
  storage: 'configstore',
  supervisorPort: 8010,
  tail: false,
  timeout: 20000,
  useMocks: false,
  verbose: false,
  watch: true,
  watchIgnore: ['node_modules'],
};

const _ = require(`lodash`);
const os = require('os');
const proxyquire = require(`proxyquire`);

defaults.location = _.kebabCase(os.userInfo().username);

let Functions;

beforeEach(() => {
  Functions = proxyquire(
    '../../../../src/services/cloud-functions/model/functions',
    {}
  );
});

test('should be a function', t => {
  t.true(typeof Functions === 'function');
});

test('should return a function instance', t => {
  const functions = new Functions(_.merge(defaults, { projectId: 'p' }));
  t.true(functions instanceof Functions);
});

test('should create a function', t => {
  class MockFunctions extends Functions {
    constructor(config = {}) {
      super(config);
      this.adapter = {
        createFunction: () => Promise.resolve(),
        createOperation: () => Promise.resolve(),
        updateOperation: () => Promise.resolve(),
      };
    }

    _assertFunctionDoesNotExist() {
      return Promise.resolve();
    }
  }

  const location = CloudFunction.formatLocation('test', defaults.location);
  const functionObj = {
    name: 'projects/test/locations/us-central1/functions/helloWorld2',
    timeout: { seconds: 60 },
    sourceUploadUrl:
      'http://localhost:8008/upload?archive=%2Ftmp%2Ftmp-4828U65t4iGRbYoX.zip&localdir=%2Fhome%2Fdilantha%2Fsource%2Fgsoc%2Flearning%2Ffunction-emulator%2Fhelloworld2',
    sourceArchiveUrl: 'file:///tmp/tmp-4828U65t4iGRbYoX.zip',
    httpsTrigger: {},
  };
  const functions = new MockFunctions(
    _.merge({}, defaults, { projectId: 'p' })
  );

  t.notThrows(() => {
    const operation = functions.createFunction(location, functionObj);
  });
});
