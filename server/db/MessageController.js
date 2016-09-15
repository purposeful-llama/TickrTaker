var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://automated.tickrtaker%40gmail.com:ticktock@smtp.gmail.com');
module.exports = (db, Sequelize, User) => {

  var Message = db.define('message', {
    subject: {type: Sequelize.TEXT, allowNull: false},
    message: {type: Sequelize.TEXT, allowNull: false},
    isSeller: {type: Sequelize.BOOLEAN, defaultValue: false}
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
    .then((messages) => res.send(messages))
    .catch((err) => console.log(err));
  };

  const postUserMessage = (req, res, next) => {
    Message.create({
      subject: req.body.subject,
      message: req.body.message
    }).then((message) => {
      User.find({where: {name: req.params.name}})
      .then((user) => {
        user.setMessages(message);
      });
    });
  };
  
  return {
    Message: Message,
    getUserMessages: getUserMessages,
    getAllMessages: getAllMessages,
    postUserMessage: postUserMessage
  };
};

