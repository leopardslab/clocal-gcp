/**
 * Before running this file make sure GOOGLE_APPLICATION_CREDENTIALS variable is set
 */

const Storage = require('@google-cloud/storage');
const gcs = new Storage();

gcs.interceptors.push({
  request: reqOpts => {
    reqOpts.uri = 'http://localhost:8000/storage/v1/b';
    return reqOpts;
  },
});

gcs
  .createBucket('dilantha-test-bucket')
  .then(res => console.log(res))
  .catch(err => console.log(err));
