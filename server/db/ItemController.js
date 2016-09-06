module.exports = (db, Sequelize, User) => {
  
  var Item = db.define('item', {
    title: {type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    picture: Sequelize.TEXT,
    startDate: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    endDate: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
    startPrice: {type: Sequelize.INTEGER, allowNull: false},
    endPrice: {type: Sequelize.INTEGER, allowNull: false}
  });

  var checkUser = (req, res, rawBool, callback) => {
    var username = req.get('username');
    var password = req.get('password');
    User.find({ where: { username: username, password: password }, raw: rawBool })
    .then(function(user) {
      if (!user) {
        res.redirect('/signin');
      } else {
        callback(req, res, user);
      }
    });
  };
  var getAllItems = (req, res, next) => {
    Item.find({raw: true})
    .then(function(items) {
      res.send(items);
    });
  };

  var getItemsForSale = (req, res, next) => {

    checkUser(req, res, false, function(req, res, user) {
      console.log(user);
      user.getItems({raw: true})
      .then(function(items) {
        console.log(items);
        res.send();
      });  
    });
  };

  var putItemForSale = (req, res, next) => {

    checkUser(req, res, false, function(req, res, user) {
      Item.create(req.body)
        .then(function(item) {
          user.addItem(item);
          console.log(user);
          res.send('created new item');
        }); 
    });
  };

  var removeItemFromSale = (req, res, next) => {
    console.log('removing item');
    checkUser(req, res, true, function(req, res, user) {
      Item.destroy({where: req.body})
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