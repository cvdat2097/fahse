var express = require('express');
var async = require('async');
var router = express.Router();
var lib = require('./lib');
var User = require('../models/userModel.js');
var renderer = require('../views/renderer');

router.post('/', function (req, res, next) {
    renderer.LoginPage.RenderLoginPagePOST(req,res,next);
});

router.get('/', function (req, res, next) {
    renderer.LoginPage.RenderLoginPageGET(req,res,next);
});

module.exports = router;