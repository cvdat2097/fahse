var express = require('express');
var async = require('async');
var router = express.Router();
var lib = require('./lib');
var User = require('../models/userModel.js');
var renderer = require('../views/renderer');
var passport = require('passport');


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

module.exports = router;