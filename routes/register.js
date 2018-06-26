var express = require('express');
var router = express.Router();
var business = require('../controller/business');
var renderer = require('../views/renderer');


router.get('/', function (req, res, next) {
  renderer.RegisterPage.RenderRegisterPage(req, res, next);
});

module.exports = router;