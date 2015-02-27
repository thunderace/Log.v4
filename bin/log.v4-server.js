#!/usr/bin/env node
winston = require('winston');
logging = new winston.Logger({
  transports: [ new winston.transports.Console({
    level: 'error'
  })]
});
homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
webConf = require(homeDir + '/.Log.v4/web_server.conf').config;
webConf.logging = logging;
logConf = require(homeDir + '/.Log.v4/log_server.conf').config;
logConf.logging = logging;
server = require('../index.js');
logServer = new server.LogServer(logConf);
webServer = new server.WebServer(logServer, webConf);
webServer.run();
