const Bucket = require('../bucket');

const srcUrl = process.argv[2];
const destUrl = process.argv[3];

const _bucket = new Bucket();
const object = _bucket.copyObjects(srcUrl, destUrl);
console.log(object);
