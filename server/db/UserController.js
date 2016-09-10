module.exports = (db, Sequelize) => {

  var User = db.define('user', {
    // userId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    // username: {type: Sequelize.STRING(20), unique: true },
    // password: {type: Sequelize.STRING(20), allowNull: false},
    id: {type: Sequelize.STRING, primaryKey: true},
    name: Sequelize.STRING,
    // address: Sequelize.STRING,
    // phone_number: Sequelize.BIGINT,
    email: {type: Sequelize.STRING, unique: true}
  });

  var addUser = (req, res, userObject) => {
    if (req.body.username && req.body.password) {
      console.log('adding user');
      User.find({where: userObject})
      .then(function(user) {
        console.log('what is the user here', user);
        if (!user) {
          console.log('making a new user');
          User.create(req.body)
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

  var signInUser = (req, res, userObject) => {

    if (!req.body.password || !req.body.username) {
      console.log('needs password and username');
      res.redirect('/signin');
    } else {
      User.find({ where: {id: userObject.id}, raw: true })
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

  var updateUser = (req, res, userObject) => {
    
    console.log('this is the req.user.dataValues', req.user.dataValues);
    User.find({ where: { id: req.user.dataValues.id }})
    .then(function(user) {
      if (!user) {
        console.log('cannot edit nonexistent user');
        res.redirect('/signin');
      } else {
        console.log('Updating User with ', userObject.userData.email);
        user.update(userObject.userData)
        .then(function(newUserInfo) {
          console.log(newUserInfo.dataValues);
          res.send(newUserInfo.dataValues);
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