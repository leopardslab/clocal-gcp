const Configstore = require('configstore');
const pkg = require('./package.json');
const path = require('path');

class MemoryStoreConfig {
  constructor() {
    this._redisInstance = new Configstore(path.join(pkg.name, '.redisConfig'));
  }

  insertInstance(instanceId, redisInstance) {
    return this._redisInstance.set(instanceId, redisInstance);
  }

  getInstance(name) {
    return this._redisInstance.get(name);
  }

  deleteInstance(name) {
    return this._redisInstance.delete(name);
  }

  listInstances() {
    return Object.values(this._redisInstance.all);
  }
}

module.exports = MemoryStoreConfig;
