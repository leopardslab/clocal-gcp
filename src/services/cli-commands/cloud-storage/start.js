#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const homedir = require('os').homedir();
const fs = require('fs');
const Configstore = require('configstore');
const path = require('path');
const pkg = require('../../../../package.json');

const dockerImage = `dilantha111/clocal-gcp-storage:0`;
const defaultPort = 8000;

const action = () => {
  try {
    console.log(chalk.blueBright('starting gcp storage ...'));
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    exec(
      `docker run -d -p ${defaultPort}:8080 ${dockerImage}`,
      (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to start\n${stderr}`));
        config.set('storage', stdout.trim());
        console.log(
          chalk.green.bgWhiteBright(
            `started gcp storage. Listening on ${defaultPort}`
          )
        );
      }
    );
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

module.exports = {
  commandName: 'storage-start',
  action: action,
};
