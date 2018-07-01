const fs = require('fs');
const { execSync } = require('child_process');
const homedir = require('os').homedir();
const BucketConfigStore = require('./bucket-config-store');

class Bucket {
  constructor() {
    const storageLocationPath = `/.clocal-gcp/storage`;
    if (!fs.existsSync(storageLocationPath)) {
      execSync(`mkdir -p ${storageLocationPath}`);
    }
    this.storageLocation = storageLocationPath;
    this._bucketConfigStore = new BucketConfigStore();
  }

  insertBucket(bucketName) {
    try {
      const bucketPath = `${this.storageLocation}/${bucketName}`;
      fs.mkdirSync(bucketPath);
      if (fs.existsSync(bucketPath)) {
        const bucketInstance = this._getBucketInstace(bucketName, bucketPath);
        this._bucketConfigStore.insertBucket(bucketInstance);
        return bucketInstance;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  deleteBucket(bucketName) {
    try {
      const bucketPath = `${this.storageLocation}/${bucketName}`;
      fs.rmdirSync(bucketPath);
      if (!fs.existsSync(bucketPath)) {
        this._bucketConfigStore.deleteBucket(bucketName);
      }
    } catch (err) {
      return false;
    }
  }

  _getBucketInstace(bucketName, path, bucketInstance) {
    const updateTime = new Date().toISOString();
    let bucket;
    if (bucketInstance) {
      bucket = bucketInstance;
    } else {
      bucket = {
        kind: 'storage#bucket',
        id: bucketName,
        selfLink: 'string',
        projectNumber: 'number',
        name: 'string',
        timeCreated: updateTime,
        updated: 'datetime',
        metageneration: 'long',
        location: 'string',
        storageClass: 'string',
        etag: 'string',
      };
    }
    bucket.updated = updateTime;
    bucket.id = bucketName;
    bucket.name = bucketName;
    return bucket;
  }
}

module.exports = Bucket;
