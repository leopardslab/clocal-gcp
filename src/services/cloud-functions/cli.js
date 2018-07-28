#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const CloudFunction = require('./cloud-function');

const functions = new CloudFunction();

const action = () => {
  try {
    console.log(chalk.blueBright('starting gcp functions ...'));
    const res = functions.start();
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

module.exports = {
  commandName: 'func start',
  action: action,
};
