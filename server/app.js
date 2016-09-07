var express = require('express');
var apiKeys = require('./api_keys.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://ubuntu:password@localhost:5432/tickr');
var UserController = require('./db/UserController')(db, Sequelize);
var app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ 
  secret: 'keyboard cat', 
  resave: true, 
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: apiKeys.Facebook_App_ID,
  clientSecret: apiKeys.Facebook_App_Secret,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['email', 'displayName', 'gender']
},
  function(accessToken, refreshToken, profile, done) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    UserController.User.findOrCreate({
      where: {
        facebookId: profile.id
      }
    }).catch(function(err) {
      done(err);
    }).then(function(user) {
      done(null, user);
      // accessToken, refreshToken, profile //TODO: will it es6? yes.
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });
  done(null, id);
});


require('./routes')(app, db);

app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email', 'user_about_me', 'user_friends']
}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/#/', 
    failureRedirect: '/#/login'
  })
);

app.use('/production', express.static('../app/compiled'));
app.use('/*', express.static('../app'));
app.listen(3000, function() {
  console.log('listening on port 3000');
});
