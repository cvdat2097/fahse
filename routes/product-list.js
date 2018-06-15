var CONST = require('../config');

var express = require('express');
var async = require('async');
var router = express.Router();
var business = require('../controller/business');

var Category = require('../models/categoryModel.js');
var Product = require('../models/productModel.js');

router.get('/', function (req, res, next) {
  var categoryList;

  async.series([
    function (cb) {
      business.GetAllCategory(function (result) {
        if (result != undefined) {
          categoryList = result;
          cb();
        }
      });
    },

    // ROUTING
    function (cb) {
      var optionObj = {};
      var pageIndex = req.param('currentPage') ? req.param('currentPage') : 1;

      business.GetProductByPageIndex(pageIndex, function (products, nProducts) {
        optionObj.productList = products;
        optionObj.categoryList = categoryList;
        optionObj.nPage = Math.floor(nProducts / CONST.PRODUCT_PER_PAGE) + 1;
        optionObj.currentPage = pageIndex;

        if (req.param('ajax') == 'true') {
          optionObj.layout = false;
          res.render('product-list', optionObj);
        } else {
          res.render('product-list', optionObj);
        }
        cb();
      });
    }
  ]);
});




module.exports = router;