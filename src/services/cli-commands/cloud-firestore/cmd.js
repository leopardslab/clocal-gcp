#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const Configstore = require('configstore');
const path = require('path');
const pkg = require('../../../../package.json');
const common = require('../common/cmd');
const removeContainer = require('../common/removeContainer');
const dockerImage = `cloudlibz/clocal-gcp-firestore:latest`;
const defaultPort = 8086;

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
    console.log(chalk.blueBright(`Starting gcp firestore on port ${defaultPort}...`));
    const config = new Configstore(path.join(pkg.name, '.containerList'));

    exec(`docker run -p 8086:8086 -t -d ${dockerImage}`, (err, stdout, stderr) => {
      config.set('firestore', stdout.trim());
      const dockerId = config.get('firestore');
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
          if (!err) console.log(chalk.green.bgWhiteBright(`gcp firestore started ...`));
        }
      ); 
    });
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

const stop = () => {
  try {
    console.log(chalk.blueBright('stopping gcp firestore ...'));
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    const dockerId = config.get('firestore');

    if (dockerId) {
      exec(`docker container rm -f ${dockerId}`, (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to stop\n${stderr}`));

        if (dockerId === stdout.trim()) {
          console.log(
            chalk.green.bgWhiteBright(`stopped gcp firestore. ${dockerId}`)
          );
        } else {
          console.log(
            chalk.blueBright.bgRed(
              'something unintended happen. Try to manually stop the docker containers ...'
            )
          );
        }
        config.delete('firestore');
      });
    } else {
      console.log(
        chalk.blueBright.bgRed('clocal gcp firestore is not running ...')
      );
    }
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

module.exports = {
  commandName: 'firestore <cmd> [first] [second]',
  action: action
};