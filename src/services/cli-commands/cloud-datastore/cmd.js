#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const Configstore = require('configstore');
const path = require('path');
const pkg = require('../../../../package.json');
const common = require('../common/cmd');
const removeContainer = require('../common/removeContainer');
const dockerImage = `cloudlibz/clocal-gcp-datastore:latest`;
const defaultPort = 8081;

const action = (cmd, first, second, command) => {
  switch (cmd) {
    case 'start':
      start(command);
      break;
    case 'stop':
      stop()
      break;
    default:
      console.log(`command invalid ${cmd} ${first} ${second}`);
  }
};

const start = () => {
  console.log(common.figlet());
  try {
    console.log(chalk.blueBright(`Starting gcp datastore on port ${defaultPort}...`));
    const config = new Configstore(path.join(pkg.name, '.containerList'));

    exec(`docker run -p 8081:8081 -t -d ${dockerImage}`, (err, stdout, stderr) => {
      config.set('datastore', stdout.trim());
      const dockerId = config.get('datastore');
      if (err){
        removeContainer(dockerId);
        return console.log(chalk.bgRed(`failed to start\n${stderr}`));
      }
      exec(
        `docker exec -t -d ${dockerId} bash scripts/start.sh`,
        (err, stdout, stderr) => {
          if (err){
            removeContainer(dockerId);
            return console.log(chalk.bgRed(`failed to execute\n${stderr}`));
          }
          console.log(stdout);
          if (!err) console.log(chalk.green.bgWhiteBright(`gcp datastore started ...`));
        }
      ); 
    });
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

const stop = () => {
  try {
    console.log(chalk.blueBright('stopping gcp datastore ...'));
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    const dockerId = config.get('datastore');

    if (dockerId) {
      exec(`docker container rm -f ${dockerId}`, (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to stop\n${stderr}`));

        if (dockerId === stdout.trim()) {
          console.log(
            chalk.green.bgWhiteBright(`stopped gcp datastore. ${dockerId}`)
          );
        } else {
          console.log(
            chalk.blueBright.bgRed(
              'something unintended happen. Try to manually stop the docker containers ...'
            )
          );
        }
        config.delete('datastore');
      });
    } else {
      console.log(
        chalk.blueBright.bgRed('clocal gcp datastore is not running ...')
      );
    }
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

module.exports = {
  commandName: 'datastore <cmd> [first] [second]',
  action: action
};