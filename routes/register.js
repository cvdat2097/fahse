var express = require('express');
var emailCheck = require('email-check');
var router = express.Router();
var renderer = require('../views/renderer');
var business = require('../controller/business');
var isPhoneNumber = require('is-phone-number');
var User = require('../models/userModel.js');

router.get('/', function (req, res, next) {
  renderer.RegisterPage.RenderRegisterPage(req, res, next);
});
router.get('/checkemail', function (req, res, next) {
  emailCheck(req.param('email'))
  .then(function (resMail) {
    res.send(resMail);
  })
  .catch(function (err) {
    if (err.message === 'refuse') {
      console.log('The MX server is refusing requests from your IP address.');
    } else {
      console.log('Undefinded error');
    }
  });
});
router.get('/checkphonenumber', function (req, res, next) {
  console.log("Da chay ham check phone");
  console.log(isPhoneNumber(req.param('phone')));
  res.send(isPhoneNumber(req.param('phone')));

});
router.get('/registerUser', function (req, res, next) {

  var name = req.param('name');
  var username = req.param('username');
  var phone = req.param('phone');
  var address = req.param('address');
  var email = req.param('email');
  var password = req.param('password');
  var type = req.param('type');
  User.findOne(username,function (err, userFound) {
	if (userFound == null) {
	} else {
		res.send('existed');
	}
  })
  business.RegisterNewUser(type, username, password, name, email, phone, address,function (success) {
    res.send(success.toString());
  });
});
module.exports = router;
