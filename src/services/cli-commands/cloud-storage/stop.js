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
    console.log(chalk.blueBright('stopping gcp storage ...'));
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    const dockerId = config.get('storage');

    if (dockerId) {
      exec(`docker container stop ${dockerId}`, (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to stop\n${stderr}`));

        if (dockerId === stdout.trim()) {
          console.log(
            chalk.green.bgWhiteBright(`stopped gcp storage. ${dockerId}`)
          );
        } else {
          console.log(
            chalk.blueBright.bgRed(
              'something unintended happen. Try to manually stop the docker containers ...'
            )
          );
        }
        config.delete('storage');
      });
    } else {
      console.log(
        chalk.blueBright.bgRed('clocal gcp storage is not running ...')
      );
    }
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

module.exports = {
  commandName: 'storage-stop',
  action: action,
};
