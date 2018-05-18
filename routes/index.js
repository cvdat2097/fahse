var express = require('express');
var async = require('async');
var router = express.Router();


// Get product list
var Product = require('../models/productModel.js');
var Category = require('../models/categoryModel.js');
global.htmlCategories = "";
global.htmlProducts = "";

// Create categories HTML element
function createHTMLCategory(URL, innerHTML) {
  return "<li> <a href=\"" + URL + "\">" + innerHTML + "</a></li>";
}

// Create product list HTML element
function createHTMLProduct(productID, productName, productPrice, productImage) {
  var r = "";
  r = '<div class="item-slick2 p-l-15 p-r-15">\n\
  <div class="block2">\n\
    <div class="block2-img wrap-pic-w of-hidden pos-relative block2-labelnew">\n\
      <img src="' + productImage + '" alt="IMG-PRODUCT">\n\
      <div class="block2-overlay trans-0-4">\n\
        <a href="#" class="block2-btn-addwishlist hov-pointer trans-0-4">\n\
          <i class="icon-wishlist icon_heart_alt" aria-hidden="true"></i>\n\
          <i class="icon-wishlist icon_heart dis-none" aria-hidden="true"></i>\n\
        </a>\n\
\n\
        <div class="block2-btn-addcart w-size1 trans-0-4">\n\
          <button class="flex-c-m size1 bg4 bo-rad-23 hov1 s-text1 trans-0-4">\n\
            Thêm vào giỏ\n\
          </button>\n\
        </div>\n\
      </div>\n\
    </div>\n\
\n\
    <div class="block2-txt p-t-20">\n\
      <a href="product.html?product='+ productID + '" class="block2-name dis-block s-text3 p-b-5">' +
    productName +
    '</a>\n\
      <span class="block2-price m-text6 p-r-5">' +
    productPrice +
    '</span> \n\
    </div>\n\
  </div>\n\
</div>';

  return r;
}
router.get('/', function (req, res, next) {
  async.series([
    function (cb) {
      Product.find({}, function (err, products) {
        var i;
        global.htmlProducts = "";
        for (i = 0; i < products.length; i++) {
          global.htmlProducts += createHTMLProduct(products[i].id, products[i].name, products[i].price, (products[i].images)[0]);
        }

        cb();
      });
    },

    function (cb) {
      Category.find({}, function (err, categories) {
        var i;
        global.htmlCategories = "";
        for (i = 0; i < categories.length; i++) {
          global.htmlCategories += createHTMLCategory('filter.html?category=' + categories[i]._id, categories[i].name);
        }
        cb();
      });
    },

    // ROUTING
    function (cb) {
      res.render('index', {
        productList: global.htmlProducts,
        categoryList: global.htmlCategories
      });
      cb();
    }
  ]);
});

module.exports = router;