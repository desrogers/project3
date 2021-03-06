// this allows us to have a authenticated user login and sign up.
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
var db = require("../models");

//what we are doing to log in

passport.use(
  new localStrategy(
    {
      usernameField: "email"
    },
    function(email, password, done) {
      db.User.findOne({
        email: email
      }).then(function(dbUser) {
        if (!dbUser) {
          return done(null, false, { message: "Incorrect Email" });
        } else if (!dbUser.validPassword(password)) {
          return done(null, false, { message: "Incorrect Password" });
        } else {
          done(null, dbUser);
        }
      });
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});
passport.deserializeUser(function(id, cb) {
  db.User.findById(id, function(err, user){
    if(!err) cb(null, user);
    else cb(err, null)
  })
});

module.exports = passport;