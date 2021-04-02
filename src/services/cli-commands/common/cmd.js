#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const program = require('commander');
const Configstore = require('configstore');

const path = require('path');
const pkg = require('../../../../package.json');

const action = (cmd, first, second, command) => {
  switch (cmd) {
    case 'status':
      status();
      break;
    default:
      console.log(`command invalid ${cmd} ${first} ${second}`);
  }
};

const status =() =>{
  const config = new Configstore(path.join(pkg.name, '.containerList'));
    const containers = config.all;
    
    console.log(chalk.green('Service Status\n'));

    Object.keys(containers).forEach(element => {
        exec(`docker container inspect -f '{{.State.Running}}' ${containers[element]}`,(err,stdout,stderr) => {
          if(err){
               return console.log(chalk.blue(`Cloud ${element} : `),'Unavailable');
          }
          if(stdout.trim()){
              exec(`docker port ${containers[element]} | fgrep -w 0.0.0.0 | cut -d ':' -f2`, (err,stdout,stderr) =>{
                if(err){
                  return console.log(chalk.blue(`Cloud ${element} : `),chalk.bgReg(`Container is running but failed to execute\n ${stderr}`));
                }
                return console.log(chalk.blue(`Cloud ${element} : `),`Running at http://localhost:${stdout}`);
              });
          }
          return console.log(chalk.blue(`Cloud ${element} : `),'Stopped'); 
      });
    });
};

const figlet = () => {
    return chalk.cyan("\n"+
    "____ _    ____ ____ ____ _       ____ ____ ___  \n"+
    "|    |    |  | |    |  | |       |    |    |  | \n"+
    "|    |    |  | |    |__| |    __ | __ |    |__] \n"+
    "|___ |___ |__| |___ |  | |___    |__] |___ |    \n"+
    "                                                \n"
  );
}
module.exports = {
  commandName: '',
  figlet:figlet,
  action:action
};
