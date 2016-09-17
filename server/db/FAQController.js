module.exports = (db, Sequelize, Item) => {
  var Faq = db.define('faq', {
    question: {type: Sequelize.TEXT, allowNull: false},
    answer: {type: Sequelize.TEXT, allowNull: false},
  });

  const getItemFAQs = (req, res, next, itemId) => {
    Item.find({
      where: {
        id: itemId
      }
    })
    .then(item => item.getFaqs().then(faqs => res.send(faqs)))
    .catch(err => console.log(err));
  };

  const postItemFAQs = (req, res, next) => {
    Faq.create({
      question: req.body.question,
      answer: req.body.answer
    })
    .then(faq => {
      Item.find({
        where: {
          id: req.body.id
        }
      })
      .then(item => item.setFaqs(faq))
      .then(posted => res.send(posted));
    });
  };

  const editItemFAQs = (req, res, next) => {
    Faq.find({
      where: {
        id: req.body.id
      }
    })
    .then(faq => 
      faq.update({
        question: req.body.question,
        answer: req.body.answer
      })
    ).then(updated => res.send(updated));
  };

  return {
    Faq: Faq,
    getItemFAQs: getItemFAQs,
    postItemFAQs: postItemFAQs,
    editItemFAQs: editItemFAQs
  };
};