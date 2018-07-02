const Configstore = require('configstore');
const pkg = require('./package.json');
const path = require('path');

class BucketConfigStore {
  constructor() {
    this._buckets = new Configstore(path.join(pkg.name, '.buckets'));
  }

  insertBucket(bucket) {
    return this._buckets.set(bucket.name, bucket);
  }

  getBucket(name) {
    return this._buckets.get(name);
  }

  deleteBucket(name) {
    return this._buckets.delete(name);
  }
}

module.exports = BucketConfigStore;
