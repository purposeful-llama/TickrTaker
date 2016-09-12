// var async = require('async');
module.exports = (db, Sequelize, User, Item) => {
  //defines a bid table that relates the bidder to the item they are bidding on.
  var Bid = db.define('bid', {
    price: {type: Sequelize.FLOAT, allowNull: false}
  });

  //Will return all bids made by a user
  var getBidsForSeller = (req, res, next) => {
    //Find the user in postgres associated with the user sent in req.body
    User.findOne({where: {id: req.body.user.id}})
    .then(function(user) {
      //Get the individual bids made by that user
      user.getBids({raw: true})
      .then(function(bids) {
        var itemArr = [];
        var asyncBids = bids.map(function(bid) {
          //Get all items associated with those individual bids, only active items
          return Item.find({where: {id: bid.itemId, valid: true}})
          .then(function(item) {
            //check those items for their max bids and send back:
            //{item, myBid, highestBid } where myBid and highestBid are values associated with
            //the highest bid and your bid on that item.
            return item.getBids({raw: true})
            .then(function(itemBids) {
              var maxBid = 0;
              itemBids.forEach(function(bidsOnItem) {
                if (bidsOnItem.price > maxBid) {
                  maxBid = bidsOnItem.price;
                }
              });
              itemArr.push({item: item.dataValues, myBid: bid, highestBid: maxBid});
            });
          });
        });
        //Use promise.all to wait for all bids to resolve before sending.
        Promise.all(asyncBids)
        .then(function() {
          res.send(itemArr);
        });
      });
    });
  };

  //Sends back all bids for a single item

  var getBidsForItem = (req, res, next, itemId) => {
    //Find the item based on itemId
    Item.find({where: {id: itemId}})
    .then(function(item) {
      //get the bids of the item
      item.getBids({raw: true})
      .then(function(bids) {
        //send the bids back in array form. {[bid, bid, bid]}.
        res.send(bids);
      });
    });
  };

  //CHECK IF BID IS VALID. several validation checks on the bid itself.
  var validateBid = (req, res, bid, itemId, user, cb) => {

    valid = true;
    //invalid if bid is less than one cent.    
    if (bid < 0.01) {
      valid = false;
    }
    
    if(itemId === undefined || user === undefined) {
      res.send('not enough information to bid. Sorry');
      return;
    }
    Item.findOne({where: {id: itemId}})
    .then(function(item) {
      //invalid if the item is no longer on auction
      if (item.dataValues.valid === false) {
        valid = false;
      }
      //invalid if its your own item
      if (item.userId === user.id) {
        valid = false;
      }
      //invalid if the end date is before current. Additional check for "no longer on auction"
      if (Date.parse(new Date(item.dataValues.endDate)) < Date.parse(Date())) {
        valid = false;
      }
      //invalid if less than current value
      if (((item.dataValues.startPrice - item.dataValues.endPrice) / 
          ((Date.parse(item.dataValues.endDate)) - Date.parse(item.dataValues.startDate))
        * (Date.parse(item.dataValues.endDate) - Date.now())) + item.dataValues.endPrice < bid) {
        valid = false;
      }

      item.getBids({raw: true})
      .then(function(bids) {
        bids.forEach(function(itemBid) {
          //invalid if the bid is less than the minimum increment value for the item (DEFAULT $1.00)
          if ((itemBid.price + item.minimumBidIncrement > bid)) {
            valid = false;
          }
        });
        //if valid, continue. Else, exit.        
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

  //Update an item's end date based on highest bid.

  var updateItemEndDate = (itemId, bidValue) => {
    Item.find({where: {id: itemId}})
    .then(function(item) {
      item.update({auctionEndDateByHighestBid: new Date( Date.parse(item.endDate) - ((Date.parse(item.endDate) - Date.parse(item.startDate)) / (item.endPrice - item.startPrice)) * (item.endPrice - bidValue))});
    });
  };

  //update a bidder's bid to a higher value.

  var updateBid = (req, res, user, bid, itemId, cb) => {
    //Find user

    User.findOne({where: {id: user.id}})
    .then(function(user) {
      //get user's bids
      user.getBids()
      .then(function(bids) {
        //for each bid, check if the item bidded on is the same as the item passed in
        bids.forEach(function(userBid) {
          if (userBid.dataValues.itemId === Number(itemId)) {
            //if so, update the bid to the new bid price.
            userBid.update({price: Number(bid)})
            .then(() => {
              //update the item's end date
              updateItemEndDate(itemId, Number(bid));
              res.send('updated bid');
            });
            cb = null;
          }
        });
        cb && cb();
      });
    });
  };

  //Place a bid on an item as defined by the id itemId.

  var putBidOnItem = (req, res, next, itemId) => {
    //First, validate the bid.
    validateBid(req, res, req.body.bid, itemId, req.body.user.user, () => {
      console.log(req.body);
      //if valid, then check if you need to update a bid instead of placing a new one.
      updateBid(req, res, req.body.user.user, req.body.bid, itemId, () => {
        //if not updated, then we need to put a new bid.
        //get user as found in req.body.user
        User.findOne({where: {id: req.body.user.user.id}})
        .then(function(bidder) {
          //get item associated with the itemId
          Item.findOne({where: {id: itemId}})
          .then(function(item) {
            //update the item end date by new bid value
            updateItemEndDate(itemId, req.body.bid);
            Bid.create({price: Number(req.body.bid)})
            //add the bid to both the item and the bidder
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

  // NOT USED. Can delete a single bid and remove the bid from user and item.

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