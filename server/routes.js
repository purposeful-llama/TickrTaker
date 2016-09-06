var UserController = require('./db/UserController.js');
var ItemController = require('./db/ItemController.js');
var BidController = require('./db/BidController.js');

var db = require('./db/index.js');

module.exports = (app) => {

  var authenticate = function(req, res, next) {
    if (!req.get('username') || !req.get('password')) {
      console.log('username or password missing in headers');
      res.redirect('signin');
    } else { 
      var username = req.get('username');
      var password = req.get('password');
      db.User.find({where: {
        username: username,
        password: password
      }, raw: true})
      .then(function(user) {
        if (!user) {
          console.log('couldnt find the user with that information');
          res.redirect('signin');
        } else {
          next();
        }
      });
    }

  };
  //USERS ENDPOINT

  app.post('/signup', function(req, res) {

    console.log('signing up');
    if (req.body.username) {
      db.User.find(req.body.username)
      .then(function(user) {
        if (!user) {
          console.log('making a new user');
          db.User.Create().then(function() {
            res.send(JSON.stringify(req.body));
          });
        } else {
          console.log('User already exists');
          res.redirect('/signin');
        }
      });
    } else {
      res.redirect('/signin');
    }
  });

  app.post('/signin', function(req, res) {

    if (!req.body.password || !req.body.username) {
      console.log('needs password and username');
      res.redirect('/signin');
    } else {
      db.User.find({ where: req.body, raw: true })
      .then(function(user) {
        if (!user) {
          console.log('no user');
          res.redirect('/signin');
        } else {
          console.log('theres a user');
          res.send(JSON.stringify(user));
        }
      });
    }
  });

  app.put('/users', authenticate, function(req, res) {
    db.User.find({ where: { username: req.body.username }, raw: true })
    .then(function(user) {
      if (!user) {
        console.log('cannot edit nonexistent user');
        res.redirect('/signin');
      } else {
        console.log('Updating User');
        db.User.update(req.body, { where: user })
        .then(function() {
          res.send('updated user' + req.body.username);
        });
      }
    });
  });

  //ITEMS ENDPOINT

  app.get('/api/items', authenticate, function(req, res) {
    var username = req.get('username');
    var password = req.get('password');

    db.User.find({ where: { username: username, password: password }, raw: true })
    .then(function(user) {
      if (!user) {
        res.redirect('/signin');
      } else {
        user.getItems({raw: true})
        .then(function(items) {
          console.log(items);
          res.send(items);
        });
      }
    });
    // res.send('GET /api/items');
  });

  app.post('/api/items', authenticate, function(req, res) {

    var username = req.get('username');
    var password = req.get('password');

    db.User.find({ where: { username: username, password: password } })
    .then(function(user) {
      if (!user) {
        res.redirect('/signin');
      } else {
        db.Item.create(req.body)
        .then(function(item) {
          user.addItem(item);
          console.log(user);
          res.send('created new item');
        });
      }
    });
    // res.send('POST /api/items');
  });

  app.delete('/api/items', authenticate, function(req, res) {
    var username = req.get('username');
    var password = req.get('password');

    db.User.find({ where: { username: username, password: password }, raw: true })
    .then(function(user) {
      if (!user) {
        res.redirect('/signin');
      } else {
        db.Item.create(req.body)
        .then(function(item) {
          console.log(item);
          res.send('created new item');
        });
      }
    });
  });

  //BIDS ENDPOINT

  app.get('/api/bids', authenticate, function(req, res) {
    var username = req.get('username');
    var password = req.get('password');

    db.User.find({ where: { username: username, password: password }, raw: true })
    .then(function(user) {
      if (!user) {
        res.redirect('/signin');
      } else {
        db.Bid.Create(req.body)
        .then(function(bid) {
          console.log(item);
          res.send('created new item');
        });
      }
    });
  });

  app.post('/api/bids', authenticate, function(req, res) {
    var username = req.get('username');
    var password = req.get('password');
    var itemId = req.get('item');
    db.User.find({ where: { username: username, password: password }})
    .then(function(user) {
      if (!user) {
        res.redirect('/signin');
      } else {
        db.Item.findOne({id: itemId})
        .then(function(item) {
          db.Bid.Create(req.body)
          .then(function(bid) {
            item.addBid(bid);
            user.addBid(bid);
            console.log(item);
            res.send('created new item');
          });
        });
      }
    });
    // res.send('POST /api/bids');
  });

  app.delete('/api/bids', authenticate, function(req, res) {
    var username = req.get('username');
    var password = req.get('password');
    var itemId = req.get('item');
    db.User.find({ where: { username: username, password: password }})
    .then(function(user) {
      if (!user) {
        res.redirect('/signin');
      } else {
        db.Item.findOne({id: itemId})
        .then(function(item) {
          db.Bid.findOneAndRemove(req.body)
          .then(function(bid) {
            item.removeBid(bid);
            user.removeBid(bid);
            console.log(item);
            res.send('deleted item');
          });
        });
      }
    });    
    // res.send('DELETE /api/bids');
  });

};
