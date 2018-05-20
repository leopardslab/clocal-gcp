'use strict';

const cloudFunctions = require('./cloud-functions/cli');

const commandsArray = [cloudFunctions];

module.exports = {
  commands: commandsArray,
};
