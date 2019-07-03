const express = require('express');
const service = require('./service');
const pkg = require('./package.json');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const logger = console;
const app = express();
var http = require('http');
var httpServer = http.createServer(app);

httpServer.listen('8080')
service(app);
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// Process application/json
app.use(bodyParser.json())

const server = app.listen(process.env.PORT || 3000, () => {
  logger.info(`${pkg.name} service online\n`);
});

module.exports = server;
