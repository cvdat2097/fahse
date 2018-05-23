var express = require('express');
var async = require('async');
var router = express.Router();
var lib = require('./lib');


router.get('/', function (req, res, next) {
  if (lib.GetCookie(req, 'admin') === null) {
    res.redirect('/login.html');
  } else {
    res.render('admin/table', {title: 'kdjf', layout: 'admin/adminlayout' });
  }

});

module.exports = router;