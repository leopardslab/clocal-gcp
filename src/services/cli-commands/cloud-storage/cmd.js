#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const homedir = require('os').homedir();
const fs = require('fs');
const Configstore = require('configstore');
const path = require('path');
const pkg = require('../../../../package.json');
const common = require('../common/cmd');
const dockerImage = `cloudlibz/clocal-gcp-storage:latest`;
const defaultPort = 8001;

const action = (cmd, first, second) => {
  switch (cmd) {
    case 'start':
      start();
      break;
    case 'stop':
      stop();
      break;
    case 'create':
      create(first);
      break;
    case 'update':
      updateObject(); 
      break;
    case 'delete':
      deleteBucket(first);
      break;
    case 'cp':
      copyObject(first, second);
      break;
    case 'ls':
      listObjects(first);
      break;
    default:
      console.log(`command invalid ${cmd} ${first} ${second}`);
  }
};

const _getBucketName = gcpUrl => {
  const path = gcpUrl.replace('gs://', '');
  return path.substr(0, path.indexOf('/'));
};

const _isBucketUrl = url => url.includes('gs://');

const _uploadObject = (srcPath, dockerId, destPath) => {
  const fileName = path.parse(srcPath).base;
  const bucketName = _getBucketName(destPath);
  const copyPath = `/tmp/${fileName}`;

  exec(`docker cp ${srcPath} ${dockerId}:/tmp/`, (err, stdout, stderr) => {
    if (err) console.log(chalk.bgRed(`failed to execute\n${stderr}`));

    exec(
      `docker exec ${dockerId} bash scripts/upload.sh ${copyPath} ${fileName} ${bucketName}`,
      (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to execute\n${stderr}`));
        console.log(`${stdout}`);
      }
    );
  });
};

const _downloadObject = (srcPath, dockerId, destPath) => {
  const bucketName = _getBucketName(srcPath);
  const fileName = path.parse(srcPath).base;
  const containerSrcLocation = `/root/.clocal-gcp/storage/${bucketName}/${fileName}`;
  exec(
    `docker cp ${dockerId}:${containerSrcLocation} ${destPath}`,
    (err, stdout, stderr) => {
      if (err) console.log(chalk.bgRed(`failed to execute\n${stderr}`));
      console.log(
        `Downloaded object ${fileName} from ${bucketName} bucket to ${destPath}`
      );
    }
  );
};

const listObjects = (bucketName) => {
  try {
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    const dockerId = config.get('storage');
    exec(
      `docker exec ${dockerId} bash scripts/list.sh ${bucketName}`,
      (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to execute\n${stderr}`));
        console.log(`${stdout}`);
      }
    );
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

const updateObject = (bucketName) => {
  try {
    exec(
      `docker exec ${dockerId} bash scripts/update.sh ${bucketName}`,
      (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to execute\n${stderr}`));
        console.log(`${stdout}`);
      }
    );
    throw Error('incomplete implementation');
  } catch (err) {
      return false;
  }
};

const deleteObject = (bucketName, fileName) => {
  try {
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    const dockerId = config.get('storage');
    exec(
      `docker exec ${dockerId} bash scripts/rm.sh ${bucketName} ${fileName}`,
      (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to execute\n${stderr}`));
        console.log(`${stdout}`);
      }
    );
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
}

const copyObject = (srcPath, destPath) => {
  try {
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    const dockerId = config.get('storage');

    /**
     * upload object
     */
    if (!_isBucketUrl(srcPath) && _isBucketUrl(destPath)) {
      _uploadObject(srcPath, dockerId, destPath);
    } else if (_isBucketUrl(srcPath) && _isBucketUrl(destPath)) {
      /**
       * copy an object between buckets
       */
      exec(
        `docker exec ${dockerId} bash scripts/cp.sh ${srcPath} ${destPath}`,
        (err, stdout, stderr) => {
          if (err) console.log(chalk.bgRed(`failed to execute\n${stderr}`));
          console.log(`${stdout}`);
        }
      );
    } else if (_isBucketUrl(srcPath) && !_isBucketUrl(destPath)) {
      /**
       * download object from bucket
       */
      _downloadObject(srcPath, dockerId, destPath);
    }
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

const create = bucketName => {
  try {
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    const dockerId = config.get('storage');
    exec(
      `docker exec ${dockerId} bash scripts/create.sh ${bucketName}`,
      (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to execute\n${stderr}`));
        console.log(`${stdout}`);
      }
    );
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

const deleteBucket = bucketName => {
  try {
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    const dockerId = config.get('storage');
    exec(
      `docker exec ${dockerId} bash scripts/delete.sh ${bucketName}`,
      (err, stdout, stderr) => {
        if (err) console.log(chalk.bgRed(`failed to execute\n${stderr}`));
        const message =
          stdout.trim() === 'true'
            ? `${bucketName} deleted successfully`
            : `Not deleted check whether bucket exists or not empty`;
        console.log(message);
      }
    );
  } catch (err) {
    console.log(chalk.blueBright.bgRed(err));
  }
};

const start = () => {
  console.log(common.figlet());
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

const stop = () => {
  try {
    console.log(chalk.blueBright('stopping gcp storage ...'));
    const config = new Configstore(path.join(pkg.name, '.containerList'));
    const dockerId = config.get('storage');

    if (dockerId) {
      exec(`docker container rm -f ${dockerId}`, (err, stdout, stderr) => {
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
  commandName: 'storage <cmd> [first] [second]',
  action: action,
};
