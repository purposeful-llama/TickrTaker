var Sequelize = require('sequelize');
var db = new Sequelize('postgres://ubuntu:password@localhost:5432/tickr');

// db.authenticate()
//   .then(function(error) {

//     console.log('Connection established');
//   .catch(function(error) {
//     console.log('Error with connection', error);
//   });
// });

var User = db.define('user', {
  // userId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  username: {type: Sequelize.STRING(20), allowNull: false, unique: true },
  password: {type: Sequelize.STRING(20), allowNull: false},
  address: Sequelize.STRING,
  phone_number: Sequelize.BIGINT,
  email: Sequelize.STRING
});

var Item = db.define('item', {
  // itemId: {type: Sequelize.INTEGER, primaryKey:true, autoIncrement: true},
  // userId: {type: Sequelize.INTEGER, references: {model: User, key: 'userId', deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE} },
  title: {type: Sequelize.TEXT, allowNull: false},
  description: Sequelize.TEXT,
  picture: Sequelize.TEXT,
  startDate: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
  endDate: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
  startPrice: {type: Sequelize.INTEGER, allowNull: false},
  endPrice: {type: Sequelize.INTEGER, allowNull: false}
});

var Bid = db.define('bid', {
  // bidId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  // userId: {type: Sequelize.INTEGER, references: {model: User, key: 'userId', deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE} },
  // itemId: {type: Sequelize.INTEGER, references: {model: Item, key: 'itemId', deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE} },
  price: {type: Sequelize.INTEGER, allowNull: false}
});

User.hasMany(Item, {as: 'items'});
Item.belongsTo(User);


Item.hasMany(Bid);
Bid.belongsTo(Item);

User.hasMany(Bid);
Bid.belongsTo(User);

db.sync({force: true}).then(function() {
  User.create({
    username: 'Kunal',
    password: 'password',
    address: '6106 Countess Dr.',
    phone_number: 4083916950,
    email: 'kunalrathi1994@gmail.com',
  }).then(function(user) {
    console.log('made one item *********');
    console.log(user.dataValues.username);
    
    Item.create(
      {
      title: 'a thing',
      description: 'i dont know what to write', 
      picture: 'www.imgr.com/2308afe.gif',  
      startPrice: 1000,
      endPrice: 200
    })

    // Item.create(
    //   {
    //   title: 'a thing',
    //   description: 'i dont know what to write', 
    //   picture: 'www.imgr.com/2308afe.gif',  
    //   startPrice: 8000,
    //   endPrice: 200
    // })
    .then(function(item) {
      user.addItem(item);
      console.log('CREATED ITEM');
      Item.findAll({raw:true}).then(function(items) {
        console.log();
      });
    });
    
    // console.log(user.dataValues);
  });
  // .then(function(currentUser) {
    // console.log(currentUser);

    // Item.create({
    //   userId : 
    //   title: 'a thing',
    //   description: 'i dont know what to write', 
    //   picture: 'www.imgr.com/2308afe.gif',  
    //   startPrice: 1000,
    //   endPrice: 600
    // }, {
    //   include: [{
    //     model : User,
    //     where : currentUser
    //   }]
    // });

    // Item.create({
    //   title: 'a thing',
    //   description: 'i dont know what to write', 
    //   picture: 'www.imgr.com/2308afe.gif',  
    //   startPrice: 1000,
    //   endPrice: 600
    // }, {
    //   include: [{
    //     model : User,
    //     where : currentUser
    //   }]
    // });
  // })
});



module.exports = {
  db: db,
  User: User,
  Item: Item,
  Bid: Bid
}
