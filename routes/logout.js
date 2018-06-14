var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  req.session.destroy(function(err) {
    console.log('Logout successfully');
  })

  res.redirect('/admin.html');
});

module.exports = router;
