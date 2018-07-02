import test, { beforeEach } from 'ava';
import Bucket from '../../../src/services/cloud-storage/bucket';

let bucket;

beforeEach(t => {
  bucket = new Bucket();
});

test('should create a bucket instace', t => {
  t.truthy(bucket);
});

test('should create a bucket instance', t => {
  const instance = bucket._getBucketInstace(
    'test',
    `${bucket.storageLocation}/test`
  );
  t.deepEqual(instance.id, 'test');
});

test('should insert a bucket', t => {
  const instance = bucket.insertBucket('test-bucket');
  t.deepEqual(instance.name, 'test-bucket');
  bucket.deleteBucket('test-bucket');
});
