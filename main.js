var express = require("express");
var morgan = require("morgan");
var fileStreamRotator = require("file-stream-rotator");
var fs = require("fs");
var path = require("path");

var config = require("./config.js");

var app = express();

// set up log
var logDir = path.join(__dirname, config.logDir);
fs.existsSync(logDir) || fs.mkdirSync(logDir); // sync is ok while init
var accessLogStream = fileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: logDir + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: config.logToStdout
})
app.use(morgan(config.logLevel, {stream: accessLogStream}))

// set up port
app.set("port", config.port);

// server static files before using router
app.use(express.static(path.join(__dirname, 'view')));

// use router
app.use(require("./router.js")(express, path, __dirname));

// finally, go!
app.listen(app.get("port"));
