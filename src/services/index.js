'use strict';

const cloudFunctioncmd = require('./cli-commands/cloud-function/cmd');
const cloudStoragecmd = require('./cli-commands/cloud-storage/cmd');

const commandsArray = [cloudFunctioncmd, cloudStoragecmd];

module.exports = {
  commands: commandsArray,
};
