var UserController = require('./db/UserController.js');
var ItemController = require('./db/ItemController.js');
var BidController = require('./db/BidController.js');

var db = require('./db/index.js');

module.exports = (app) => {
  
  app.get('/', function(req, res) {
    res.send('try again');
  });

  //USERS ENDPOINT

 
  app.post('/signup', function(req, res) {
    db.User.find(req.body.username).then(function(user) {
      if(!user) {
        console.log('making a new user');
        db.User.Create().then(function() {
          res.send(JSON.stringify(req.body));
        });
      } else {
        console.log('User already exists');
        res.redirect('/signup');
      }
    });
  });
  
  app.post('/signin', function(req, res) {
    
    if(!req.body.password || !req.body.username) {
      console.log('needs password and username');
      res.redirect('/signin');
    } else {
      db.User.find({where: req.body, raw:true }).then(function(user) {
        if(!user) {
          console.log('no user');
          res.redirect('/signin');
        } else {
          console.log('theres a user');
          res.send(JSON.stringify(user));
        }
      });
    }
  });

  app.put('/users', function(req, res) {
    if(!req.body.password || !req.body.username) {
      console.log('needs password and username');
      res.redirect('/signin');
    } else {
      db.User.find({ where:{username: req.body.username}, raw:true}).then(function(user) {
        if(!user) {
          console.log('cannot edit nonexistent user');
          res.redirect('/items');
        } else {
          console.log('Updating User');
          db.User.update(req.body, {where: user}).then(function() {
            res.send('updated user' + req.body.username);
          });
          // res.redirect('/userinfo');
        }
      });
    }
  });

  //ITEMS ENDPOINT

  app.get('/api/items', function(req, res) {
    if(!req.get('username') || !req.get('password')) {
      res.redirect('/signin');
    } else {
      var username = req.get('username');
      var password = req.get('password');
      
      db.User.find({ where: {username: username, password: password}, raw:true }).then(function(user) {
        if(!user) {
          res.redirect('/signin');
        } else {
          db.Item.findAll({where: {userId: user.userId}, raw: true}).then(function(items) {
            console.log(items);
            res.send(items);
          })
        }
      })
    }
    // res.send('GET /api/items');
  });
  
  app.post('/api/items', function(req, res) {
    if(!req.get('username') || !req.get('password')) {
      res.redirect('/signin');
    } else {
      var username = req.get('username');
      var password = req.get('password');
      
      db.User.find({where: {username: username, password: password}}.then(function(user) {
        if(!user) {
          res.redirect('/signin');
        } else {
          db.Item.create(req.body).then(function(item) {
              user.addItem(item);
              console.log(user);
              res.send('created new item');
          });
        }
      }))
    }
    // res.send('POST /api/items');
  });
  
  app.delete('/api/items', function(req, res) {
    if(!req.get('username') || !req.get('password')) {
      res.redirect('/signin');
    } else {
      var username = req.get('username');
      var password = req.get('password');
      
      db.User.find({where: {username: username, password: password}, raw: true}.then(function(user) {
        if(!user) {
          res.redirect('/signin');
        } else {
          db.Item.create(req.body).then(function(item) {
              console.log(item);
              res.send('created new item');
          });
        }
      }))
    }
  });

  //BIDS ENDPOINT

  app.get('/api/bids', function(req, res) {
    res.send('GET /api/bids');
  });
  
  app.post('/api/bids', function(req, res) {
    res.send('POST /api/bids');
  });
  
  app.delete('/api/bids', function(req, res) {
    res.send('DELETE /api/bids');
  });

}