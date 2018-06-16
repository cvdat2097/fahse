var express = require('express');
var router = express.Router();
var renderer = require('../views/renderer');


router.get('/', function (req, res, next) {
  renderer.ProductPage.RenderProductPage(req,res,next);
});


module.exports = router;