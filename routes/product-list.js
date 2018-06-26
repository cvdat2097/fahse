var express = require('express');
var router = express.Router();
var renderer = require('../views/renderer');

router.get('/', function (req, res, next) {
  if(req.param("category")){
    renderer.ProductListPage.RenderProductListPageCategory(req,res,next);
  }else{
    renderer.ProductListPage.RenderProductListPage(req,res,next);
  }
});

module.exports = router;