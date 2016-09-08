var Sequelize = require('sequelize');
var db = new Sequelize('postgres://ubuntu:password@localhost:5432/tickr');

var UserController = require('./UserController')(db, Sequelize);
var ItemController = require('./ItemController')(db, Sequelize, UserController.User);
var BidController = require('./BidController')(db, Sequelize, UserController.User, ItemController.Item);

UserController.User.hasMany(ItemController.Item, {as: 'items', onDelete: 'cascade'});
ItemController.Item.belongsTo(UserController.User, {as: 'seller'});

ItemController.Item.hasMany(BidController.Bid, {as: 'bids', onDelete: 'cascade'});
BidController.Bid.belongsTo(ItemController.Item, {as: 'item'});

UserController.User.hasMany(BidController.Bid, {as: 'bids', onDelete: 'cascade'});
BidController.Bid.belongsTo(UserController.User, {as: 'bidder'});

db.sync({force: true})
.then(function() {
  UserController.User.create({
    name: 'Alexander Anastasios Pantelides',
    id: '10154095627189811',
    // username: 'Lex',
    // password: 'passwordtoo',
    // address: '944 Market St.',
    // phone_number: 6508689933,
    email: 'dark_dragoon10@hotmail.com',
  }).then(function(lex) {
    UserController.User.create({
      name: 'Kunal Rathi',
      id: '10206128224638462',
      // username: 'Kunal',
      // password: 'password',
      // address: '6106 Countess Dr.',
      // phone_number: 4083916950,
      email: 'volcanic.phoenix@gmail.com',
    })
    .then(function(seller) {
      console.log('made one item *********');
      console.log(seller.dataValues.username);
      ItemController.Item.create({
        title: 'a thing',
        description: 'i dont know what to write', 
        picture: 'http://www.officeshop.co.nz/shop/494-664-large/account-overdue-dixon-stamp.jpg',  
        startPrice: 10000.00,
        endPrice: 100.00
      }).then(function (item) {
        lex.addItem(item);
      });
      ItemController.Item.create({
        title: 'Rocket',
        description: 'A rocket!', 
        picture: 'http://www.officeshop.co.nz/shop/494-664-large/account-overdue-dixon-stamp.jpg',  
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
            item.addBid(bid);
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
