module.exports = (db, Sequelize, User, Item) => {
  var Bid = db.define('bid', {
    price: {type: Sequelize.INTEGER, allowNull: false}
  });

  var checkUser = (req, res, rawBool, callback) => {
    var username = req.get('username');
    var password = req.get('password');
    User.find({ where: { username: username, password: password }, raw: rawBool })
    .then(function(user) {
      if (!user) {
        res.redirect('signin');
      } else {
        callback(req, res, user);
      }
    });
  };

  var getBidsForSeller = (req, res, next) => {
    checkUser(req, res, false, function(req, res, user) {
      db.Bid.Create(req.body)
      .then(function(bid) {
        console.log(bid);
        res.send('created new bid');
      });
    });
  };

  var getBidsForItem = (req, res, next, itemId) => {
    Item.find({id: itemId})
    .then(function(item) {
      item.getBids({raw: true}).then(function(bids) {
        console.log(bids);
        res.send(bids);
      });
    });
  };

  var putBidOnItem = (req, res, next, itemId) => {
    checkUser(req, res, false, function(req, res, bidder) {
      db.Item.findOne({id: itemId})
      .then(function(item) {
        db.Bid.Create(req.body)
        .then(function(bid) {
          item.addBid(bid);
          bidder.addBid(bid);
          console.log(item);
          res.send(item.dataValues);
        });
      });
    });
  };

  var removeBidFromItem = (req, res, next, itemId) => {
    checkUser(req, res, false, function(req, res, user) {
      Item.findOne({where: {id: itemId}, raw: true})
      .then(function(item) {
        Bid.destroy({where: {itemId: item.id, userId: user.id}})
        .then(function(bid) {
          console.log(bid);
          res.send('deleted item');
        });
      });
    });  
  };

  return {
    Bid: Bid,
    getBidsForSeller: getBidsForSeller,
    getBidsForItem: getBidsForItem,
    removeBidFromItem: removeBidFromItem
  };
};