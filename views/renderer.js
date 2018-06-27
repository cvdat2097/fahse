var express = require('express');
var Handlebars = require('express-handlebars');
var async = require('async');
var business = require('../controller/business');
var CONST = require('../config');
var dal = require('../models/DAL');
var mongoose = require('mongoose');

// Mongoose models
var Cart = require('../models/cartModel');
var Category = require('../models/categoryModel');
var Order = require('../models/orderModel');
var Product = require('../models/productModel');
var User = require('../models/userModel');


var IndexPage = {
    // index.html & /
    RenderIndexPage: function RenderIndexPage(req, res, next) {
        var productList;
        var categoryList;

        async.series([
            function (cb) {
                business.GetTopProducts(10, function (products) {
                    productList = products;
                    cb();
                })
            },

            function (cb) {
                business.GetAllCategory(function (cats) {
                    categoryList = cats;
                    cb();
                })
            },

            // ROUTING
            function (cb) {
                res.render('index', {
                    productList: productList,
                    categoryList: categoryList,
                    listName: "SẢN PHẨM BÁN CHẠY",
                    isLogged: req.isAuthenticated()
                });
                cb();
            }
        ]);
    }
}

var ProductPage = {
    RenderProductPage: function RenderProductPage(req, res, next) {
        var categoryList;

        async.series([
            function (cb) {
                Category.find({}, function (err, categories) {
                    categoryList = categories;
                    cb();
                });
            },

            // ROUTING
            function (cb) {
                var productID = req.param('product');
                if (productID == "") {
                    res.send("Không tìm thấy sản phẩm");
                    next();
                }
                business.GetProduct(productID, function (product) {
                    if (product != null && product) {


                        var optionObj = product;

                        for (var i = 0; i < product.category.length; i++) {
                            for (var x of categoryList) {
                                if (optionObj.category[i].toString() === x._id.toString()) {
                                    optionObj.category[i] = {
                                        name: x.name,
                                        id: x._id.toString()
                                    }
                                    break;
                                }
                            }
                        }

                        business.IncreaseProductView(product._id.toString(), 1, function (success) {

                        });
                        optionObj.isLogged = req.isAuthenticated();
                        res.render('product', optionObj);
                    } else {
                        res.send("Lỗi: Không thể lấy thông tin sản phẩm");
                    }
                })

                cb();
            }
        ]);
    }

}

var ProductListPage = {
    // By Category
    RenderProductListPageCategory: function RenderProductListPageCategory(req, res, next) {
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

                    optionObj.isLogged = req.isAuthenticated()
                    res.render('product-list', optionObj);

                    cb();
                });
            }
        ]);
    },
    // All products
    RenderProductListPage: function RenderProductListPage(req, res, next) {
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

                var pageIndex = req.param('pageindex');
                pageIndex = (pageIndex && pageIndex > 0) ? pageIndex : 1;

                queryObj = {
                    category: req.param('category') != "" ? req.param('category') : undefined,
                    size: req.param('size') != "" ? req.param('size') : undefined,
                    color: req.param('color') != "" ? req.param('color') : undefined,
                    price: req.param('price') != "" ? req.param('price') : undefined,
                    keyword: req.param('keyword') != "" ? req.param('keyword') : undefined,
                    sorting: req.param('sorting') != "" ? req.param('sorting') : undefined
                }

                business.GetProductByPageIndex(queryObj, pageIndex, function (products, nProducts) {
                    var paging = [];
                    var currentURL = "/product-list.html?";

                    for (var y in queryObj) {
                        if (queryObj[y] != undefined) {
                            currentURL += y + "=" + queryObj[y] + "&"
                        }
                    }

                    for (var i = 0; i <= Math.floor(nProducts / CONST.PRODUCT_PER_PAGE); i++) {
                        paging.push({
                            index: i + 1,
                            url: currentURL + "pageindex=" + (i + 1).toString()
                        });
                    }

                    var optionObj = {
                        productList: products,
                        categoryList: categoryList,
                        pagination: paging
                    }
                    optionObj.isLogged = req.isAuthenticated();

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
    }
}


var LoginPage = {
    RenderLoginPageGET: function RenderLoginPageGET(req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.type == 'admin') {
                res.redirect('/admin');
            } else {
                res.redirect('/');
            }
        } else {
            // Login faild
            res.render('', { layout: '../login' });
        }
    }
}

var RegisterPage = {
    RenderRegisterPage: function RenderRegisterPage(req, res, next) {
        var optionObj = {
            isLogged: req.isAuthenticated()
        }
        optionObj.isLogged = req.isAuthenticated();
        res.render('register', optionObj)
    }

}

