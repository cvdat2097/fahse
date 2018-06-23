var express = require('express');
var router = express.Router();
var renderer = require('../views/renderer');
var business = require('../controller/business');

// Routing
router.get('/', function (req, res, next) {
  switch (req.param('type')) {
    case undefined:
      renderer.CartForm.RenderCartFormGET(req, res, next);
      break;

    case "removeCartItem":
      // == DEBUG
      business.RemoveItemInCart(req.sessionID, Number.parseInt(req.param('itemIndex')), function (success) {
        res.send(success.toString());
      });
      break;

    case "addItemToCart":
      var productID = req.param('productID');
      var quantity = req.param('quantity');
      var color = req.param('color');
      var size = req.param('size');
      business.AddItemToCart(req.sessionID, productID, quantity, color, size, function (success) {
        res.send(success.toString());
      })
      break;
  }
});

module.exports = router;