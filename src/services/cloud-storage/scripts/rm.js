const Bucket = require('../bucket');

const bucketName = process.argv[2];
const fileName = process.argv[3];

const _bucket = new Bucket();
const res = _bucket.deleteObject(bucketName, fileName);
console.log(res);
