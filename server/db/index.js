var Sequelize = require('sequelize');
var db = new Sequelize('postgres://kunalrathi:biggreen2016@localhost:5432/tickr');

db.authenticate()
  .then(function(error) {
    console.log('Connection established');
  })
  .catch(function(error) {
    console.log('Error with connection', error);
  });

  