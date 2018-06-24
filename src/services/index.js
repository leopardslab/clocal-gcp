'use strict';

const cloudFunctions = require('./cloud-functions/cli');
const cloudStorage = require('./cloud-storage/cli');

const commandsArray = [cloudFunctions, cloudStorage];

module.exports = {
  commands: commandsArray,
};
