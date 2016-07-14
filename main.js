console.log("Starting");

var express = require("express");
var mongoose = require("mongoose");
var morgan = require("morgan");
var fileStreamRotator = require("file-stream-rotator");
var fs = require("fs");
var path = require("path");
// NOTE: cookie-parser may interfere with express-session
var session = require("express-session");
var connectMongo = require("connect-mongo");
var bodyParser = require("body-parser");
var passport = require("passport");
var passportLocal = require("passport-local");
var bcrypt = require("bcrypt");

var config = require("./config.js");

var app = express();

/*
 * set up log
 */
var logDir = path.join(__dirname, config.logDir);
fs.existsSync(logDir) || fs.mkdirSync(logDir); // sync is ok while init
var logStream = fileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: logDir + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: true
})
app.use(morgan(config.logLevel, {stream: logStream}))

/*
 * server static files
 */
app.use(express.static(path.join(__dirname, 'view/static')));

/*
 * parse require body
 */
app.use(bodyParser.urlencoded({ extended: true }));

/*
 * connect to db
 */
mongoose.connect(config.dbUrl);
mongoose.connection.on("error", function() {
    logStream.write("[ERROR] Failed to connect to db " + config.dbUrl + '\n');
    process.exit();
});
mongoose.connection.once("open", function() {
    logStream.write("Connected to db " + config.dbUrl + '\n');
});

/*
 * load mongoose models
 */
models = {
    user: require("./model/user.js")(mongoose, bcrypt, passport, passportLocal, config)
};

/*
 * set up session
 */
var MongoStore = connectMongo(session);
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: config.sessionSecret,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

/*
 * set up passport
 */
app.use(models.user.passport.initialize());
app.use(models.user.passport.session());

/*
 * set up router
 */
app.use(require("./router.js")(express, path, __dirname, models));

/*
 * finally, go!
 */
app.listen(config.port);

