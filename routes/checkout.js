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

router.get('/updatecart', function (req, res, next) {

  var productID = req.param('productID');
  var quantity = req.param('quantity');
  var itemIndex = req.param('itemIndex');

  Cart.findOne({ session: req.sessionID }, function (err, cart) {
    if (err) {
      console.log(err);
      res.send('false');
    } else if (cart && cart != null) {
      async.series([
        function (cb) {
          cart.detail[itemIndex].quantity = Number.parseInt(quantity);
          cb();
        },

        function (cb) {
          Cart.replaceOne({ session: req.sessionID }, cart, function (err) {
            if (err) {
              console.log(err);
              res.send('false');
            } else {
              res.send('true');
            }
            cb();
          })
        }
      ]);
    } else {
      res.send('false');
    }
  })
});


module.exports = router;