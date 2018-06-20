var async = require('async');
var express = require('express');
var router = express.Router();
var business = require('../controller/business');
var CONST = require('../config');
var mongoose = require('mongoose');
var Category = require('../models/categoryModel.js');
var Product = require('../models/productModel.js');

// ============== DEBUG DAL.js ============
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

            // queryObj = {
            //     category: "5b24f3df968641237042a00f",
            //     size: "XL-S-M",
            //     color: "Do-Cam-XanhLa",
            //     price: "12000-90000",
            //     keyword: "áo"
            // }

            queryObj = {
                category: req.param('category'),
                size: req.param('size'),
                color: req.param('color'),
                price: req.param('price'),
                keyword: req.param('keyword'),
                sorting: req.param('sorting')
            }


            QueryProducts(queryObj, function (products) {
                var optionObj = {
                    productList: products
                }
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
// ============== DEBUG DAL.js ============

// 3.1.1
function QueryProducts(queryObj, pageIndex, callback) {

    var query = {};
    var sorting;
    async.series([
        function (cb) {
            // build mongoose query object
            if (queryObj.category != undefined) {
                // MongoDB query format                
                query.category = new mongoose.Types.ObjectId(queryObj.category);
            }

            if (queryObj.size != undefined) {
                queryObj.size = queryObj.size.split("-");

                for (var x of queryObj.size) {
                    x = x.toUpperCase();
                }

                // MongoDB query format
                query.size = {
                    $in: queryObj.size
                }
            }

            if (queryObj.color != undefined) {
                queryObj.color = queryObj.color.split("-");

                var temp = [];

                for (var i = 0; i < queryObj.color.length; i++) {
                    temp[i] = new RegExp(".*" + queryObj.color[i] + ".*", "i");
                }

                // MongoDB query format
                query.color = {
                    $in: temp
                }
            }

            if (queryObj.price != undefined) {
                queryObj.price = queryObj.price.split("-");
                var i;
                for (i = 0; i < queryObj.price.length; i++) {
                    queryObj.price[i] = Number.parseInt(queryObj.price[i]);
                }

                // MongoDB query format
                query.price = {
                    $gte: queryObj.price[0],
                    $lte: queryObj.price[1]
                }
            }

            if (queryObj.keyword != undefined) {

                // MongoDB query format
                query.name = {
                    $regex: ".*" + queryObj.keyword + ".*",
                    $options: "i"
                }
            }

            if (queryObj.sorting != undefined) {
                switch (queryObj.sorting) {
                    case "pricelowtohigh":
                        sorting = function (a, b) { return a.price - b.price }
                        break;
                    case "pricehightolow":
                        sorting = function (a, b) { return b.price - a.price }
                        break;
                    case "viewlowtohigh":
                        sorting = function (a, b) { return a.view - b.view }
                        break;
                    case "viewhightolow":
                        sorting = function (a, b) { return b.view - a.view }
                        break;
                }
            }

            cb();
        },

        function (cb) {
            // send query to the database
            var queryFunction;
            
            if (pageIndex <= 0)
            {
                queryFunction = Product.find(query);
            } else {
                queryFunction = Product.find(query).limit(CONST.PRODUCT_PER_PAGE).skip((pageIndex - 1) * CONST.PRODUCT_PER_PAGE);
            }
            
            queryFunction.exec(function (err, products) {
                if (err) {
                    console.log(err);
                } else {
                    var returnArray;

                    // process array 'products'
                    if (sorting == undefined) {
                        returnArray = products;
                    } else {
                        returnArray = products.sort(sorting);
                    }

                    cb();
                    return callback(returnArray);
                }
            });

        }
    ]);
}


// ============== DEBUG DAL.js ============
// module.exports = router;
// ============== DEBUG DAL.js ============

var exportObj = {
    QueryProducts: QueryProducts
}

module.exports = exportObj;