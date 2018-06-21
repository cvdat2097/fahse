var async = require('async');
var express = require('express');
var router = express.Router();
var business = require('../controller/business');
var CONST = require('../config');
var mongoose = require('mongoose');
var Category = require('../models/categoryModel.js');
var Product = require('../models/productModel.js');
var Order = require('../models/orderModel.js');
var User = require('../models/userModel.js');
var Cart = require('../models/cartModel.js');

// ============== DEBUG DAL.js ============
router.get('/', function (req, res, next) {
    var cartSession = "JwnL6i8oCqHZshnijkXbsRyKIA8AJ5dW"
    var cdetail = {
        product: new mongoose.Types.ObjectId("5b24f3e1968641237042a01b"),
        quantity: 500,
        color: "Do Xanh Tim",
        size: "XL XS"
    }

    DeleteItemInCart("JwnL6i8oCqHZshnijkXbsRyKIA8AJ5dW", 2, function (success) {
        console.log(success);
    })
    res.send("OK");
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

            if (pageIndex <= 0) {
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

// 3.1.2
function QueryRelatedProducts(productID, topN, callback) {
    var queryFunction = Product.findOne({ _id: new mongoose.Types.ObjectId(productID) }, { relatedProducts: 1 });

    queryFunction.exec(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            return callback(result.relatedProducts.slice(0, topN));
        }
    });
}

// 3.1.3
function QueryProductComments(productID, pageIndex, callback) {
    if (pageIndex <= 0) {
        pageIndex = 0;
    }

    var queryFunction;

    if (pageIndex > 0) {
        queryFunction = Product.findOne({ _id: new mongoose.Types.ObjectId(productID) }, {
            comment: {
                $slice: [CONST.COMMENT_PER_PAGE * (pageIndex - 1), CONST.COMMENT_PER_PAGE]
            }
        });
    } else {
        queryFunction = Product.findOne({ _id: new mongoose.Types.ObjectId(productID) }, {
            comment: 1
        });
    }

    queryFunction.exec(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            return callback(result.comment);
        }
    });
}

// 3.1.4
function InsertProductComments(productID, comment, callback) {
    if (!comment.username || !comment.content || !comment.date) {
        console.log("ERR: Comment is empty");
        return callback(false);
    }

    Product.update(
        { _id: new mongoose.Types.ObjectId(productID) },
        { $push: { comment: comment } }, function (err) {
            if (err) {
                console.log(err);
                return callback(false);
            } else {
                return callback(true);
            }
        }
    )
}

// 3.1.5
function CreateCart(sessionID, callback) {
    if (sessionID !== "") {
        Cart.create({
            session: sessionID
        }, function (err) {
            if (err) {
                console.log(err);
                callback(false);
            } else {
                console.log("Cart created");
                callback(true);
            }
        });
    }
}

// 3.1.6
function QueryCart(sessionID, callback) {
    if (sessionID) {
        Cart.findOne({ session: sessionID }).exec(function (err, cart) {
            if (err) {
                console.log(err);
                callback(null);
            } else {
                if (cart != null) {
                    callback(cart, cart.detail.length);
                } else {
                    callback(null);
                }
            }
        });
    } else {
        console.log("ERR QueryCart: sessionID is invalid");
        callback(null);
    }
}

// 3.1.7
function InsertItemToCart(sessionID, newCartDetail, callback) {
    if (!newCartDetail || !newCartDetail.product || !newCartDetail.quantity || !newCartDetail.color
        || !newCartDetail.size) {
        console.log("ERR: CartDetail is in wrong format");
        return callback(false);
    }


    // Check sessionID is valid or not
    Cart.findOne({ session: sessionID }, function (err, res) {
        if (err) {
            console.log(err)
        } else {
            if (!res) {
                return callback(false)
            } else {
                Cart.update(
                    { session: sessionID },
                    { $push: { detail: newCartDetail } }, function (err) {
                        if (err) {
                            console.log(err);
                            return callback(false);
                        } else {
                            return callback(true);
                        }
                    }
                )
            }
        }
    })


}

// 3.1.8
function UpdateItemInCart(sessionID, itemIndex, newCartDetail, callback) {
    if (!newCartDetail || !newCartDetail.product || !newCartDetail.quantity || !newCartDetail.color
        || !newCartDetail.size) {
        console.log("ERR: CartDetail is in wrong format");
        return callback(false);
    }


    // Check sessionID is valid or not
    Cart.findOne({ session: sessionID }, function (err, res) {
        if (err) {
            console.log(err)
        } else {
            if (!res) {
                return callback(false)
            } else {
                var setObj = {};
                setObj["detail." + itemIndex] = newCartDetail;
                Cart.update(
                    { session: sessionID },
                    {
                        $set: setObj
                    }
                    , function (err) {
                        if (err) {
                            console.log(err)
                        } else {
                            callback(true);
                        }
                    })
            }
        }
    })
}

// 3.1.9
function DeleteItemInCart(sessionID, itemIndex, callback) {
    // Check sessionID is valid or not
    Cart.findOne({ session: sessionID }, function (err, res) {
        if (err) {
            console.log(err)
        } else {
            if (!res) {
                console.log("Cart not found");
                return callback(false)
            } else {
                var unsetObj = {};
                unsetObj["detail." + itemIndex] = 1;
                Cart.update({ session: sessionID }, { $unset: unsetObj }, function (err) {
                    if (err) {
                        console.log(err);
                        callback(false);
                    } else {
                        Cart.update({ session: sessionID }, { $pull: { "detail": null } }, function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                callback(true);
                            }

                        })
                    }
                });

            }
        }
    })
}

