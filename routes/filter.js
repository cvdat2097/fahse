var CONST = require('../config');

var express = require('express');
var async = require('async');
var router = express.Router();
var business = require('../controller/business');


// Get product list
var Product = require('../models/productModel.js');
var Category = require('../models/categoryModel.js');


router.get('/', function (req, res, next) {
    var productList = [];
    var categoryList;
    var listName;

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
            var categoryID = req.param('category');
            var pageIndex = req.param('currentPage') ? req.param('currentPage') : 1;

            business.GetProductByCategoryID(categoryID, pageIndex, function (products, nProducts) {
                optionObj.productList = products;
                optionObj.categoryList = categoryList;
                optionObj.nPage = Math.floor(nProducts / CONST.PRODUCT_PER_PAGE) + 1;
                optionObj.currentPage = pageIndex;


                res.render('product-list', optionObj);

                cb();
            });
        }
    ]);

})

module.exports = router;