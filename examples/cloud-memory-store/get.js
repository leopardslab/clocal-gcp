var request = require('request');

var options = {
  method: 'GET',
  url:
    'http://localhost:7070/v1beta1/projects/testProject/locations/us-east-1/instances/redisTest123',
  headers: {
    'Postman-Token': '8be7f29e-cff0-4b95-a43a-6eb347bc0e37',
    'Cache-Control': 'no-cache',
  },
};

request(options, function(error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
