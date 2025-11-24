/**
 * app.js — main Express app
 * - loads .env
 * - connects DB via config/db.js
 * - sets up middleware, routes and error handler
 */
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const connectDB = require('./config/db'); 
connectDB().then(() => console.log('MongoDB connected')).catch(err => console.error(err));

const indexRouter = require('./routes/index');
const eventsRouter = require('./routes/events');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));


// routes
app.use('/', indexRouter);
app.use('/events', eventsRouter);

// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Error', message: res.locals.message, error: res.locals.error });
});

module.exports = app;

