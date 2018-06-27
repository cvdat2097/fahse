var express = require('express');
var async = require('async');
var router = express.Router();
var lib = require('./lib');
var User = require('../models/userModel.js');
var renderer = require('../views/renderer');
var passport = require('passport');
var business = require('../controller/business');


router.get('/', function (req, res, next) {
    renderer.LoginPage.RenderLoginPageGET(req, res, next);
});

router.post('/', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (user) {
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
            });

            if (user.type == "customer") {
                res.redirect('/');
            } else if (user.type == "admin") {
                res.redirect('/admin');
            }
        } else {
            res.redirect('/login.html')
        }
    })(req, res, next);
});

router.get('/activate-email', function (req, res, next) { 
    var key = req.param('key');
    var username = req.param('username');

    if (key != undefined) {
        business.GetUser(username, function (user) {
            if (user == null) {
                // failed
                console.log(err);
                res.send('Không tìm thấy user');
            } else {
                if (user.emailActivationCode.toString() === key.toString()) {
                    res.send('Kích hoạt thành công!');
                    User.updateOne({ username: username }, { emailIsActivated: true }, function (err) {
                        if (err) console.log(err);
                    })
                } else {
                    res.send('Mã kích hoạt không đúng hoặc đã hết hạn');
                }
            }
        })
    }
});

router.get('/forgot-password', function (req, res, next) { 
    var username = req.param('username');

    if (username != undefined && username != "") {
        business.ForgotPassword(username);
        res.send('Mật khẩu mới đã được gửi qua email của tài khoản');
    } else {
        res.send('Lỗi: Không tìm thấy user');
    }
});
module.exports = router;