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
        res.render('register', optionObj)
    }

}

var AdminPage = {
    RenderAdminIndexPageGET: function RenderAdminIndexPageGET(req, res, next) {
        // if (!req.isAuthenticated() || req.user.type != 'admin') {
        //     res.redirect('/login.html');
        //     res.end();
        // } else 
        {
            var optionObj = {
                layout: 'adminlayout'
            }
            res.render('admin/index', optionObj)
        }
    },

    RenderAdminProductPage: function RenderAdminProductPage(req, res, next) {
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
                res.render('admin/product', optionObj);
            }
        })
    },

    RenderAdminCategoryPage: function RenderAdminCategoryPage(req, res, next) {
        var optionObj = {
            layout: 'adminlayout'
        }
        res.render('admin/category', optionObj);
    }
}

var CheckoutPage = {
    RenderCheckoutPageGET: function RenderCartDetailPageGET(req, res, next) {
        var optionObj = {};
        var cartDetail = [];

        // var sessionId = req.sessionID;
        business.GetCart(req.sessionID, function (cart) {
            if (cart == null || cart.detail.length == 0) {
                optionObj.cartIsEmpty = true;
                res.render('checkout', optionObj);
            } else {
                async.series([
                    function (cb1) {
                        async.eachSeries(cart.detail, function (currentCartDetail, cb) {
                            business.GetProduct(currentCartDetail.product.toString(), function (product) {
                                if (product && product != null) {
                                    cartDetail.push({
                                        image: product.images[0],
                                        color: this.color,
                                        size: this.size,
                                        name: product.name,
                                        quantity: this.quantity,
                                        price: product.price,
                                        id: product._id
                                    })
                                };
                                cb();
                            }.bind(currentCartDetail));
                        }, function (err) {
                            if (err) {
                                console.log(err);
                            }
                            cb1();
                        });

                    },
                    function (cb) {
                        optionObj.cartDetail = cartDetail;
                        optionObj.cartIsEmpty = false;
                        if (req.param('ajax') == 'true') {
                            optionObj.layout = false;
                            res.render('partials/checkout-list', optionObj);

                        } else {
                            res.render('checkout', optionObj);
                        }
                        cb();
                    }])
            }
        });
    }
}

var CartForm = {
    RenderCartFormGET: function RenderCartFormGET(req, res, next) {
        var optionObj = {};
        var cartDetail = [];

        // var sessionId = req.sessionID;
        business.GetCart(req.sessionID, function (cart) {
            if (cart == null || cart.detail.length == 0) {
                res.send("Giỏ hàng rỗng");
            } else {
                async.series([
                    function (cb1) {
                        async.eachSeries(cart.detail, function (currentCartDetail, cb) {
                            business.GetProduct(currentCartDetail.product.toString(), function (product) {
                                if (product && product != null) {
                                    cartDetail.push({
                                        image: product.images[0],
                                        color: this.color,
                                        size: this.size,
                                        name: product.name,
                                        quantity: this.quantity,
                                        price: product.price,
                                        id: product._id
                                    })
                                };
                                cb();
                            }.bind(currentCartDetail));
                        }, function (err) {
                            if (err) {
                                console.log(err);
                            }
                            cb1();
                        });

                    },
                    function (cb) {
                        optionObj.cartDetail = cartDetail;
                        optionObj.layout = false;

                        res.render('partials/cart', optionObj);
                        cb();
                    }])
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