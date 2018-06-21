var express = require('express');
var router = express.Router();
var renderer = require('../views/renderer');
var business = require('../controller/business');

// Routing
router.get('/', function (req, res, next) {
  if (req.param('type') != 'order') {
    renderer.CheckoutPage.RenderCheckoutPageGET(req, res, next);
  } else {
    if (!req.session.userid) {
      res.send("chuadangnhap");
    } else {
      var name = req.param('name');
      var phone = req.param('phone');
      var address = req.param('address');
      var note = req.param('note');
      business.Order(req.session.userid, req.sessionID, note, name, address, phone, function (success) {
        res.send(success.toString());
      });
    }
  }
});

module.exports = router;