require('dotenv').config(); // Load .env variables

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function(passportInstance) {

  // Serialize user into session (only minimal info)
  passportInstance.serializeUser((user, done) => done(null, user.id));

  // Deserialize user from session
  passportInstance.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean();
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Google strategy
  passportInstance.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const provider = 'google';
      const providerId = profile.id;
      const existing = await User.findOne({ provider, providerId });
      if (existing) return done(null, existing);
      const user = await User.create({
        provider,
        providerId,
        displayName: profile.displayName || '',
        email: (profile.emails && profile.emails[0] && profile.emails[0].value) || ''
      });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // GitHub strategy
  passportInstance.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const provider = 'github';
      const providerId = profile.id;
      const existing = await User.findOne({ provider, providerId });
      if (existing) return done(null, existing);
      const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || '';
      const user = await User.create({
        provider,
        providerId,
        displayName: profile.displayName || profile.username || '',
        email
      });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

};