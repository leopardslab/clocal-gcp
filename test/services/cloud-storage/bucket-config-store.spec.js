import test, { beforeEach } from 'ava';
import BucketConfigStore from '../../../src/services/cloud-storage/bucket-config-store';

let bucketConfigStore;

beforeEach(t => {
  bucketConfigStore = new BucketConfigStore();
});

test('should create BucketConfigStore instance', t => {
  t.truthy(bucketConfigStore);
});

test('should insert, get, delete bucket configurations successfully', t => {
  const testBucket = { name: 'test-bucket', path: '/test-bucket' };

  bucketConfigStore.insertBucket(testBucket);
  t.deepEqual(bucketConfigStore.getBucket(testBucket.name), testBucket);
  bucketConfigStore.deleteBucket(testBucket.name);
});
