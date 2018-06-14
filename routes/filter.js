var express = require('express');
var async = require('async');
var router = express.Router();


// Get product list
var Product = require('../models/productModel.js');
var Category = require('../models/categoryModel.js');


router.get('/', function (req, res, next) {
    var productList = [];
    var categoryList;
    var listName;

    async.series([
        function (cb) {
            Product.find({}, function (err, products) {
                for (var x of products) {
                    if (x.category[0] == req.param('category')) {
                        productList.push(x);
                    }
                }
                cb();
            });
        },

        function (cb) {
            Category.find({}, function (err, categories) {
                categoryList = categories;

                for (var x of categoryList) {
                    if (x._id.toString() == req.param('category')) {
                        listName = x.name;
                    }
                }

                cb();
            });
        },

        function (cb) {
            res.render('index', {
                productList: productList,
                categoryList: categoryList,
                listName: listName
            });
            cb();
        }
    ]);
})

module.exports = router;