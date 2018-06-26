var express = require('express');
var router = express.Router();
var renderer = require('../views/renderer');
var business = require('../controller/business');
var Cart = require('../models/cartModel');
var async = require('async');

// Routing
router.get('/', function (req, res, next) {
  if (req.param('type') != 'order') {
    renderer.CheckoutPage.RenderCheckoutPageGET(req, res, next);
  } else {
    if (!req.isAuthenticated()) {
      res.send("chuadangnhap");
    } else {
      var name = req.param('name');
      var phone = req.param('phone');
      var address = req.param('address');
      var note = req.param('note');
      business.Order(req.user.username, req.sessionID, note, name, address, phone, function (success) {
        res.send(success.toString());
      });
    }
  }
});

router.post('/updatecart', function (req, res, next) {

  var productID = req.param('productID');
  var quantity = req.param('quantity');
  var itemIndex = req.param('itemIndex');

  var data = JSON.parse(req.param('data'));

  Cart.findOne({ session: req.sessionID }, function (err, cartFound) {
    if (err) {
      console.log(err);
      res.send('false');
    } else if (cartFound && cartFound != null) {
      async.series([
        function (cb) {
          for (var i = 0; i < data.length; i++) {
            for (var y of cartFound.detail) {
              if (y.product.toString() === data[i]._id.toString()) {
                y.quantity = data[i].quantity;
              }
            }
            if (i == data.length - 1) {
              cb();
            }
          }
        },

        function (cb) {
          Cart.replaceOne({ session: req.sessionID }, cartFound, function (err) {
            if (err) {
              console.log(err);
              res.send('false');
              cb();
            } else {
              res.send('true');
              cb();
            }
          })
        }
      ])
    } else {
      res.send('false');
    }
  })
});


module.exports = router;