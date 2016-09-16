var express = require('express');
var apiKeys = require('./api_keys.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://christopherpicato:password@localhost:5432/tickr', {sync: {force: true}});
var UserController = require('./db/UserController')(db, Sequelize);
var path = require('path');
var stripe = require("stripe")("sk_test_kctqJ5uj3zZEU4tZsesRYreu");

var controllers = require('./db/index.js');

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
  callbackURL: '/auth/facebook/callback',
  profileFields: ['email', 'displayName', 'gender']
},
  function(accessToken, refreshToken, profile, done) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    console.log(profile._json.email, profile._json.name);
    UserController.User.findOrCreate({
      where: {
        id: profile.id,
      }, defaults: {
        email: profile._json.email,
        name: profile._json.name
      }
    })
    .then(function(user) {
      // console.log('user created:', user);
      done(null, user);
      // accessToken, refreshToken, profile //TODO: will it es6? yes.
    })
    .catch(function(err) {
      done(err);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializeUser:', user);
  done(null, user[0].dataValues.id);
});

passport.deserializeUser(function(id, done) {
  UserController.User.findById(id).then(function(user) {
    done(null, user);
  }).catch(function(err) {
    done(err);
  });
});

require('./routes')(app, controllers); //model routes


app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email', 'user_about_me', 'user_friends']
}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/dashboard', 
    failureRedirect: '/'
  })
);

app.get('/checkLogin', function(req, res) {
  if (req.user) {
    res.send('authenticated');
  } else {
    res.send('unauthenticated');
  }
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// app.use()


if (process.env.NODE_ENV === 'production') {
  app.use('/compiled', express.static('../app/compiled'));
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../app/compiled', 'index.html'));
  });
  // app.get('/*', express.static('../app/compiled'));
} else { //if (process.env.NODE_ENV === 'development') {
  // app.get('/*', express.static('../app'));
  app.use('/compiled', express.static('../app'));
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../app', 'index.html'));
  });
}

// if (process.env.NODE_ENV === 'production') {
//   app.listen(80, function() {
//     console.log('listening on port 80');
//   });
// } else {
app.listen(3000, function() {
  console.log('listening on port 3000');
});
// }