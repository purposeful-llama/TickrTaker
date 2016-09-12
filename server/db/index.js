var Sequelize = require('sequelize');
var db = new Sequelize('postgres://ubuntu:password@localhost:5432/tickr');

//  Get controllers for users, items, bids.

var UserController = require('./UserController')(db, Sequelize);
var ItemController = require('./ItemController')(db, Sequelize, UserController.User);
var BidController = require('./BidController')(db, Sequelize, UserController.User, ItemController.Item);

//  Assign many-to-one relationships between items-seller, bids-item, and bids-bidder.

//  NOT IMPLEMENTED: Join tables to make querying for multiple items substantially easier.

//  Ideally we would have a user-item-highestBid join table that would allow for cleaner queries.

UserController.User.hasMany(ItemController.Item, {as: 'Items', onDelete: 'cascade'});
ItemController.Item.belongsTo(UserController.User, {as: 'Seller'});

ItemController.Item.hasMany(BidController.Bid, {as: 'Bids', onDelete: 'cascade'});
BidController.Bid.belongsTo(ItemController.Item, {as: 'Item'});

UserController.User.hasMany(BidController.Bid, {as: 'Bids', onDelete: 'cascade'});
BidController.Bid.belongsTo(UserController.User, {as: 'Bidder'});


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
        title: 'a thing',
        description: 'i dont know what to write', 
        picture: 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473715896/item_photos/zfaehmp20xculww4krs6.jpg',  
        startPrice: 10000.00,
        endPrice: 100.00
      }).then(function (item) {
        lex.addItem(item);
      });
      ItemController.Item.create({
        title: 'Rocket',
        description: 'A rocket!', 
        picture: 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473715896/item_photos/zfaehmp20xculww4krs6.jpg',  
        startPrice: 1000330.00,
        endPrice: 10.00
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
  BidController: BidController
};
