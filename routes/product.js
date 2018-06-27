var express = require('express');
var router = express.Router();
var renderer = require('../views/renderer');
var business = require('../controller/business');

router.post('/comment', function (req, res, next) {
  var user = req.param('user');
  var content = req.param('content');
  var productID = req.param('productID');

  business.AddProductComments(productID, user, content, function (success) {
    res.send(success);
  })
});

router.get('/', function (req, res, next) {
  renderer.ProductPage.RenderProductPage(req, res, next);
});

module.exports = router;