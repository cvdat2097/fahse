var express = require('express');
var Handlebars = require('express-handlebars');
var async = require('async');
var business = require('../controller/business');
var CONST = require('../config');
var dal = require('../models/DAL');

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
                Product.find({}, function (err, products) {
                    productList = products;
                    cb();
                });
            },

            function (cb) {
                Category.find({}, function (err, cats) {
                    categoryList = cats;
                    cb();
                });
            },

            // ROUTING
            function (cb) {
                res.render('index', {
                    productList: productList,
                    categoryList: categoryList,
                    listName: "DANH SÁCH SẢN PHẨM"
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
                var Product = require('../models/productModel.js');
                Product.find({ _id: req.param('product') }, function (err, products) {

                    var optionObj = products[0];
                    optionObj.categoryList = categoryList;

                    for (var x of categoryList) {
                        if (optionObj.category[0] == x._id.toString()) {
                            optionObj.category = x.name;
                            optionObj.categoryID = x._id.toString();
                        }
                    }

                    res.render('product', optionObj);
                });
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
                pageIndex = (pageIndex && pageIndex > 0) ? pageIndex : 0;

                queryObj = {
                    category: req.param('category'),
                    size: req.param('size'),
                    color: req.param('color'),
                    price: req.param('price'),
                    keyword: req.param('keyword'),
                    sorting: req.param('sorting')
                }

                business.GetProductByPageIndex(queryObj, pageIndex, function (products) {
                    var optionObj = {
                        productList: products,
                        categoryList: categoryList
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
    }
}

var CheckoutPage = {
    RenderCheckoutPage: function RenderCheckoutPage(req, res, next) {
    }

}

var LoginPage = {
    RenderLoginPagePOST: function RenderLoginPagePOST(req, res, next) {
        var username = req.body['user'];
        var pass = req.body['pass'];

        var loggedIn = false;

        User.find({}, function (err, adminList) {
            if (adminList.length > 0) {
                var i;
                for (i = 0; i < adminList.length; i++) {
                    if (adminList[i].username == username && adminList[i].password == pass) {
                        req.session.userid = username;
                        res.redirect('/admin.html');
                        loggedIn = true;
                        break;
                    }
                }
            }

            // Login failed
            if (loggedIn == false) {
                res.render('', { notification: 'Username or Password is incorrect', layout: 'admin/login' });
            }

        });
    },
    RenderLoginPageGET: function RenderLoginPageGET(req, res, next) {
        if (req.session.userid) {
            res.redirect('/admin.html');
        } else {
            res.render('', { layout: 'admin/login' });
        }
    }
}

var RegisterPage = {
    RenderRegisterPage: function RenderRegisterPage(req, res, next) {
    }

}

var AdminPage = {
    RenderAdminPageGET: function RenderAdminPageGET(req, res, next) {
        if (req.session.userid == undefined) {
            res.redirect('/login.html');
            res.end();
        } else {
            var table = req.param('table');

            switch (table) {
                case undefined:
                    table = 'product';
                case 'product':
                    {
                        Product.find({}, function (err, products) {
                            console.log(products);
                            res.render('admin/table-product', { products: products, layout: 'admin/adminlayout' });
                        });
                    }
                    break;

                case 'category':
                    {
                        Category.find({}, function (err, cats) {
                            console.log(cats);
                            res.render('admin/table-category', { cats: cats, layout: 'admin/adminlayout' });
                        });
                    }
                    break;
            }
        }
    },

    RenderAdminPagePOSTProduct: function RenderAdminPagePOSTProduct(req, res, next) {
        if (req.body['button-add'] == 'product') {
            var sizeArray = req.body['size'].split(',');
            var colorArray = req.body['color'].split(',');
            var imagesArray = req.body['images'].split(',');
            Product.create({
                name: req.body['name'],
                price: req.body['price'],
                description: req.body['description'],
                size: sizeArray,
                color: colorArray,
                images: imagesArray
            }, function () {
                console.log('Create successfully');
            });
        }

        if (req.body['button-delete']) {
            var id = req.body['button-delete'];
            console.log(id);
            Product.findOne({ _id: id }, function (err, doc) {
                if (doc != null) {
                    doc.remove();
                    console.log('Remove OK');
                }
            })
        }

        if (req.body['button-update']) {
            var id = req.body['button-update'];
            console.log(id);
            var updateObj = {
                name: req.body['name'],
                price: req.body['price'],
                description: req.body['description'],
                size: sizeArray,
                color: colorArray,
                images: imagesArray
            };

            Product.update({ _id: id }, updateObj, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('Update OK');
            });
        }
        res.redirect('/admin.html?table=product');
    },

    RenderAdminPagePOSTCategory: function RenderAdminPagePOSTCategory(req, res, next) {
        if (req.body['button-add'] == 'category') {
            Category.create({
                name: req.body['name'],
            }, function () {
                console.log('Create successfully');
            });
        }

        if (req.body['button-delete']) {
            var id = req.body['button-delete'];
            console.log(id);
            Category.findOne({ _id: id }, function (err, doc) {
                if (doc != null) {
                    doc.remove();
                    console.log('Remove OK');
                }
            })
        }

        if (req.body['button-update']) {
            var id = req.body['button-update'];
            console.log(id);
            var updateObj = {
                name: req.body['name'],
            };

            Category.update({ _id: id }, updateObj, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('Update OK');
            });
        }
        res.redirect('/admin.html?table=category');
    }
}


module.exports.IndexPage = IndexPage;
module.exports.AdminPage = AdminPage;
module.exports.LoginPage = LoginPage;
module.exports.ProductListPage = ProductListPage;
module.exports.ProductPage = ProductPage;
module.exports.CheckoutPage = CheckoutPage;
module.exports.RegisterPage = RegisterPage;