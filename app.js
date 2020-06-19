// just so we can use require("lib/...") from everywhere in the project
require('app-module-path').addPath(`./${__dirname}`);
require("dotenv").config(); // read the .env file into process.env

const debug = require('debug')('app:entrypoint');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require("cors");
const fileUpload = require("express-fileupload");
const db = require('./db');
const indexRouter = require('./routes');
const { sessionOpts, corsOpts, uploadOpts } = require("./config");

const app = express();

/** Start the db */
db.start()

app.use((req, res, next) => {
  if(process.env.NODE_ENV === "development" && app.worker)
    debug(app.worker.id);
  next();
})

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'upload')));

app.use(session(sessionOpts));

app.use(fileUpload(uploadOpts));

app.use(cors(corsOpts));

// On a ici notre router complet
// Si on veut modifier/ajouter des routes on le fait direct dans le dossier routes
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
