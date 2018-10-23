'use strict';

const cloudFunctioncmd = require('./cli-commands/cloud-function/cmd');
const cloudStoragecmd = require('./cli-commands/cloud-storage/cmd');
const cloudMemoryStore = require('./cli-commands/cloud-memory-store/cmd');

const commandsArray = [cloudFunctioncmd, cloudStoragecmd, cloudMemoryStore];

module.exports = {
  commands: commandsArray,
};
