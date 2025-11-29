const express = require('express');
const passport = require('passport');
const router = express.Router();

// HOME: optional login links page or redirect
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    req.session.destroy(() => res.redirect('/'));
  });
});

/* ===== Google OAuth ===== */
// trigger
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// callback
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // successful authentication
    res.redirect('/events');
  });

/* ===== GitHub OAuth ===== */
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/events');
  });

module.exports = router;
