var moment = require('moment');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://automated.tickrtaker%40gmail.com:ticktock@smtp.gmail.com');
module.exports = (db, Sequelize, User) => {
  
  //  CREATED A DEFAULT ENDING DATE FOR TESTING WITH DUMMY DATA.
  //  Can change end date default for dummy data to test features, follows
  //  moment.js syntax.

  endDateDefault = moment().add(30, 'seconds');
  // console.log(endDateDefault);
  
  //  DEFINED ITEM MODEL. Currently, minimum bid increment defaults to $1.00
  //  and we don't have a way to change it from client side. FEATURE TO IMPLEMENT.

  var Item = db.define('item', {
    title: {type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    picture: Sequelize.TEXT,
    startDate: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    endDate: {type: Sequelize.DATE, allowNull: false, defaultValue: endDateDefault},
    startPrice: {type: Sequelize.FLOAT, allowNull: false},
    endPrice: {type: Sequelize.FLOAT, allowNull: false},
    minimumBidIncrement: {type: Sequelize.FLOAT, defaultValue: 1},
    auctionEndDateByHighestBid: {type: Sequelize.DATE, allowNull: false, defaultValue: endDateDefault},
    valid: {type: Sequelize.BOOLEAN, defaultValue: true}
  });

  //  INTERVAL CHECK. Will flip valid from true to false if item has expired.
  //  Will also send emails to both winner and seller of auction with contact info.

  const checkValidItems = () => {
    //  Takes all valid items
    Item.findAll({where: {valid: true}})
    .then(function(currentItems) {
      //  checks if the end date is older than the end date established by bid
      currentItems.forEach((aCurrentItem) => {
        if (Date.parse(new Date(aCurrentItem.dataValues.auctionEndDateByHighestBid)) < Date.parse(Date())) {
          console.log('it is less than val');
          //  If the auction item has expired, find the seller
          User.findOne({where: {id: aCurrentItem.userId}})
          .then(function(seller) {
            //  get the bids on the item, find the highest bid, and get the highest bidder.
            aCurrentItem.getBids({raw: true})
            .then(function(bids) {
              
              var highestBid = {price: 0};
              
              bids.forEach(function(bid) {
                if (bid.price > highestBid.price) {
                  highestBid = bid;
                }
              });
              //  Send emails out.
              User.find({where: {id: highestBid.userId}, raw: true})
              .then(function(highestBidder) {
              
                var sellerText;
                
                if (highestBidder === null) {
                  sellerText = 'Sorry, no one bid on your item. Better luck next time.';
                } else {
                  sellerText = `Your auction has been completed! ${highestBidder.name} is willing to pay $${highestBid.price.toFixed(2)}. Contact them at ${highestBidder.email}.`;
                  var buyerMailOptions = {
                    from: 'automated.tickrtaker@gmail.com',
                    to: highestBidder.email,
                    subject: `You won "${aCurrentItem.dataValues.title}"`,
                    text: `Your bid on ${aCurrentItem.dataValues.title} for $${highestBid.price.toFixed(2)} has won! Contact the seller at ${seller.dataValues.email}.`
                  };
                  transporter.sendMail(buyerMailOptions, function(error, info) {
                    if (error) {
                      console.log('could not send the email', error);
                    } else {
                      console.log(info);
                    }
                  });
                }
                var sellerMailOptions = {
                  from: 'automated.tickrtaker@gmail.com',
                  to: seller.dataValues.email,
                  subject: `Completed Auction of "${aCurrentItem.dataValues.title}"`,
                  text: sellerText
                };
                transporter.sendMail(sellerMailOptions, function(error, info) {
                  if (error) {
                    console.log('could not send the email', error);
                  } else {
                    console.log(info);
                  }
                });
              });
            });
          });
          //  set item.valid to false if no longer active item.
          aCurrentItem.update({valid: false});
        }
      });
    });
  };
  
  //  interval to check for valid items and send out emails. 

  setInterval(checkValidItems, 10000);


  //  get all valid items by search query.
  const getAllItems = (req, res, next) => {
    //  take search query or assign to empty string.
    var searchQuery = req.query.search || '';
    //  Find all valid auctions that meet the search query in title or description
    Item.findAll(
      {where: {
        valid: true,
        $or: [
          {'title': {like: '%' + searchQuery + '%'}},
          {'description': {like: '%' + searchQuery + '%'}}
        ]
      }, raw: true})
    .then(function(items) {
      //  Send valid items that meet search query back to client
      console.log(items);
      res.send(items);
    });
  };

  //  get a single item's information and send back.

  const getOneItem = (req, res, next, itemId) => {
    Item.findOne({where: {id: itemId}, raw: true})
    .then(function(item) {
      res.send(item);
    });
  };
  
  //  get all items that user has for sale.

  const getItemsForSale = (req, res, next) => {
    User.findOne({where: {id: req.body.user.id}})
    .then(function(user) {
      user.getItems({where: {valid: true}, raw: true})
      .then(function(items) {
        console.log(items);
        res.send(items);
      });  
    });
  };

  const getOldItemsForSale = (req, res, next) => {
    User.findOne({where: {id: req.body.user.id}})
    .then(function(user) {
      user.getItems({where: {valid: false}, raw: true})
      .then(function(items) {
        console.log(items);
        res.send(items);
      });  
    });
  };
  //  Validate the picture's url. Regex taken from Diego Perini.

  const validateUrl = (value) => {
      // Copyright (c) 2010-2013 Diego Perini, MIT licensed
      // https://gist.github.com/dperini/729294
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
  };

  //  Validate item based on price and the url.

  const validateItem = (item) => {
    return ((item.startPrice > item.endPrice) &&
            (item.startPrice > 0) &&
            (item.endPrice >= 0) &&
            (validateUrl(item.picture)));
  };

  //  Place an item for sale.

  const putItemForSale = (req, res, next) => {

    //  Check if item is valid
    
    if (validateItem(req.body.item)) {
      console.log('a valid item has been passed');
      //  Grab user from body, then assign autionEndDateByHighestBid to the end date of the item.
      User.findOne({where: {id: req.body.user.id}})
      .then(function(user) {
        req.body.item.auctionEndDateByHighestBid = req.body.item.endDate;
        Item.create(req.body.item)
          .then(function(item) {
            user.addItem(item);
            res.send('created new item');
          }); 
      });
    } else {
      res.send('failed to create new item');
    }
  };

  //  NOT IMPLEMENTED. Removes an item from user and the corresponding bids.

  const removeItemFromSale = (req, res, next) => {
    console.log('removing item');
    User.findOne({where: {id: req.body.user.id}})
    .then(function(user) {
      user.getItems().then(function(items) {
        items.forEach(function(item) {
          if (item.id === req.body.item.id) {
            item.destroy().then(function(item) {
              var deleted = true;
              res.send(item);
            });
          }
        });
      });
    });
  };

  return {
    Item: Item,
    getItemsForSale: getItemsForSale,
    getOldItemsForSale: getOldItemsForSale,
    getAllItems: getAllItems,
    putItemForSale: putItemForSale,
    removeItemFromSale: removeItemFromSale,
    getOneItem: getOneItem
  };
};