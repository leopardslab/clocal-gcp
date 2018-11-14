var request = require('request');

request(function(error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
