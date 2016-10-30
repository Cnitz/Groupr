var express = require('express');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var router = express.Router();

// Config
var conf = require('../config.js');

// API logic
var api_account = require('../api_logic/api_account');
var api_groups = require('../api_logic/api_groups');

// Models
var User = require('../models/user');
var Group = require('../models/group');



router.route('/routes').get((req, res) => {
    res.json(router.stack);
});

router.route('/login').post((req, res) => {
    api_account.login(req.body.username, req.body.password, conf.TOKEN_SECRET, res);
});

router.route('/signup').post((req, res) => {
    var account_info = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    api_account.signup(account_info, res);
});

router.route('/verify_token').get((req, res) => {
    var token = req.cookies.grouprToken;
    console.log(token);
    if (token) {
        jwt.verify(token, conf.TOKEN_SECRET, function(err, decoded) {
            if (err) {
                res.status(403).json({
                    message: 'Error: Invalid token'
                });
            }
            else {
                res.status(200).json({
                    message: 'Success'
                });
            }
        });
    }
    else {
        res.status(403).json({
            message: 'Error: Invalid token'
        });
    }
});

// Route Protector
router.use((req, res, next) => {
    var token = req.cookies.grouprToken;
    if (token) {
        jwt.verify(token, conf.TOKEN_SECRET, function(err, decoded) {
            if (err) {
                res.status(403).json({
                    message: 'Error: Invalid token'
                });
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        res.status(403).json({
            message: 'Error: Invalid token'
        });
    }
});

/*
 * Group Api routes
 *
 *
 *
 *
 *
 */

//Create a brand new group

router.route('/groups/create').post((req, res) => {
api_groups.create_group(req, res);
});

//Get all groups
router.route('/groups/all').get((req, res) => {
api_groups.get_all_groups(req, res);
});

//Get groups that the user is a part of
router.route('/groups').get((req, res) => {
    api_groups.get_user_groups(req, res);
});



module.exports = router;
