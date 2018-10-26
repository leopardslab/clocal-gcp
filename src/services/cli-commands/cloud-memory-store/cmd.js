'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const homedir = require('os').homedir();
const fs = require('fs');
const Configstore = require('configstore');
const path = require('path');
const pkg = require('../../../../package.json');

const dockerImage = `dilantha111/clocal-gcp-memory-store:0`;
const defaultPort = 7070;

const action = (cmd, first, second) => {
  switch (cmd) {
    case 'start':
      start();
      break;
    case 'stop':
      stop();
      break;

    default:
      console.log(`command invalid ${cmd} ${first} ${second}`);
  }
};

const start = () => {
  try {
    console.log(chalk.blueBright('starting gcp memory store ...'));
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    exec(
      `docker run -d -p ${defaultPort}:7070 ${dockerImage}`,
      (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to start\n${stderr}`));
        config.set('memorystore', stdout.trim());
        console.log(
          chalk.green.bgWhiteBright(
            `gcp memory store started. Listening on ${defaultPort}`
          )
        );
      }
    );
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

const stop = () => {
  try {
    console.log(chalk.blueBright('stopping  memory store ...'));
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    const dockerId = config.get('memorystore');

    if (dockerId) {
      exec(`docker container rm -f ${dockerId}`, (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to stop\n${stderr}`));

        if (dockerId === stdout.trim()) {
          console.log(
            chalk.green.bgWhiteBright(`stopped memory store. ${dockerId}`)
          );
        } else {
          console.log(
            chalk.blueBright.bgRed(
              'something unintended happen. Try to manually stop the docker containers ...'
            )
          );
        }
        config.delete('memorystore');
      });
    } else {
      console.log(
        chalk.blueBright.bgRed('clocal gcp memory store is not running ...')
      );
    }
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

module.exports = {
  commandName: 'mem <cmd> [first] [second]',
  action: action,
};
