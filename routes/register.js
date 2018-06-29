var express = require('express');
var emailCheck = require('email-check');
var router = express.Router();
var renderer = require('../views/renderer');
var business = require('../controller/business');
var isPhoneNumber = require('is-phone-number');
var User = require('../models/userModel.js');
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
router.get('/', function (req, res, next) {
  renderer.RegisterPage.RenderRegisterPage(req, res, next);
});
router.get('/registerUser', function (req, res, next) {
  var name = req.param('name');
  var username = req.param('username');
  var phone = req.param('phone');
  var address = req.param('address');
  var email = req.param('email');
  var password = req.param('password');
  var type = req.param('type');

  //check mail
  if (validateEmail(email)) {
    } else {
      res.send('notMail');
      return;
    }
  if (isPhoneNumber(phone)) {
  } else {
    res.send('notPhone');
    return;
  }
  User.findOne({username: username},function (err, userFound) {
	if (userFound == null) {
    business.RegisterNewUser(type, username, password, name, email, phone, address,function (success) {
    res.send(success.toString());
    return;
  });
	} else {
		res.send('existed');
    return;
	}
  })
});
module.exports = router;
