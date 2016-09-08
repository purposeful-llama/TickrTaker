module.exports = (db, Sequelize, User) => {
  
  var Item = db.define('item', {
    title: {type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    picture: Sequelize.TEXT,
    startDate: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    endDate: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
    startPrice: {type: Sequelize.FLOAT, allowNull: false},
    endPrice: {type: Sequelize.FLOAT, allowNull: false},
  });

  // var checkUser = (req, res, rawBool, callback) => {
  //   var username = req.get('username');
  //   var password = req.get('password');
  //   User.find({ where: { username: username, password: password }, raw: rawBool })
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/signin');
  //     } else {
  //       callback(req, res, user);
  //     }
  //   });
  // };
  var getAllItems = (req, res, next) => {
    Item.find({raw: true})
    .then(function(items) {
      res.send(items);
    });
  };

  var getOneItem = (req, res, next, itemId) => {
    Item.findOne({where: {id: itemId}, raw:true})
    .then(function(item) {
      res.send(item);
    });
  };
  var getItemsForSale = (req, res, next) => {
    User.findOne({where: {id: req.body.user.id}})
    .then(function(user) {
      user.getItems({raw: true})
      .then(function(items) {
        console.log(items);
        res.send(items);
      });  
    });
  };

  var putItemForSale = (req, res, next) => {
    console.log(req.body);
    User.findOne({where: {id: req.body.user.id}})
    .then(function(user) {
      console.log(user);
      Item.create(req.body.item)
        .then(function(item) {
          user.addItem(item);
          console.log(user);
          res.send('created new item');
        }); 
    });
  };

  var removeItemFromSale = (req, res, next) => {
    console.log('removing item');
    User.findOne({where: {id: req.body.user.id}})
    .then(function(user) {
      Item.destroy({where: req.body.item})
        .then(function(item) {
          console.log(item);
          res.send('removed the item');
        });      
    });
  };

  return {
    Item: Item,
    getItemsForSale: getItemsForSale,
    getAllItems: getAllItems,
    putItemForSale: putItemForSale,
    removeItemFromSale: removeItemFromSale
  };
};