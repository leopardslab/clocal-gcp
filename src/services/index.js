'use strict';

const cloudFunctions = require('./cloud-functions/cli');
const cloudStoragecmd = require('./cli-commands/cloud-storage/cmd');

const commandsArray = [cloudFunctions, cloudStoragecmd];

module.exports = {
  commands: commandsArray,
};
