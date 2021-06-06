const { SceHttpServer } = require('./api/util/SceHttpServer');
require('./util/temp_users')

function main() {
  const API_ENDPOINTS = [
    __dirname + '/api/routes/'
  ];
  const mainEndpointServer = new SceHttpServer(API_ENDPOINTS, 8080);
  mainEndpointServer.initializeEndpoints().then(() => {
    mainEndpointServer.openConnection();
  });
}

//start Express-Server
main();
