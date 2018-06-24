#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const CloudStorage = require('./cloud-storage');

const storage = new CloudStorage();

const action = () => {
  try {
    console.log(chalk.blueBright('starting gcp storage ...'));
    const res = storage.start();
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

module.exports = {
  commandName: 'storage start',
  action: action,
};
