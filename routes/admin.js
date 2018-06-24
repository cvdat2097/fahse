var express = require('express');
var router = express.Router();
var renderer = require('../views/renderer');
var business = require('../controller/business');
var dal = require('../models/DAL');
var Product = require('../models/productModel');
var Category = require('../models/categoryModel');
var Order = require('../models/orderModel');
var Product = require('../models/productModel');
var User = require('../models/userModel');
var mongoose = require('mongoose');

// Routing
router.get('/', function (req, res, next) {
  renderer.AdminPage.RenderAdminIndexPageGET(req, res, next);
});

router.get('/index.html', function (req, res, next) {
  renderer.AdminPage.RenderAdminIndexPageGET(req, res, next);
});

// Edit database
router.get('/product.html', function (req, res, next) {
  if (req.param('ajax') == 'true') {
    switch (req.param('type')) {
      case 'updatepage':
        renderer.AdminPage.RenderAdminProductPage(req, res, true, next);
        break;
    }
  } else {
    renderer.AdminPage.RenderAdminProductPage(req, res, false, next);
  }
});
router.post('/product.html', function (req, res, next) {
  switch (req.param('type')) {
    case 'deleteproduct':
      var productID = req.param('id');
      Product.deleteOne({ _id: new mongoose.Types.ObjectId(productID) }, function (err) {
        if (err) {
          console.log(err);
          res.send('false');
        } else {
          res.send('true');
        }
      })
      break;

    case 'updateproduct':
      var productID = req.param('id');
      var newProduct = {
        name: req.param('name'),
        price: req.param('price'),
        description: req.param('description'),
        color: req.param('color').split(","),
        size: req.param('size').split(","),
      };

      Product.updateOne({ _id: new mongoose.Types.ObjectId(productID) }, newProduct, function (err) {
        if (err) {
          console.log(err);
          res.send('false');
        } else {
          res.send('true');
        }
      })
      break;

    case 'addproduct':
      var newProduct = {
        name: req.param('name'),
        price: req.param('price'),
        description: req.param('description'),
        color: req.param('color').split(","),
        size: req.param('size').split(","),
      };

      Product.create(newProduct, function (err) {
        if (err) {
          console.log(err);
          res.send('false');
        } else {
          res.send('true');
        }
      })
      break;
  }
});

// USER
router.get('/user.html', function (req, res, next) {
  if (req.param('ajax') == 'true') {
    switch (req.param('type')) {
      case 'updatepage':
        renderer.AdminPage.RenderAdminUserPage(req, res, true, next);
        break;
    }
  } else {
    renderer.AdminPage.RenderAdminUserPage(req, res, false, next);
  }
});
router.post('/user.html', function (req, res, next) {
  switch (req.param('type')) {
    case 'deleteuser':
      var userID = req.param('id');
      User.deleteOne({ _id: new mongoose.Types.ObjectId(userID) }, function (err) {
        if (err) {
          console.log(err);
          res.send('false');
        } else {
          res.send('true');
        }
      })
      break;

    case 'updateuser':
      var username = req.param('username');
      var name = req.param('name');
      var phone = req.param('phone');
      var address = req.param('address');
      var usertype = req.param('usertype').toLowerCase();

      if (req.user.username == username) {
        res.send('false');
      } else {

        business.ChangeUserInfo(username, name, phone, address, usertype, function (success) {
          res.send(success.toString());
        })
      }
      break;
  }
});

// ORDER
router.get('/order.html', function (req, res, next) {
  if (req.param('ajax') == 'true') {
    switch (req.param('type')) {
      case 'updatepage':
        renderer.AdminPage.RenderAdminOrderPage(req, res, true, next);
        break;
    }
  } else {
    renderer.AdminPage.RenderAdminOrderPage(req, res, false, next);
  }
});
router.post('/order.html', function (req, res, next) {
  switch (req.param('type')) {
    case 'deleteorder':
      var orderID = req.param('id');
      Order.deleteOne({ _id: new mongoose.Types.ObjectId(orderID) }, function (err) {
        if (err) {
          console.log(err);
          res.send('false');
        } else {
          res.send('true');
        }
      })
      break;

    case 'updateorder':
      var _id = req.param('_id');
      var status = req.param('status');

      Order.findOne({ _id: new mongoose.Types.ObjectId(_id) }, function (err, order) {
        if (order && order != null) {
          Order.updateOne({ _id: new mongoose.Types.ObjectId(_id) }, { status: status.toLowerCase() }, function (err) {
            if (err) {
              console.log(err);
              res.send('false');
            } else {
              res.send('true');
            }
          })
        } else {
          res.send('false');
        }
      })
      break;
  }
});
module.exports = router;