module.exports = (db, Sequelize) => {

  var User = db.define('user', {
    // userId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: Sequelize.STRING(20), allowNull: false, unique: true },
    password: {type: Sequelize.STRING(20), allowNull: false},
    address: Sequelize.STRING,
    phone_number: Sequelize.BIGINT,
    email: Sequelize.STRING
  });

  var addUser = function(req, res, userObject) {
    if (req.body.username && req.body.password) {
      User.find(userObject)
      .then(function(user) {
        if (!user) {
          console.log('making a new user');
          User.Create()
          .then(function(user) {
            console.log('made user', user);
            res.send(JSON.stringify(user));
          });
        } else {
          console.log('User already exists');
          res.redirect('/signin');
        }
      });
    } else {
      res.redirect('/signin');
    }
  };

  var signInUser = function(req, res, userObject) {

    if (!req.body.password || !req.body.username) {
      console.log('needs password and username');
      res.redirect('/signin');
    } else {
      User.find({ where: userObject, raw: true })
      .then(function(user) {
        if (!user) {
          console.log('no user');
          res.redirect('/signin');
        } else {
          console.log('theres a user');
          res.send(JSON.stringify(user));
        }
      });
    }
  };

  var updateUser = function(req, res, userObject) {
    console.log('updating user', userObject);
    console.log(req.body);
    User.find({ where: {username: userObject.username}})
    .then(function(user) {
      if (!user) {
        console.log('cannot edit nonexistent user');
        res.redirect('/signin');
      } else {
        console.log('Updating User');
        user.update(userObject)
        .then(function(newUserInfo) {
          res.send('updated user' + newUserInfo);
        });
      }
    });
  };

  return {
    User: User,
    addUser: addUser,
    signInUser: signInUser,
    updateUser: updateUser
  };
};