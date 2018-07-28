import test, { beforeEach } from 'ava';
import BucketObjectsConfigStore from '../bucket-objects-config-store';

let bucketObjectsConfigStore;

beforeEach(t => {
  bucketObjectsConfigStore = new BucketObjectsConfigStore();
});

test('should create BucketObjectsConfigStore instance', t => {
  t.truthy(bucketObjectsConfigStore);
});

test('should insert and get bucket object', t => {
  bucketObjectsConfigStore.insertObject(
    'testBucket',
    { name: 'test' },
    '/test/test.txt'
  );
  let objectsConfig = bucketObjectsConfigStore.getObject('testBucket', 'test');
  t.is(objectsConfig.instance.name, 'test');
  bucketObjectsConfigStore.deleteObject('testBucket', 'test');
  objectsConfig = bucketObjectsConfigStore.getObject('testBucket', 'test');
  t.is(objectsConfig, undefined);
});

test('should list and delete all bucket objects', t => {
  bucketObjectsConfigStore.insertObject(
    'testBucket',
    { name: 'test' },
    '/test/test.txt'
  );
  bucketObjectsConfigStore.insertObject(
    'testBucket',
    { name: 'test2' },
    '/test/test2.txt'
  );
  let objectsConfigs = bucketObjectsConfigStore.listObjects('testBucket');
  t.is(objectsConfigs.length, 2);
  t.is(objectsConfigs[0].instance.name, 'test');
  bucketObjectsConfigStore.deleteAllObjects('testBucket');
  objectsConfigs = bucketObjectsConfigStore.listObjects('testBucket');
  t.is(objectsConfigs.length, 0);
});
