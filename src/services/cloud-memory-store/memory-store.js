const MemoryStoreConfig = require('./memory-store-config');

class MemoryStore {
  constructor() {
    this._memoryStoreConfig = new MemoryStoreConfig();
  }

  createStore(instance) {
    this._memoryStoreConfig.insertInstance(
      instance.instanceId,
      instance.instance
    );
    return this._getRedisOperationInstance(
      instance.projectId,
      instance.instanceId
    );
  }

  getStore(instanceId) {
    return this._memoryStoreConfig.getInstance(instanceId);
  }

  deleteStore(instanceId) {
    return this._memoryStoreConfig.deleteInstance(instanceId);
  }

  listStore() {
    return this._memoryStoreConfig.listInstances();
  }

  _getRedisOperationInstance(projectId, instanceId) {
    const operation = {
      name: `operations/${projectId}/${instanceId}`,
      done: true,
    };
    return operation;
  }
}

module.exports = MemoryStore;
