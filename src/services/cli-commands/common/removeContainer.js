const { exec } = require('child_process');
const chalk = require('chalk');

const removeContainer = dockerId =>{
    if(dockerId){
      exec(`docker rm -f ${dockerId}`,(err,stdout,stderr)=>{
        if(err) {
          console.log(chalk.bgRed(`failed to execute\n${stderr}`));
          console.log(chalk.bgRed(`Please remove the container manualy before start the service again.\n container ID ${dockerId}`));
        }
      });
    }
}

module.exports = removeContainer;