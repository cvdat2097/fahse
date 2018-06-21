var express = require('express');
var router = express.Router();
var renderer = require('../views/renderer');

// Routing
router.get('/', function (req, res, next) {
  renderer.CheckoutPage.RenderCheckoutPageGET(req,res,next);
});

module.exports = router;