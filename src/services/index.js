'use strict';

const cloudFunctions = require('./cloud-functions/cli');
const cloudStorageStart = require('./cli-commands/cloud-storage/start');
const cloudStorageStop = require('./cli-commands/cloud-storage/stop');

const commandsArray = [cloudFunctions, cloudStorageStart, cloudStorageStop];

module.exports = {
  commands: commandsArray,
};
