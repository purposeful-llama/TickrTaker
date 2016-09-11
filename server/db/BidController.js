// var async = require('async');
module.exports = (db, Sequelize, User, Item) => {
  var Bid = db.define('bid', {
    price: {type: Sequelize.FLOAT, allowNull: false}
  });

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

  var validateBid = (req, res, bid, itemId, user, cb) => {
    console.log('this is the bid', bid);
    valid = true;
    
    if (bid < 0.01) {
      valid = false;
    }

    Item.findOne({where: {id: itemId}})
    .then(function(item) {
      if (item.dataValues.valid === false) {
        valid = false;
      }
      if (item.userId === user.id) {
        valid = false;
      }
      if (Date.parse(new Date(item.dataValues.endDate)) < Date.parse(Date())) {
        valid = false;
      }
      if (((item.dataValues.startPrice - item.dataValues.endPrice) / 
    ((Date.parse(item.dataValues.endDate)) - Date.parse(item.dataValues.startDate))
    * (Date.parse(item.dataValues.endDate) - Date.now())) + item.dataValues.endPrice < bid) {
        valid = false;
      }

      item.getBids({raw: true})
      .then(function(bids) {
        bids.forEach(function(itemBid) {
          if ((itemBid.price + item.minimumBidIncrement > bid)) {
            valid = false;
          }
        });
        console.log('value of valid', valid);
        
        if (valid) {
          cb();
        } else {
          res.send('not a valid bid');
          return;
        }
      })
      .catch(function(error) {
        console.log('could not validate', error);
        return;
      });
    });
  };
  var updateItemEndDate = (itemId, bidValue) => {
    Item.find({where: {id: itemId}})
    .then(function(item) {
      console.log(new Date( Date.parse(item.endDate) - ((Date.parse(item.endDate) - Date.parse(item.startDate)) / (item.endPrice - item.startPrice)) * (item.endPrice - bidValue)));
      console.log(item.dataValues);
      item.update({auctionEndDateByHighestBid: new Date( Date.parse(item.endDate) - ((Date.parse(item.endDate) - Date.parse(item.startDate)) / (item.endPrice - item.startPrice)) * (item.endPrice - bidValue))})
      .then(function(item) {
        console.log(item.dataValues);
      });
    });
  };

  var updateBid = (req, res, user, bid, itemId, cb) => {

    console.log('bid value' + Number(bid));
    User.findOne({where: {id: user.id}})
    .then(function(user) {
      user.getBids()
      .then(function(bids) {
        bids.forEach(function(userBid) {
          if (userBid.dataValues.itemId === Number(itemId)) {
            userBid.update({price: Number(bid)})
            .then(() => {
              updateItemEndDate(itemId, Number(bid));
              console.log('sending updated bid');
              res.send('updated bid');
            });
            cb = null;
          }
        });
        cb && cb();
      });
    });
  };

  var putBidOnItem = (req, res, next, itemId) => {
    validateBid(req, res, req.body.bid, itemId, req.body.user.user, () => {
      console.log(req.body);
      updateBid(req, res, req.body.user.user, req.body.bid, itemId, () => {

        User.findOne({where: {id: req.body.user.user.id}})
        .then(function(bidder) {
          Item.findOne({where: {id: itemId}})
          .then(function(item) {
            updateItemEndDate(itemId, req.body.bid);
            Bid.create({price: Number(req.body.bid)})
            .then(function(bid) {
              item.addBid(bid)
              .then(function() {
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
      Item.findOne({where: {id: itemId, valid: true}, raw: true})
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