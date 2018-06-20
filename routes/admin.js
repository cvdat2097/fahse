var express = require('express');
var router = express.Router();
var renderer = require('../views/renderer');

// Routing
router.get('/', function (req, res, next) {
  renderer.AdminPage.RenderAdminPageGET(req, res, next);
});

// Edit database
// ADD
router.post('/product', function (req, res, next) {
  renderer.AdminPage.RenderAdminPagePOSTProduct(req, res, next);
});

router.post('/category', function (req, res, next) {
  renderer.AdminPage.RenderAdminPagePOSTCategory(req,res,next);
});

module.exports = router;