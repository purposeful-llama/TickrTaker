var moment = require('moment');
module.exports = (db, Sequelize, User) => {
  endDateDefault = moment().add(30, 'days');
  
  var Item = db.define('item', {
    title: {type: Sequelize.TEXT, allowNull: false},
    description: Sequelize.TEXT,
    picture: Sequelize.TEXT,
    startDate: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    endDate: {type: Sequelize.DATE, allowNull: false, defaultValue: endDateDefault},

    startPrice: {type: Sequelize.FLOAT, allowNull: false},
    endPrice: {type: Sequelize.FLOAT, allowNull: false},
    minimumBidIncrement: {type: Sequelize.FLOAT, defaultValue: 1}
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
  const getAllItems = (req, res, next) => {
    Item.findAll({raw: true})
    .then(function(items) {
      console.log(items);
      res.send(items);
    });
  };

  const getOneItem = (req, res, next, itemId) => {
    Item.findOne({where: {id: itemId}, raw: true})
    .then(function(item) {
      res.send(item);
    });
  };
  
  const getItemsForSale = (req, res, next) => {
    User.findOne({where: {id: req.body.user.id}})
    .then(function(user) {
      user.getItems({raw: true})
      .then(function(items) {
        console.log(items);
        res.send(items);
      });  
    });
  };

  const validateUrl = (value) => {
      // Copyright (c) 2010-2013 Diego Perini, MIT licensed
      // https://gist.github.com/dperini/729294
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
  };

  const validateItem = (item) => {
    return ((item.startPrice > item.endPrice) &&
            (item.startPrice > 0) &&
            (item.endPrice > 0) &&
            (item.minimumBidIncrement > 0) &&

            (validateUrl(item.picture)) &&
            (typeof item.endDate) === Date);
  };

  const putItemForSale = (req, res, next) => {
    // console.log('this is the body of the request', req.body);
    if (validateItem(req.body.item)) {
      User.findOne({where: {id: req.body.user.id}})
      .then(function(user) {
        Item.create(req.body.item)
          .then(function(item) {
            user.addItem(item);
            user.getItems().then(function(items) {console.log(items);});
            res.send('created new item');
          }); 
      });
    } else {
      res.send('failed to create new item');
    }
  };

  const removeItemFromSale = (req, res, next) => {
    console.log('removing item');
    if (validateItem(req.body.item)) {
      User.findOne({where: {id: req.body.user.id}})
      .then(function(user) {
        Item.destroy({where: req.body.item})
          .then(function(item) {
            console.log(item);
            res.send('removed the item');
          })
          .catch(function(error) {
            res.send('failed to remove item due to error ' + error);
          });
      });
    } else {
      res.send('not a valid item to delete');
    }
  };

  return {
    Item: Item,
    getItemsForSale: getItemsForSale,
    getAllItems: getAllItems,
    putItemForSale: putItemForSale,
    removeItemFromSale: removeItemFromSale,
    getOneItem: getOneItem
  };
};