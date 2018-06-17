var async = require('async');
const mongoose = require('mongoose');
var Category = require('../models/categoryModel.js');
var Product = require('../models/productModel.js');
var CONST = require('../config');
var result;


// Get all product
function GetAllProduct(callback) {
    Product.find({}, function (err, products) {
        if (err) {
            console.log(err);
        } else {
            return callback(products);
        }
    });
}

// Get product by page index
function GetProductByPageIndex(pageIndex, callback) {
    Product.find({}, function (err, products, pageIndex) {
        if (err) {
            console.log(err);
        } else {
            var nProducts = products.length;
            products = products.slice(CONST.PRODUCT_PER_PAGE * (this.pageIndex - 1),
                CONST.PRODUCT_PER_PAGE * this.pageIndex);

            return callback(products, nProducts);
        }
    }.bind({ pageIndex: pageIndex }));
}

// Get product by category id
function GetProductByCategoryID(categoryID, pageIndex, callback) {
    Product.find({ category: new mongoose.Types.ObjectId(categoryID) }, function (err, products) {
        if (err) {
            console.log(err);
        } else {
            var nProducts = products.length;
            products = products.slice(CONST.PRODUCT_PER_PAGE * (this.pageIndex - 1),
                CONST.PRODUCT_PER_PAGE * this.pageIndex);

            return callback(products, nProducts);
        }
    }.bind({ categoryID: categoryID, pageIndex: pageIndex }));
}

// Get all category
function GetAllCategory(callback) {
    Category.find({}, function (err, cats) {
        if (err) {
            console.log(err);
        } else {
            return callback(cats);
        }
    });
}

function GetRelatedProduct(productID, topN, callback){
    Product.find({},function(err, products){
        if(err){
            console.log(err);
        }else{
            return callback(products);
        }
    });
}

var exportObj = {
    GetAllProduct: GetAllProduct,
    GetProductByPageIndex: GetProductByPageIndex,
    GetProductByCategoryID: GetProductByCategoryID,
    GetAllCategory: GetAllCategory
};

module.exports = exportObj;