const passport = require("passport");
const User = require("../models/User");

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.send"],
});

exports.googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/login",
});

exports.googleAuthCallbackHandler = (req, res) => {
  res.redirect(process.env.FRONTEND_URL);
};