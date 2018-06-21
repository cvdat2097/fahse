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

    Order("dfadmin", "JwnL6i8oCqHZshnijkXbsRyKIA8AJ5dW", "note", "Nguye nVan Chi", "HCM City", "+849999999990", function (success) {
        console.log(success);
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

// 2.1.5
function GetRelatedProduct(productID, topN, callback) {
    DAL.QueryRelatedProducts(productID, topN, function (productDetails) {
        callback(productDetails);
    })
}

// 2.1.6
function GetAllProductComments(productID, callback) {
    DAL.QueryProductComments(productID, 0, function (comments) {
        callback(comments);
    })
}

// 2.1.7
function GetProductCommentsByPageIndex(productID, pageIndex, callback) {
    DAL.QueryProductComments(productID, pageIndex, function (comments) {
        callback(comments);
    })
}

// 2.1.8
function AddProductComments(productID, username, content, callback) {
    // Buidl COMMENT
    var newComment = {
        username: username,
        content: content,
        date: Date.now()
    }

    // Insert to Database
    DAL.InsertProductComments(productID, newComment, function (success) {
        callback(success);
    })
}

// 2.1.9
function GenerateCart(sessionID, callback) {
    DAL.CreateCart(sessionID, function (success) {
        callback(success);
    })
}

// 2.1.10
function GetCart(sessionID, callback) {
    DAL.QueryCart(sessionID, function (cart) {
        callback(cart);
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
function Order(username, sessionID, note, recipientName, address, phone, callback) {
    // Build ORDER
    var newOrder;

    DAL.QueryUser(username, function (userFound) {
        if (userFound != null && userFound) {
            DAL.QueryCart(sessionID, function (cartFound) {
                if (cartFound) {
                    if (cartFound.detail.length == 0) {
                        return callback(false, "cart is empty");
                    } else {
                        // Build ORDER
                        newOrder = {
                            status: "pending",
                            user: new mongoose.Types.ObjectId(userFound._id),
                            detail: cartFound.detail,
                            note: note,
                            recipientName: recipientName,
                            address: address,
                            phone: phone
                        }

                        // Create Order in database
                        DAL.CreateOrder(newOrder, function (success) {
                            if (success) {
                                // Update related products
                                var realtedProductsArray = cartFound.detail;

                                for (var i = 0; i < realtedProductsArray.length; i++) {
                                    for (var j = i + 1; j < realtedProductsArray.length; j++) {
                                        DAL.InsertRelatedProduct(realtedProductsArray[i].product, realtedProductsArray[j].product, function (success) {
                                            if (!success) {
                                                console.log("ERR Order - InsertRelatedProduct" + i.toString());
                                            }
                                        })
                                    }
                                }
                            }
                            return callback(success);
                        })
                    }
                } else {
                    console.log("Cart not found");
                    return callback(false);
                }
            })
        } else {
            return callback(false);
        }
    })
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

// 2.1.24
function GetProduct(productID, callback) {
   DAL.QueryOneProduct(productID, function (product) {
       callback(product);
   })
}

var exportObj = {
    GetAllProduct: GetAllProduct,
    GetProductByPageIndex: GetProductByPageIndex,
    GetProductByCategoryID: GetProductByCategoryID,
    GetAllCategory: GetAllCategory,
    GetCart: GetCart,
    AddItemToCart: AddItemToCart,
    ChangeItemInCart: ChangeItemInCart,
    RemoveItemInCart: RemoveItemInCart,
    RegisterNewUser: RegisterNewUser,
    GetUser: GetUser,
    ValidateLogin: ValidateLogin,
    ChangeUserInfo: ChangeUserInfo,
    ChangePassword: ChangePassword,
    GetAllOrderOfUser: GetAllOrderOfUser,
    GetTopProducts: GetTopProducts,
    GetRelatedProduct: GetRelatedProduct,
    GetAllProductComments: GetAllProductComments,
    GetProductCommentsByPageIndex: GetProductCommentsByPageIndex,
    AddProductComments: AddProductComments,
    GenerateCart: GenerateCart,
    GetProduct: GetProduct,
    Order: Order
};

module.exports = exportObj;


// ============== DEBUG business.js ============
// module.exports = router;
// ============== DEBUG business.js ============