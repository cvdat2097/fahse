var express = require('express');
var async = require('async');
var router = express.Router();


// Get product list
var Product = require('../models/productModel.js');
var Category = require('../models/categoryModel.js');

router.get('/', function (req, res, next) {
  var productList;
  var categoryList;
 
  async.series([
    function (cb) {
      Product.find({}, function (err, products) {
        productList = products;
        cb();
      });
    },

    function (cb) {
      Category.find({}, function (err, cats) {
        categoryList = cats;
        cb();
      });
    },

    // ROUTING
    function (cb) {
      res.render('index', {
        productList: productList,
        categoryList: categoryList,
        listName: "DANH SÁCH SẢN PHẨM"
      });
      cb();
    }
  ]);
});

module.exports = router;