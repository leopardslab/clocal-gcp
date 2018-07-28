const Bucket = require('../bucket');

const bucketName = process.argv[2];

const _bucket = new Bucket();
const bucket = _bucket.deleteBucket(bucketName);
console.log(bucket);
