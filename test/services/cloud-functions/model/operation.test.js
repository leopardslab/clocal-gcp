'use strict';

const proxyquire = require(`proxyquire`);

import test, { beforeEach } from 'ava';

let Operation;
const TEST_NAME = `operations/abcd1234`;

beforeEach(() => {
  Operation = proxyquire(
    '../../../../src/services/cloud-functions/model/operation',
    {}
  );
});

test('should be a function', t => {
  t.true(typeof Operation === 'function');
});

test('should validate the name argument', t => {
  let name;
  const getErrMessage = name =>
    `Invalid value '${name}': Operation name must contain only lower case Latin letters, digits and hyphens (-).`;

  let error = t.throws(() => {
    new Operation(name);
  });

  t.true(error instanceof Error);
  t.is(error.message, getErrMessage(name));

  name = 1234;
  error = t.throws(() => {
    new Operation(name);
  });
  t.true(error instanceof Error);
  t.is(error.message, getErrMessage(name));

  name = `opera/fail`;
  error = t.throws(() => {
    new Operation(name);
  });
  t.true(error instanceof Error);
  t.is(error.message, getErrMessage(name));

  t.notThrows(() => {
    const operation = new Operation(TEST_NAME);
    t.is(operation.name, TEST_NAME);
  });

  t.true(new Operation(TEST_NAME) instanceof Operation);
});
