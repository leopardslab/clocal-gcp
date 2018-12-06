const Configstore = require('configstore');
const pkg = require('./package.json');
const path = require('path');

class BucketObjectsConfigStore {
  constructor() {
    this._bucketObjects = new Configstore(
      path.join(pkg.name, '.bucketObjects')
    );
  }

  insertObject(bucketName, objectInstance, objectPath) {
    let bucketObjects = this._bucketObjects.get(bucketName);
    if (bucketObjects === undefined) {
      bucketObjects = {
        name: bucketName,
        objects: [{ path: objectPath, instance: objectInstance }],
      };
    } else {
      if (this.getObject(bucketName, objectInstance.name)) {
        this.deleteObject(bucketName, objectInstance.name);
      }
      bucketObjects.objects.push({
        path: objectPath,
        instance: objectInstance,
      });
    }
    this._bucketObjects.set(bucketObjects.name, bucketObjects);
  }

  getObject(bucketName, fileName) {
    const bucketObjects = this._bucketObjects.get(bucketName);
    if (bucketObjects === undefined) return undefined;
    return bucketObjects.objects.find(i => {
      return i.instance.name === fileName;
    });
  }

  deleteObject(bucketName, fileName) {
    const bucketObjects = this._bucketObjects.get(bucketName);
    if (bucketObjects === undefined) return undefined;
    const indexToDelete = bucketObjects.objects.findIndex(i => {
      return i.instance.name === fileName;
    });
    bucketObjects.objects.splice(indexToDelete, 1);
    this._bucketObjects.set(bucketObjects.name, bucketObjects);
  }

  deleteAllObjects(bucketName) {
    const bucketObjects = this._bucketObjects.get(bucketName);
    if (bucketObjects === undefined) return undefined;
    bucketObjects.objects = [];
    this._bucketObjects.set(bucketObjects.name, bucketObjects);
  }

  listObjects(bucketName) {
    const bucketObjects = this._bucketObjects.get(bucketName);
    if (bucketObjects === undefined) return undefined;
    return bucketObjects.objects;
  }
}

module.exports = BucketObjectsConfigStore;
