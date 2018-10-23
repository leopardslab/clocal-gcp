import test, { beforeEach } from 'ava';
import Bucket from '../bucket';

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

test('should insert, get, list, delete bucket', t => {
  const instance = bucket.insertBucket('test-bucket');
  t.deepEqual(instance.name, 'test-bucket');
  const instance2 = bucket.getBucket('test-bucket');
  t.deepEqual(instance, instance2);
  const bucketList = bucket.listBuckets();
  t.deepEqual(bucketList['items'][0], instance);
  bucket.deleteBucket('test-bucket');
});
