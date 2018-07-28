const Bucket = require('../bucket');

const bucketName = process.argv[2];

const _bucket = new Bucket();
const bucket = _bucket.insertBucket(bucketName);
console.log(bucket);
