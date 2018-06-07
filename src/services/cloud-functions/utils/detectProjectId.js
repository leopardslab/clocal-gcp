'use strict';

const execSync = require('child_process').execSync;

function trim(str) {
  if (str && typeof str.toString === 'function') {
    return str.toString().trim();
  }
  return str;
}

module.exports = projectId => {
  if (projectId) {
    return projectId;
  }
  if (process.env.GCLOUD_PROJECT) {
    return process.env.GCLOUD_PROJECT;
  }
  if (process.env.GOOGLE_CLOUD_PROJECT) {
    return process.env.GOOGLE_CLOUD_PROJECT;
  }
  try {
    projectId = trim(execSync(`gcloud info --format='value(config.project)'`));
  } catch (err) {
    // Print some error message?
  }

  return projectId;
};
