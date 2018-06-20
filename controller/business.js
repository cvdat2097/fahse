var express = require('express');
var async = require('async');
const mongoose = require('mongoose');
var Category = require('../models/categoryModel.js');
var Product = require('../models/productModel.js');
var CONST = require('../config');
var DAL = require('../models/DAL');

// ============== DEBUG business.js ============
var router = express.Router();
router.get('/', function (req, res, next) {
    GetAllProduct(function (result) {
        console.log(result);
    })
    res.send("OK");
});
// ============== DEBUG business.js ============

// 2.1.1
function GetAllProduct(callback) {
    DAL.QueryProducts({}, 0, function (products) {
        callback(products);
    })
}

// 2.1.2
function GetProductByPageIndex(queryObj, pageIndex, callback) {
    DAL.QueryProducts(queryObj, pageIndex, function (products) {
        callback(products);
    })
}

// Get product by category id
function GetProductByCategoryID(categoryID, pageIndex, callback) {
    var queryObj = {
        category: new mongoose.Types.ObjectId(categoryID)
    }

    DAL.QueryProducts(queryObj, pageIndex, function (products) {
        callback(products);
    })
}

// Get all category
function GetAllCategory(callback) {
    DAL.QueryCategory({}, function (cats) {
        return callback(cats);
    })
}


var exportObj = {
    GetAllProduct: GetAllProduct,
    GetProductByPageIndex: GetProductByPageIndex,
    GetProductByCategoryID: GetProductByCategoryID,
    GetAllCategory: GetAllCategory
};

// module.exports = exportObj;


// ============== DEBUG business.js ============
module.exports = router;
// ============== DEBUG business.js ============