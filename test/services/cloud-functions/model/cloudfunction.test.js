'use strict';

const proxyquire = require(`proxyquire`);

import test, { beforeEach } from 'ava';

let CloudFunction;
const TEST_NAME = `projects/p/locations/l/functions/f`;

beforeEach(() => {
  CloudFunction = proxyquire(
    '../../../../src/services/cloud-functions/model/cloudfunction',
    {}
  );
});

test('should be a function', t => {
  t.is(typeof CloudFunction, 'function');
});

test('should validate the name argument', t => {
  let name;

  let error = t.throws(() => {
    new CloudFunction(name);
  });

  t.true(error instanceof Error);
  let message = `Invalid value '': Function name must contain only Latin letters, digits and a hyphen (-). It must start with letter, must not end with a hyphen, and must be at most 63 characters long.`;
  t.is(error.message, message);

  name = 353;
  error = t.throws(() => {
    new CloudFunction(name);
  });
  t.true(error instanceof Error);
  message = `Invalid value '${name}': Function name must contain only Latin letters, digits and a hyphen (-). It must start with letter, must not end with a hyphen, and must be at most 63 characters long.`;
  t.is(error.message, message);

  name = `projects/p/locations/l/functions/1`;
  error = t.throws(() => {
    new CloudFunction(name);
  });
  t.true(error instanceof Error);
  message = `Invalid value '1': Function name must contain only Latin letters, digits and a hyphen (-). It must start with letter, must not end with a hyphen, and must be at most 63 characters long.`;
  t.is(error.message, message);

  t.notThrows(() => {
    const cloudfunction = new CloudFunction(TEST_NAME);
    t.is(cloudfunction.name, TEST_NAME);
  });

  t.true(new CloudFunction(TEST_NAME) instanceof CloudFunction);
});
