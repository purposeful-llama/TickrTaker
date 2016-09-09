var request = require('request');
var Sequelize = require('sequelize');
var http = require('http');
var expect = require('chai').expect;
var db = new Sequelize('postgres://ubuntu:password@localhost:5432/tickr');
var Controllers = require('../db/index.js');

describe('Database Method Check', function() {
  beforeEach(function() {
    db.sync({force: true});
    Controllers.UserController.User.findOrCreate({where: {
      "id": '133',
      "email": 'idontwantanotherone@tickr.com',
      "name": 'Hilary R. Clinton'
    }
    });
  //   db.sync({force: true});
  //   // done(); 

  });
  describe('creation checks', function(done) {
    it('Should create users in the DB', function(done) {
      var profile = {
        "id": '102342601',
        "_json": {
          "email": 'ticktock@tickr.com',
          "name": 'Donald J. Trump' 
        }
      };
      Controllers.UserController.User.findOrCreate({where: {
        "id": '1337',
        "email": 'idontwantone@tickr.com',
        "name": 'Hilary R. Clinton'
      } });
      Controllers.UserController.User.create(
        {
          "id": profile.id,
          "email": profile._json.email,
          "name": profile._json.name
        })
      .then(function(user) {
        Controllers.UserController.User.find({where: {id: user.id}})
        .then(function(user) {
          expect(user.dataValues.id).to.equal(profile.id);
          done();
        });
      });
    });
    describe('Item Creation', function(done) {
      it('Should create items in the DB', function(done) {
        console.log('trying to create stuff');
        http.request({
          hostname: 'http://127.0.0.1:3000/api/items',
          headers: {'Content-Type': 'application/json'},
          json: {
            user: {
              id: '133',
            },
            item: {
              title: 'a big ol rocket',
              description: 'it goes to space', 
              picture: 'http://www.officeshop.co.nz/shop/494-664-large/account-overdue-dixon-stamp.jpg',  
              startPrice: 10000.00,
              endPrice: 100.00
            }
          }
        }, function() {
          console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ created');
          request({
            method: 'GET',
            uri: 'http://127.0.0.1:3000/api/allitems'
          }, function() {
            console.log('^^^^^^^^^^^', data);
            expect(data[0].title).to.equal('a big ol rocket');
            done();
          });
        });
      });

    });

  });
});