const Bucket = require('../bucket');

const bucketName = process.argv[2];

const _bucket = new Bucket();
const objects = _bucket.listObjects(bucketName);
console.log(objects);
