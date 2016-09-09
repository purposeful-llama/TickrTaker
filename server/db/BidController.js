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
      console.log(item.dataValues, '<<<<<<<<<<<<<<<<<<<<<<<<<');
      item.getBids({raw: true})
      .then(function(bids) {
        console.log(bids);
        res.send(bids);
      });
    });
  };

  var putBidOnItem = (req, res, next, itemId) => {
    User.findOne({where: {id: req.body.user.user.id}})
    .then(function(bidder) {
      Item.findOne({where: {id: itemId}})
      .then(function(item) {
        Bid.create({price: Number(req.body.bid)})
        .then(function(bid) {
          item.addBid(bid).then(function() {
            item.getBids({raw: true}).then(function(bids) {
              console.log('BIDS ARE HERE >>>>>>>>>>', bids);
            });
            res.send(item.dataValues);
            
          });
          bidder.addBid(bid);
          console.log(item);
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