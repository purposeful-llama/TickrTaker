// var db = require('./db/index.js');

module.exports = (app, db) => {

  //USERS ENDPOINT

  app.post('/signup', (req, res) => {
    db.UserController.addUser(req, res, req.body);
  });

  app.post('/signin', (req, res) => {
    db.UserController.logIn(req, res, req.body);
  });

  app.put('/users', (req, res) => {
    db.UserController.updateUser(req, res, req.body);
  });

  //ITEMS ENDPOINT
  app.get('/api/items/bids/:itemId', (req, res, next) => {
    db.BidController.getBidsForItem(req, res, next, req.params.itemId);
  });

  app.post('/api/items/bids/:itemId', (req, res, next) => {
    db.BidController.putBidOnItem(req, res, next, req.params.itemId);
    // res.send('POST /api/bids');
  });

  app.delete('/api/items/bids/:itemId', (req, res, next) => {
    db.BidController.removeBidFromItem(req, res, next, req.params.itemId);  
    // res.send('DELETE /api/bids');
  });

  app.get('/api/allitems', (req, res, next) => {
    db.ItemController.getAllItems(req, res, next);
  });

  app.post('/api/selleritems', (req, res, next) => {
    // console.log('request body******', req.body);
    db.ItemController.getItemsForSale(req, res, next);
    // res.send('GET /api/items');
  });

  app.post('/api/items', (req, res) => {
    db.ItemController.putItemForSale(req, res);
    // res.send('POST /api/items');
  });

  app.delete('/api/items', (req, res, next) => {
    db.ItemController.removeItemFromSale(req, res, next);
  });

  //BIDS ENDPOINT

  app.post('/api/bids', (req, res, next) => {
    console.log('***************', req.body);
    db.BidController.getBidsForSeller(req, res, next);
  });

  app.get('/api/user_data', function(req, res) {
    if (req.user === undefined) {
      // The user is not logged in
      res.json({});
    } else {
      res.json({
        user: req.user
      });
    }
  });

};
