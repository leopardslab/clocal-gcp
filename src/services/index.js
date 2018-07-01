'use strict';

const cloudFunctions = require('./cloud-functions/cli');
const cloudStorageStart = require('./cli-commands/cloud-storage/start');

const commandsArray = [cloudFunctions, cloudStorageStart];

module.exports = {
  commands: commandsArray,
};
