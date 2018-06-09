#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const RestService = require('./rest-service');
const Model = require('./model');

const functions = new RestService(
  Model.functions({
    storage: 'configstore',
    host: 'localhost',
    supervisorPort: 8010,
  })
);

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
