var Sequelize = require('sequelize');
var db = new Sequelize('postgres://ubuntu:password@localhost:5432/tickr');

var UserController = require('./UserController')(db, Sequelize);
var ItemController = require('./ItemController')(db, Sequelize, UserController.User);
var BidController = require('./BidController')(db, Sequelize, UserController.User, ItemController.Item);

UserController.User.hasMany(ItemController.Item, {as: 'items'});
ItemController.Item.belongsTo(UserController.User, {as: 'seller'});


ItemController.Item.hasMany(BidController.Bid, {as: 'bids', onDelete: 'cascade'});
BidController.Bid.belongsTo(ItemController.Item, {as: 'item'});

UserController.User.hasMany(BidController.Bid, {as: 'bids', onDelete: 'cascade'});
BidController.Bid.belongsTo(UserController.User, {as: 'bidder'});

db.sync({force: true})
.then(function() {
  UserController.User.create({
    username: 'Kunal',
    password: 'password',
    address: '6106 Countess Dr.',
    phone_number: 4083916950,
    email: 'kunalrathi1994@gmail.com',
  });
  UserController.User.create({
    username: 'Lex',
    password: 'passwordtoo',
    address: '944 Market St.',
    phone_number: 6508689933,
    email: 'lex@gmail.com',
  })
  .then(function(seller) {
  
    console.log('made one item *********');
    console.log(seller.dataValues.username);
    
    ItemController.Item.create({
      title: 'a thing',
      description: 'i dont know what to write', 
      picture: 'www.imgr.com/2308afe.gif',  
      startPrice: 1000,
      endPrice: 200
    })
    .then(function(item) {
      seller.addItem(item);
      console.log('CREATED ITEM');
      UserController.User.find({where: {username: 'Kunal'}})
      .then(function(bidder) {
        BidController.Bid.create({
          price: 500
        })
        .then(function(bid) {
          item.addBid(bid);
          bidder.addBid(bid);
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
