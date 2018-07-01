#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const homedir = require('os').homedir();
const fs = require('fs');

const dockerImage = `dilantha111/clocal-gcp-storage:0`;
const defaultPort = 8000;

const action = () => {
  try {
    console.log(chalk.blueBright('starting gcp storage ...'));
    exec(`docker run -d -p ${defaultPort}:8080 ${dockerImage}`, err => {
      if (err) console.log(chalk.bgRed(`failed to start\n${err}`));
      console.log(
        chalk.green.bgWhiteBright(
          `started gcp storage. Listening on ${defaultPort}`
        )
      );
    });
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

module.exports = {
  commandName: 'storage start',
  action: action,
};
