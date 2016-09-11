var request = require('request');
var Sequelize = require('sequelize');
var http = require('http');
var expect = require('chai').expect;
var Controllers = require('../db/index.js');


describe('Database Method Check', function() {
  beforeEach(function(done) {
    Controllers.UserController.User.findOrCreate({ where: {
      name: 'Kunal Rathi',
      id: '10206128224638462',
      email: 'volcanic.phoenix@gmail.com'
    }}).then(function() {
      console.log('created data');
      done();
    }).catch(function(error) {
      console.log(error);
      done();
    });
  //   db.sync({force: true});
  //   // done(); 

  });

  describe('creation checks', function() {
    it('Should create users in the DB', function(done) {
      console.log('1');
      Controllers.UserController.User.find({where: {id: '10206128224638462'}, raw:true})
      .then(function(user) {
        console.log('2', user);
        expect(user.name).to.equal('Kunal Rathi');
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
    });
  });

  describe('Item Creation', function(done) {
    it('Should create items in the DB', function(done) {
      console.log('trying to create stuff');
      request({
        uri: 'http://127.0.0.1:3000/api/items',
        method: 'POST',
        // headers: {'Content-Type': 'application/json'},
        json: {
          user: {
            id: '10206128224638462',
          },
          item: {
            title: 'a thing',
            description: 'i dont know what to write', 
            picture: 'http://www.officeshop.co.nz/shop/494-664-large/account-overdue-dixon-stamp.jpg',  
            startPrice: 10000.00,
            endPrice: 100.00,
          }
        }
      }, function() {
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ created');
        request({
          method: 'GET',
          uri: 'http://127.0.0.1:3000/api/allitems'
        }, function(data) {
          console.log('^^^^^^^^^^^', data);
          expect(data[0].title).to.equal('a big ol rocket');
          done();
        });
      });
    });

  });

});