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
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const connectDB = require('./config/db');
connectDB().then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// Passport config
require('./config/passport')(passport);

const indexRouter = require('./routes/index');
const eventsRouter = require('./routes/events');
const authRouter = require('./routes/auth');

const app = express();

// ===== VIEW ENGINE =====
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ===== MIDDLEWARE =====
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

// ===== SESSION MIDDLEWARE (REQUIRED FOR AUTH) =====
app.use(
  session({
    secret: process.env.SESSION_SECRET || "devSecret123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// ===== PASSPORT INITIALIZATION =====
app.use(passport.initialize());
app.use(passport.session());

// ===== MAKE USER AVAILABLE IN ALL VIEWS =====
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
});

// ===== ROUTES =====
app.use('/', indexRouter);
app.use('/', authRouter);      // Google + GitHub routes
app.use('/events', eventsRouter);

// ===== 404 CATCH =====
app.use(function(req, res, next) {
  next(createError(404));
});

// ===== ERROR HANDLER =====
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error =
    req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
    message: res.locals.message,
    error: res.locals.error
  });
});

module.exports = app;