var AdminPage = {
    RenderAdminIndexPageGET: function RenderAdminIndexPageGET(req, res, next) {
        if (!req.isAuthenticated() || req.user.type != 'admin') {
            res.redirect('/login.html');
            res.end();
        } else {
            var optionObj = {
                layout: 'adminlayout',
                user: req.user,
                isLogged: req.isAuthenticated()
            }

            res.render('admin/index', optionObj)
        }
    },

    RenderAdminProductPage: function RenderAdminProductPage(req, res, ajax, next) {
        if (!req.isAuthenticated() || req.user.type != 'admin') {
            res.redirect('/login.html');
            res.end();
        } else {


            business.GetAllProduct(function (products) {
                if (products == null) {
                    res.send("Lỗi: Không thể lấy danh sách sản phẩm");
                } else {
                    var optionObj = {
                        layout: 'adminlayout',
                        products: products,
                        user: req.user,
                        isLogged: req.isAuthenticated()
                    }
                    if (ajax) {
                        optionObj.layout = false;
                        res.render('admin/product', optionObj);
                    } else {
                        res.render('admin/product', optionObj);
                    }
                }
            })
        }
    },

    RenderAdminUserPage: function RenderAdminUserPage(req, res, ajax, next) {
        if (!req.isAuthenticated() || req.user.type != 'admin') {
            res.redirect('/login.html');
            res.end();
        } else {
            User.find({}, function (err, users) {
                if (users == null) {
                    res.send("Lỗi: Không thể lấy danh sách người dùng");
                } else {
                    var optionObj = {
                        layout: 'adminlayout',
                        users: users,
                        user: req.user,
                        isLogged: req.isAuthenticated()
                    }
                    if (ajax) {
                        optionObj.layout = false;
                        res.render('admin/user', optionObj);
                    } else {
                        res.render('admin/user', optionObj);
                    }
                }
            })
        }
    },

    RenderAdminOrderPage: function RenderAdminOrderPage(req, res, next) {
        if (!req.isAuthenticated() || req.user.type != 'admin') {
            res.redirect('/login.html');
            res.end();
        } else {
            Order.find({}, function (err, orders) {
                if (orders == null) {
                    res.send("Lỗi: Không thể lấy danh sách đơn hàng");
                } else {

                    var optionObj = {
                        orders: orders,
                        layout: 'adminlayout',
                        user: req.user,
                        isLogged: req.isAuthenticated()
                    }
                    if (req.param('ajax') == 'true') {
                        optionObj.layout = false;
                    }
                    res.render('admin/order', optionObj);
                }
            })
        }

    }
}

var CheckoutPage = {
    RenderCheckoutPageGET: function RenderCartDetailPageGET(req, res, next) {
        var optionObj = {};
        var cartDetail = [];
        optionObj.isLogged = req.isAuthenticated();
        // var sessionId = req.sessionID;
        business.GetCart(req.sessionID, function (cart) {
            if (cart == null || cart.detail.length == 0) {
                optionObj.cartIsEmpty = true;
                res.render('checkout', optionObj);
            } else {
                optionObj.totalPrice = business.ToCurrencyFormat(business.GetTotalPriceCart(cart.detail));
                for (var x of cart.detail) {
                    x.price = business.ToCurrencyFormat(x.price);
                    x.totalPrice = business.ToCurrencyFormat(x.totalPrice);
                }
                optionObj.cartDetail = cart.detail;
                optionObj.cartIsEmpty = false;


                if (req.param('ajax') == 'true') {
                    optionObj.layout = false;
                    res.render('partials/checkout-list', optionObj);

                } else {
                    res.render('checkout', optionObj);
                }
            }
        });
    }
}

var CartForm = {
    RenderCartFormGET: function RenderCartFormGET(req, res, next) {
        var optionObj = {};
        optionObj.isLogged = req.isAuthenticated();

        // var sessionId = req.sessionID;
        business.GetCart(req.sessionID, function (cart) {
            if (cart == null || cart.detail.length == 0) {
                res.send("Giỏ hàng rỗng");
            } else {
                optionObj.totalPrice = business.ToCurrencyFormat(business.GetTotalPriceCart(cart.detail));
                for (var x of cart.detail) {
                    x.price = business.ToCurrencyFormat(x.price);
                    x.totalPrice = business.ToCurrencyFormat(x.totalPrice);
                }

                optionObj.cartDetail = cart.detail;
                optionObj.layout = false;

                res.render('partials/cart', optionObj);
            }
        });
    }
}

var AccountSettingsPage = {
    RenderAccountSettingsPage: function RenderAccountSettingsPage(req, res, next) {
        var optionObj = {
            isLogged: req.isAuthenticated()
        }
        res.render('account-settings', optionObj)
    }
}

module.exports.IndexPage = IndexPage;
module.exports.AdminPage = AdminPage;
module.exports.LoginPage = LoginPage;
module.exports.ProductListPage = ProductListPage;
module.exports.ProductPage = ProductPage;
module.exports.CheckoutPage = CheckoutPage;
module.exports.RegisterPage = RegisterPage;
module.exports.CartForm = CartForm;
module.exports.AccountSettingsPage = AccountSettingsPage;