#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const Configstore = require('configstore');
const path = require('path');
const pkg = require('../../../../package.json');
const common = require('../common/cmd');
const removeContainer = require('../common/removeContainer');
const dockerImage = `cloudlibz/clocal-gcp-bigtable:latest`;
const defaultPort = 8087;

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
    console.log(chalk.blueBright(`Starting gcp bigtable on port ${defaultPort}...`));
    const config = new Configstore(path.join(pkg.name, '.containerList'));

    exec(`docker run -p 8087:8087 -t -d ${dockerImage}`, (err, stdout, stderr) => {
      config.set('bigtable', stdout.trim());
      const dockerId = config.get('bigtable');
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
          if (!err) console.log(chalk.green.bgWhiteBright(`gcp bigtable started ...`));
        }
      ); 
    });
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

const stop = () => {
  try {
    console.log(chalk.blueBright('stopping gcp bigtable ...'));
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    const dockerId = config.get('bigtable');

    if (dockerId) {
      exec(`docker container rm -f ${dockerId}`, (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to stop\n${stderr}`));

        if (dockerId === stdout.trim()) {
          console.log(
            chalk.green.bgWhiteBright(`stopped gcp bigtable. ${dockerId}`)
          );
        } else {
          console.log(
            chalk.blueBright.bgRed(
              'something unintended happen. Try to manually stop the docker containers ...'
            )
          );
        }
        config.delete('bigtable');
      });
    } else {
      console.log(
        chalk.blueBright.bgRed('clocal gcp bigtable is not running ...')
      );
    }
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

module.exports = {
  commandName: 'bigtable <cmd> [first] [second]',
  action: action
};