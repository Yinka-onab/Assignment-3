// config/db.js
// Keeps DB connection logic separate from app.js; uses MONGO_URI from .env

const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

function connectDB() {
  if (!mongoURI) {
    return Promise.reject(new Error('MONGO_URI not set in .env'));
  }
  return mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

module.exports = connectDB;