// 3.1.10
function CreateUser(newUser, callback) {
    if (!newUser || !newUser.type || !newUser.username || !newUser.password || !newUser.name || !newUser.email
        || !newUser.phone || !newUser.address) {
        console.log("ERR: newUser is in wrong format");
        return callback(false);
    }

    // Generate random email activation code
    var emailCode = "";
    var possible = CONST.EMAIL_ACTIVATION_KEY;

    for (var i = 0; i < 10; i++) {
        emailCode += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    newUser.emailActivationCode = emailCode;

    User.create(newUser, function (err) {
        if (err) {
            console.log(err);
            callback(false);
        } else {
            console.log("User created");
            callback(true);
        }
    });
}

// 3.1.11
function QueryUser(username, callback) {
    if (username == "") {
        User.find({}, function (err, userFound) {
            if (err) {
                console.log(err);
                callback(undefined);
            } else {
                if (userFound && userFound != null) {
                    console.log("User found");
                    callback(userFound);
                } else {
                    console.log("User not found");
                    callback(null);
                }
            }
        })
    } else {
        User.findOne({ username: username }, function (err, userFound) {
            if (err) {
                console.log(err);
                callback(null);
            } else {
                if (userFound && userFound != null) {
                    console.log("User found");
                    callback(userFound);
                } else {
                    console.log("User not found");
                    callback(null);
                }
            }
        })
    }


}

// 3.1.12
function UpdateUser(username, newUser, callback) {
    User.findOneAndUpdate({ username: username }, newUser, function (err) {
        if (err) {
            console.log(err);
            callback(false);
        } else {
            console.log("User updated successfully");
            callback(true);
        }
    })
}

// 3.1.13
function CreateOrder(newOrder, callback) {
    if (!newOrder || !newOrder.status || !newOrder.user || !newOrder.detail || !newOrder.note
        || !newOrder.recipientName || !newOrder.address || !newOrder.phone) {
        console.log("ERR in CreateOrder: newOrder is in wrong format");
        return callback(false);
    }


    Order.create(newOrder, function (err) {
        if (err) {
            console.log(err);
            callback(false);
        } else {
            console.log("Order created");
            callback(true);
        }
    });
}

// 3.1.14
function QueryOrder(username, callback) {
    if (username == "") {
        Order.find({}, function (err, orders) {
            if (err) {
                console.log(err);
                return callback(null);
            } else {
                console.log("Order found");
                return callback(orders);
            }
        })
    } else {
        User.findOne({ username: username }, function (err, userFound) {
            if (err) {
                console.log(err);
                return callback(null);
            } else {
                if (userFound) {
                    console.log("User found");

                    var userID = userFound._id;

                    Order.find({ user: userID }, function (err, orders) {
                        if (err) {
                            console.log(err);
                            return callback(null);
                        } else {
                            console.log("Order found");
                            return callback(orders);
                        }
                    })

                } else {
                    console.log("User not found");
                    return callback(null);
                }
            }
        })
    }
}

// 3.1.15
function QueryCategory(queryObj, callback) {
    Category.find(queryObj, function (err, cats) {
        if (err) {
            console.log(err);
        } else {
            return callback(cats);
        }
    });
}

// 3.1.16
function InsertRelatedProduct(srcProductID, relatedProductID, callback) {
    Product.findOne({ _id: new mongoose.Types.ObjectId(srcProductID) }, function (err, srcProduct) {
        if (err) {
            console.log(err);
            return callback(false);
        } else {
            var relatedProductsArray = srcProduct.relatedProducts;

            for (var i = 0; i < relatedProductsArray.length; i++) {
                var firstObjectID = relatedProductsArray[i].product.toString();
                var secondObjectID = relatedProductID.toString();
                if (firstObjectID == secondObjectID) {
                    // related product is existing in related list of srcProduct
                    var setObj = {};
                    relatedProductsArray[i].time = relatedProductsArray[i].time + 1;
                    setObj["relatedProducts." + i.toString()] = relatedProductsArray[i];
                    Product.updateOne(
                        { _id: new mongoose.Types.ObjectId(srcProductID) },
                        {
                            $set: setObj
                        }
                        , function (err) {
                            if (err) {
                                console.log(err);
                                return callback(false);
                            } else {
                            }
                        });
                    return callback(true);
                }
            }

            // related product doesn't exist in related list of srcProduct
            var newRelatedProductObj = {
                product: new mongoose.Types.ObjectId(relatedProductID),
                time: 1
            }
            Product.update(
                { _id: new mongoose.Types.ObjectId(srcProductID) },
                { $push: { relatedProducts: newRelatedProductObj } }, function (err) {
                    if (err) {
                        console.log(err);
                        return callback(false);
                    } else {
                        return callback(true);
                    }
                }
            )
        }
    })
}

var exportObj = {
    QueryProducts: QueryProducts,
    QueryRelatedProducts: QueryRelatedProducts,
    QueryProductComments: QueryProductComments,
    InsertProductComments: InsertProductComments,
    CreateCart: CreateCart,
    QueryCart: QueryCart,
    InsertItemToCart: InsertItemToCart,
    UpdateItemInCart: UpdateItemInCart,
    DeleteItemInCart: DeleteItemInCart,
    CreateUser: CreateUser,
    QueryUser: QueryUser,
    UpdateUser: UpdateUser,
    CreateOrder: CreateOrder,
    QueryOrder: QueryOrder,
    QueryCategory: QueryCategory,
    InsertRelatedProduct: InsertRelatedProduct
}

module.exports = exportObj;

// ============== DEBUG DAL.js ============
// module.exports = router;
// ============== DEBUG DAL.js ============