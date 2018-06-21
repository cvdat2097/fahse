var express = require('express');
var router = express.Router();
var renderer = require('../views/renderer');

// Routing
router.get('/', function (req, res, next) {
  renderer.AdminPage.RenderAdminIndexPageGET(req, res, next);
});

router.get('/index.html', function (req, res, next) {
  renderer.AdminPage.RenderAdminIndexPageGET(req, res, next);
});

// Edit database
router.get('/product.html', function (req, res, next) {
  renderer.AdminPage.RenderAdminProductPage(req, res, next);
});

router.get('/category.html', function (req, res, next) {
  renderer.AdminPage.RenderAdminCategoryPage(req,res,next);
});

module.exports = router;