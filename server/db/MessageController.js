module.exports = (db, Sequelize, User) => {

  var Message = db.define('message', {
    subject: {type: Sequelize.TEXT, allowNull: false},
    message: {type: Sequelize.TEXT, allowNull: false},
    from: {type: Sequelize.TEXT, allowNull: false}
  });


  const getUserMessages = (req, res, next, userId) => {
    User.find({
      where: {
        id: userId
      }
    })
    .then(user => {
      user.getMessages()
      .then(messages => res.send(messages));
    })
    .catch(err => console.log(err));
  };

  const getAllMessages = (req, res, next) => {
    Message.findAll({})
    .then(messages => res.send(messages))
    .catch(err => console.log(err));
  };

  const postUserMessage = (req, res, next) => {
    Message.create({
      subject: req.body.subject,
      message: req.body.message,
      from: req.body.buyerId
    }).then(message => {
      User.find({where: {id: req.body.sellerId}})
      .then(user => {
        user.addMessages(message);
      });
      User.find({where: {id: req.body.buyerId}})
      .then(user => {
        user.addMessages(message);
      })
      .then(posted => res.send(posted));
    });
  };
  
  return {
    Message: Message,
    getUserMessages: getUserMessages,
    getAllMessages: getAllMessages,
    postUserMessage: postUserMessage
  };
};

