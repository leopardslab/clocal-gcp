const { exec } = require('child_process');

const getContainerDetails = dockerId=>{
    exec(`docker continer inspect -f '{{.State.Running}}' ${dockerId}`,(err,stdout,stderr)=>{
        // if(err){
        //     return 'Error while executing';
        // }
        // if(stdout.trim()){
        //     return 'Container is runnig';
        // }
        // return 'Container is not runnig';
        return stdout.trim();
    });
};

module.exports = getContainerDetails;