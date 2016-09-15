var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://automated.tickrtaker%40gmail.com:ticktock@smtp.gmail.com');
module.exports = (db, Sequelize, User) => {

  var Message = db.define('message', {
    subject: {type: Sequelize.TEXT, allowNull: false},
    message: {type: Sequelize.TEXT, allowNull: false}
  });


  const getUserMessages = (req, res, next) => {
    Message.findAll({
      where: {name: req.body.name},
      include: [User],
      order: 'id desc',
    })
    .then((messages) => res.send(messages))
    .catch((err) => console.log(err));
  };

  const getAllMessages = (req, res, next) => {
    Message.findAll({})
    .then((messages) => res.send(messages))
    .catch((err) => console.log(err));
  };

  const postUserMessages = (req, res, next) => {
    Message.create(req.body)
    .then((insert) => res.send(insert))
    .catch((err) => console.log(err));
  };
  
  return {
    Message: Message,
    getUserMessages: getUserMessages,
    getAllMessages: getAllMessages
  };
};

