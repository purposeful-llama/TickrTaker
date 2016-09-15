var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://automated.tickrtaker%40gmail.com:ticktock@smtp.gmail.com');
module.exports = (db, Sequelize, User) => {

  var Message = db.define('message', {
    subject: {type: Sequelize.TEXT, allowNull: false},
    message: {type: Sequelize.TEXT, allowNull: false}
  });


  const getUserMessages = (res, req, next) => {
    Message.findAll({where: {User: req.body.user}})
    .then((messages) => res.send(messages))
    .catch((err) => console.log(err));
  };

  const getAllMessage = (res, req, next) => {
    Message.findAll({})
    .then((messages) => res.send(messages))
    .catch((err) => console.log(err));
  };

  const postUserMessages = (res, req, next) => {
    // Message.
  };
  
  return {
    Message: Message,
    getUserMessages: getUserMessages,
    getAllMessages: getUserMessages
  };
};

