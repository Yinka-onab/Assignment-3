module.exports = function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  // optional: store original URL to redirect after login
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};
