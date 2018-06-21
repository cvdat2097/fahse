var express = require('express');
var router = express.Router();
var renderer = require('../views/renderer');

router.get('/', function (req, res, next) {
  // req.session.destroy(function(err) {
  //   console.log('Logout successfully');
  // })

  req.logOut();

  res.redirect('/login.html');
});

module.exports = router;
