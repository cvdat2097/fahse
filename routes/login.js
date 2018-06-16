var express = require('express');
var async = require('async');
var router = express.Router();
var lib = require('./lib');
var Admin = require('../models/adminModel.js');
var User = require('../models/userModel.js');

router.post('/', function (req, res, next) {
    var username = req.body['user'];
    var pass = req.body['pass'];

    var loggedIn = false;

    User.find({}, function (err, adminList) {
        if (adminList.length > 0) {
            var i;
            for (i = 0; i < adminList.length; i++) {
                if (adminList[i].username == username && adminList[i].password == pass) {
                    req.session.userid = username;
                    res.redirect('/admin.html');
                    loggedIn = true;
                    break;
                }
            }
        }

        // Login failed
        if (loggedIn == false) {
            res.render('', { notification: 'Username or Password is incorrect', layout: 'admin/login' });
        }

    });
});

router.get('/', function (req, res, next) {
    if (req.session.userid) {
        res.redirect('/admin.html');
    } else {
        res.render('', { layout: 'admin/login' });
    }
});

module.exports = router;