var express = require('express');
var apiKeys = require('./api_keys.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

passport.use(new FacebookStrategy({
  clientID: apiKeys.Facebook_App_ID,
  clientSecret: apiKeys.Facebook_App_Secret,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
},
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate(function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
    done(null, {
      accessToken, refreshToken, profile //TODO: will it es6?
    });
  }
));
require('./routes')(app);

app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/', 
    failureRedirect: '/#/login'
  })
);

app.use('/production', express.static('../app/compiled'));
app.use('/*', express.static('../app'));
app.listen(3000, function() {
  console.log('listening on port 3000');
});