var express = require('express');
var async = require('async');
var router = express.Router();
var lib = require('./lib');
var Product = require('../models/productModel');
var Category = require('../models/categoryModel');


// Routing
router.get('/', function (req, res, next) {
  if (lib.GetCookie(req, 'admin') === null) {
    res.redirect('/login.html');
    res.end();
  } else {
    next();
  }
});

router.get('/', function (req, res, next) {
  var table = req.param('table');
  console.log(table);
  switch (table) {
    case undefined:
      table = 'product';
    case 'product':
      {
        Product.find({}, function (err, products) {
          console.log(products);
          res.render('admin/table-product', { products: products, layout: 'admin/adminlayout' });
        });
      }
      break;

    case 'category':
      {
        Category.find({}, function (err, cats) {
          console.log(cats);
          res.render('admin/table-category', { cats: cats, layout: 'admin/adminlayout' });
        });
      }
      break;
  }
})

// Edit database
// ADD
router.post('/product', function (req, res, next) {
  if (req.body['button-add'] == 'product') {
    var sizeArray = req.body['size'].split(',');
    var colorArray = req.body['color'].split(',');
    var imagesArray = req.body['images'].split(',');
    Product.create({
      name: req.body['name'],
      price: req.body['price'],
      description: req.body['description'],
      size: sizeArray,
      color: colorArray,
      images: imagesArray
    }, function () {
      console.log('Create successfully');
    });
  }

  if (req.body['button-delete']) {
    var id = req.body['button-delete'];
    console.log(id);
    Product.findOne({ _id: id }, function (err, doc) {
      if (doc != null) {
        doc.remove();
        console.log('Remove OK');
      }
    })
  }

  if (req.body['button-update']) {
    var id = req.body['button-update'];
    console.log(id);
    var updateObj = {
      name: req.body['name'],
      price: req.body['price'],
      description: req.body['description'],
      size: sizeArray,
      color: colorArray,
      images: imagesArray
    };

    Product.update({ _id: id }, updateObj, function (err) {
      if (err) {
        console.log(err);
      }
      console.log('Update OK');
    });
  }
  res.redirect('/admin.html?table=product');
});

router.post('/category', function (req, res, next) {
  if (req.body['button-add'] == 'category') {
    Category.create({
      name: req.body['name'],
    }, function () {
      console.log('Create successfully');
    });
  }

  if (req.body['button-delete']) {
    var id = req.body['button-delete'];
    console.log(id);
    Category.findOne({ _id: id }, function (err, doc) {
      if (doc != null) {
        doc.remove();
        console.log('Remove OK');
      }
    })
  }

  if (req.body['button-update']) {
    var id = req.body['button-update'];
    console.log(id);
    var updateObj = {
      name: req.body['name'],
    };

    Category.update({ _id: id }, updateObj, function (err) {
      if (err) {
        console.log(err);
      }
      console.log('Update OK');
    });
  }
  res.redirect('/admin.html?table=category');
});
module.exports = router;