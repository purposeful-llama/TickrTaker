// var async = require('async');
module.exports = (db, Sequelize, User, Item) => {
  var Bid = db.define('bid', {
    price: {type: Sequelize.FLOAT, allowNull: false}
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
    console.log('GETTING BIDS FOR SELLER');
    User.findOne({where: {id: req.body.user.id}})
    .then(function(user) {
      user.getBids({raw: true})
      .then(function(bids) {
        console.log('BIDS ******************', bids);
        var itemArr = [];
        var asyncBids = bids.map(function(bid) {
          return Item.find({where: {id: bid.itemId}})
          .then(function(item) {
            return item.getBids({raw: true})
            .then(function(itemBids) {
              var maxBid = 0;
              itemBids.forEach(function(bidsOnItem) {
                if (bidsOnItem.price > maxBid) {
                  maxBid = bidsOnItem.price;
                }
              });
              itemArr.push({item: item.dataValues, myBid: bid, highestBid: maxBid});
              // console.log(itemArr);
            });
            // itemArr.push({item : item, bid: bid});
          });
        });
        Promise.all(asyncBids)
        .then(function() {
          console.log('sending item array', itemArr);
          res.send(itemArr);
        });
      });
    });
  };

  var getBidsForItem = (req, res, next, itemId) => {
    console.log('ITEM ID', itemId);
    Item.find({where: {id: itemId}})
    .then(function(item) {
      item.getBids({raw: true})
      .then(function(bids) {
        console.log(bids);
        res.send(bids);
      });
    });
  };

  var validateBid = (bid, itemId, cb) => {
    console.log('this is the bid', bid);
    valid = true;
    
    if (bid < 0.01) {
      valid = false;
    }

    Item.findOne({where: {id: itemId}})
    .then(function(item) {

      if (Date.parse(item.dataValues.endDate) < Date.parse(Date())) {
        valid = false;
      }

      item.getBids({raw: true})
      .then(function(bids) {
        bids.forEach(function(itemBid) {
          if (itemBid.price > bid) {
            valid = false;
          }
        });
        console.log('value of valid', valid);
        
        if (valid) {
          cb();
        } else {
          return;
        }
      })
      .catch(function(error) {
        console.log('could not validate', error);
        return;
      });
    });
  };
  
  var updateBid = (req, res, user, bid, itemId, cb1, cb2) => {
    console.log('bid value' + Number(bid));
    User.findOne({where: {id: user.id}})
    .then(function(user) {
      user.getBids()
      .then(function(bids) {
        bids.forEach(function(userBid) {
          if (userBid.dataValues.itemId === Number(itemId)) {
            userBid.update({price: Number(bid)})
            .then(() => {
              cb1();
            });
          }
        });
      });
    });
  };

  var putBidOnItem = (req, res, next, itemId) => {
    validateBid(req.body.bid, itemId, () => {
      console.log(req.body);
      updateBid(req, res, req.body.user.user, req.body.bid, itemId, null, () => {
        User.findOne({where: {id: req.body.user.user.id}})
        .then(function(bidder) {
          Item.findOne({where: {id: itemId}})
          .then(function(item) {
            Bid.create({price: Number(req.body.bid)})
            .then(function(bid) {
              item.addBid(bid).then(function() {
                item.getBids({raw: true}).then(function(bids) {
                  // console.log('BIDS ARE HERE >>>>>>>>>>', bids);
                });
                res.send(item.dataValues);
                
              });
              bidder.addBid(bid);
              // console.log(item);
            });
          });
        });
      });
    }); 
  };

  var removeBidFromItem = (req, res, next, itemId) => {
    User.findOne({where: {id: req.body.user.id}})
    .then(function(user) {
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
    removeBidFromItem: removeBidFromItem,
    putBidOnItem: putBidOnItem
  };
};