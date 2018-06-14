var express = require('express');
var async = require('async');
var router = express.Router();

var Category = require('../models/categoryModel.js');

router.get('/', function (req, res, next) {
  var categoryList;

  async.series([
    function (cb) {
      Category.find({}, function (err, categories) {
        categoryList = categories;
        cb();
      });
    },

    // ROUTING
    function (cb) {
      var Product = require('../models/productModel.js');
      Product.find({ _id: req.param('product') }, function (err, products) {
        
        var optionObj = products[0];
        optionObj.categoryList = categoryList;
        
        for (var x of categoryList) {
          if (optionObj.category[0] == x._id.toString()) {
            optionObj.category = x.name;
            optionObj.categoryID = x._id.toString();
          }
        }

        res.render('product', optionObj);
      });
      cb();
    }
  ]);
});


module.exports = router;