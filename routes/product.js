var express = require('express');
var async = require('async');
var router = express.Router();

var Category = require('../models/categoryModel.js');
global.htmlCategories = "";

// Create categories HTML element
function createHTMLCategory(URL, innerHTML) {
  return "<li> <a href=\"" + URL + "\">" + innerHTML + "</a></li>";
}


router.get('/', function (req, res, next) {
  async.series([
    function (cb) {
      Category.find({}, function (err, categories) {
        var i;
        global.htmlCategories = "";
        for (i = 0; i < categories.length; i++) {
          global.htmlCategories += createHTMLCategory('filter.html?category=' + categories[i]._id, categories[i].name);
        }
        cb();
      });
    },

    // ROUTING
    function (cb) {
      var Product = require('../models/productModel.js');
      Product.find({ id: req.param('product') }, function (err, products) {
        products[0].categoryList = global.htmlCategories;
        res.render('product', products[0]);
      });
      cb();
    }
  ]);
});


module.exports = router;