const CloudLocal = require('../gcp/cloud-local');

class CloudFunction extends CloudLocal {
  init() {
    this.port = 7574;
    this.app.get('/', (req, res) => {
      res.send('Welcome to cloud functions local');
    });
  }
}

module.exports = CloudFunction;
