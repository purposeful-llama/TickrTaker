var Sequelize = require('sequelize');
var db = new Sequelize('postgres://ubuntu:password@localhost:5432/tickr');
var moment = require('moment');

//  Get controllers for users, items, bids.

var UserController = require('./UserController')(db, Sequelize);
var ItemController = require('./ItemController')(db, Sequelize, UserController.User);
var BidController = require('./BidController')(db, Sequelize, UserController.User, ItemController.Item);
var MessageController = require('./MessageController')(db, Sequelize, UserController.User);

//  Assign many-to-one relationships between items-seller, bids-item, and bids-bidder.

//  NOT IMPLEMENTED: Join tables to make querying for multiple items substantially easier.

//  Ideally we would have a user-item-highestBid join table that would allow for cleaner queries.

UserController.User.hasMany(ItemController.Item, {as: 'Items', onDelete: 'cascade'});
ItemController.Item.belongsTo(UserController.User, {as: 'Seller'});

ItemController.Item.hasMany(BidController.Bid, {as: 'Bids', onDelete: 'cascade'});
BidController.Bid.belongsTo(ItemController.Item, {as: 'Item'});

UserController.User.hasMany(BidController.Bid, {as: 'Bids', onDelete: 'cascade'});
BidController.Bid.belongsTo(UserController.User, {as: 'Bidder'});

UserController.User.belongsToMany(MessageController.Message, {as: 'Messages', through: 'UserMessages', onDelete: 'cascade'});
MessageController.Message.belongsToMany(UserController.User, {as: 'Users', through: 'UserMessages', onDelete: 'cascade'});


//DUMMY DATA. Drops tables every time server restarts.

db.sync({force: true})
.then(function() {
  UserController.User.create({
    name: 'Alexander Anastasios Pantelides',
    id: '10154095627189811',
    email: 'dark_dragoon10@hotmail.com',
  }).then(function(lex) {
    UserController.User.create({
      name: 'Kunal Rathi',
      id: '10206128224638462',
      email: 'volcanic.phoenix@gmail.com',
    })
    .then(function(seller) {
      ItemController.Item.create({
        title: 'Monkey',
        description: 'A monkey!', 
        picture: 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473717678/item_photos/ddvlpupgnrur0l7nm3ng.jpg',  
        startPrice: 10000.00,
        endPrice: 100.00,
        endDate: '2016-09-13T00:00Z',
        auctionEndDateByHighestBid: '2016-09-13T00:00Z',
        category: 'Beauty, Health & Grocery'
      }).then(function (item) {
        lex.addItem(item);
      });
      ItemController.Item.create({
        title: 'Fluorescent',
        description: 'Some glow sticks!', 
        picture: 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473717852/item_photos/vx7mzeluumrn1qngrnia.jpg',  
        startPrice: 10000000.00,
        endPrice: 1.00,
        endDate: '2016-09-13T17:00Z',
        auctionEndDateByHighestBid: '2016-09-13T17:00Z',
        category: 'Home, Garden & Tools'
      }).then(function (item) {
        seller.addItem(item);
      });
      ItemController.Item.create({
        title: 'Linguine',
        description: 'Some linguine!', 
        picture: 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473717931/item_photos/dsnyockmsy6enburpyjt.png',  
        startPrice: 10000000.00,
        endPrice: 1000000.00,
        category: 'Home, Garden & Tools'
      }).then(function (item) {
        seller.addItem(item);
      });
      ItemController.Item.create({
        title: 'Cavs vs Warriors - Game 7 tickets - Row A Seat 1 - 10',
        description: 'Some tickets! Get the perfect seats for the NBA finals game 7!', 
        picture: 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473718163/item_photos/sxyqw1yolsfbvzdkvhjr.png',  
        startPrice: 20000.00,
        endPrice: 1000.00,
        category: 'Home, Garden & Tools'
      }).then(function (item) {
        seller.addItem(item);
      });
      ItemController.Item.create({
        title: 'Full bed',
        description: 'A full bed. Comes with matress.', 
        picture: 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473717788/item_photos/wqifur3lxghuzoysy8c2.jpg',  
        startPrice: 999.00,
        endPrice: 1.00,
        category: 'Home, Garden & Tools'
      })
      .then(function(item) {
        seller.addItem(item);
        console.log('CREATED ITEM');
        UserController.User.find({where: {name: 'Kunal Rathi'}})
        .then(function(bidder) {
          BidController.Bid.create({
            price: 600.00
          }).then(function(bid) {
            item.addBid(bid);
            lex.addBid(bid);
          });
          BidController.Bid.create({
            price: 495.95
          })
          .then(function(bid) {
            item.addBid(bid).then(function(item) {
            });
            bidder.addBid(bid);
          });
        });
      });
    });
  });
});

module.exports = {
  db: db,
  UserController: UserController,
  ItemController: ItemController,
  BidController: BidController,
  MessageController: MessageController
};
