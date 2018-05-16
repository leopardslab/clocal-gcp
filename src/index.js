const commander = require('commander');
const chalk = require('chalk');
const CloudFunction = require('./services/cloud-functions/cloud-function');

const functions = new CloudFunction();

commander.version('1.0.0').description('Clocal GCP');

commander.command('func start').action(() => {
  try {
    console.log(chalk.blueBright('starting gcp functions ...'));
    const res = functions.start();
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
});

commander.parse(process.argv);
