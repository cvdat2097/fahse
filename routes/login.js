var express = require('express');
var async = require('async');
var router = express.Router();
var lib = require('./lib');
var Admin = require('../models/adminModel.js');

router.post('/', function (req, res, next) {
    console.log(req);
    var username = req.body['user'];
    var pass = req.body['pass'];
    Admin.find({}, function (err, adminList) {
        if (adminList.length > 0) {
            var i;
            for (i = 0; i < adminList.length; i++) {
                if (adminList[i].username == username && adminList[i].password == pass) {
                    lib.SetCookie(res, 'admin', username);
                    res.redirect('/admin.html');
                }
            }
        }

        // Login failed
        res.render('', { notification: 'Login failed', layout: 'admin/login' });

    });
});

router.get('/', function (req, res, next) {
    // ROUTING
    res.render('', { layout: 'admin/login' });
});

module.exports = router;