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
    // ChangeItemInCart("JwnL6i8oCqHZshnijkXbsRyKIA8AJ5dW", 2, "5b24f3e1968641237042a01b", 1997, "TimMongMo", "XXXM", function () { });
    GetTopProducts(10, function (res) {
        console.log(res);
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

// 2.1.3
function GetProductByCategoryID(categoryID, pageIndex, callback) {
    var queryObj = {
        category: new mongoose.Types.ObjectId(categoryID)
    }

    DAL.QueryProducts(queryObj, pageIndex, function (products) {
        callback(products);
    })
}

// 2.1.4
function GetAllCategory(callback) {
    DAL.QueryCategory({}, function (cats) {
        return callback(cats);
    })
}

// 2.1.11
function AddItemToCart(sessionID, productID, quantity, color, size, callback) {
    var cartDetal = {
        product: new mongoose.Types.ObjectId(productID),
        quantity: quantity,
        color: color,
        size: size
    }

    DAL.InsertItemToCart(sessionID, cartDetal, function (success) {
        callback(success);
    })
}

// 2.1.12
function ChangeItemInCart(sessionID, itemIndex, productID, quantity, color, size, callback) {
    var newCartDetail = {
        product: new mongoose.Types.ObjectId(productID),
        quantity: quantity,
        color: color,
        size: size
    }

    DAL.UpdateItemInCart(sessionID, itemIndex, newCartDetail, function (success) {
        callback(success);
    })
}

// 2.1.13
function RemoveItemInCart(sessionID, itemIndex, callback) {
    DAL.DeleteItemInCart(sessionID, itemIndex, function (success) {
        callback(success);
    })
}

// 2.1.14
function RegisterNewUser(type, username, password, name, email, phone, address, callback) {
    var code = "";
    async.series([
        function (cb) {
            // Generate email activation code
            var possible = CONST.EMAIL_ACTIVATION_KEY;

            for (var i = 0; i < 15; i++) {
                code += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            cb();
        },

        function (cb) {
            // Build a USER 
            var newUser = {
                type: type,
                username: username,
                password: password,
                name: name,
                email: email,
                phone: phone,
                address: address,
                emailActivationCode: code
            }

            DAL.CreateUser(newUser, function (success) {
                callback(success);
                cb();
            })
        }
    ]);
}

// 2.1.15
function GetUser(username, callback) {
    DAL.QueryUser(username, function (user) {
        callback(user);
    })
}

// 2.1.16
function ValidateLogin(username, password, callback) {
    DAL.QueryUser(username, function (user) {
        if (user.password == password) {
            return callback(true, user.type);
        } else {
            return callback(false, null);
        }
    })
}

// 2.1.17
function ChangeUserInfo(username, name, phone, address, callback) {
    // Build new USER
    var newUser = {
        name: name,
        phone: phone,
        address: address
    }

    // Update USER in database
    DAL.UpdateUser(username, newUser, function (success) {
        callback(success);
    })
}

// 2.1.18
function ChangePassword(username, newPassword, callback) {
    // Build new USER
    var newUser = {
        password: newPassword
    }

    // Update USER in database
    DAL.UpdateUser(username, newUser, function (success) {
        callback(success);
    })
}

// 2.1.20
function Order(username, cartID, note, recipientName, address, phone, callback) {
    
}

// 2.1.21
function GetAllOrderOfUser(username, callback) {
    DAL.QueryOrder(username, function (orders) {
        callback(orders);
    })
}

// 2.1.22
function GetSaleStatistic(startDate, endDate, criteria, callback) {

}

// 2.1.23
function GetTopProducts(topN, callback) {
    DAL.QueryProducts({}, 0, function (products) {
        callback(products.sort(function (a, b) { return (b.nItemSold - a.nItemSold) }).slice(0, topN));
    })
}


var exportObj = {
    GetAllProduct: GetAllProduct,
    GetProductByPageIndex: GetProductByPageIndex,
    GetProductByCategoryID: GetProductByCategoryID,
    GetAllCategory: GetAllCategory,
    AddItemToCart: AddItemToCart,
    ChangeItemInCart: ChangeItemInCart,
    RemoveItemInCart: RemoveItemInCart,
    RegisterNewUser: RegisterNewUser,
    GetUser: GetUser,
    ValidateLogin: ValidateLogin,
    ChangeUserInfo: ChangeUserInfo,
    ChangePassword: ChangePassword,
    GetAllOrderOfUser: GetAllOrderOfUser,
    GetTopProducts: GetTopProducts

};

// module.exports = exportObj;


// ============== DEBUG business.js ============
module.exports = router;
// ============== DEBUG business.js ============