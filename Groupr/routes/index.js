var express = require('express');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var router = express.Router();

// Config
var conf = require('../config.js');

// API logic
var api_account = require('../api_logic/api_account');
var api_calendar = require('../api_logic/api_calendar');

// Models
var User = require('../models/user');
var Group = require('../models/group');

router.route('/routes').get((req, res) => {
    res.json(router.stack);
});


/* Open Account APIs */
router.route('account/login').post((req, res) => {
    api_account.login(req.body.username, req.body.password, conf.TOKEN_SECRET, res);
});

router.route('account/signup').post((req, res) => {
    var account_info = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    api_account.signup(account_info, res);
});

router.route('account/verify_token').get((req, res) => {
    var token = req.cookies.grouprToken;
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
/* End Open Account APIs */

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

/* Account APIs */
router.route('account/get_user').get((req, res) => {
    var token = req.cookies.grouprToken;
    api_account.get_user(token, res);
});

/* End Account APIs */

/* Group APIs */
router.route('/create_group').post((req, res) => {
    console.log(req.body);
    var newGroup = Group();
    newGroup.name = req.body.name;
    newGroup.description = req.body.description;
    newGroup.creator = req.body.username;
    newGroup.users = [req.body.username];
    newGroup.isPublic = req.body.isPublic;
    newGroup.save((err) => {
        if (err) {

            res.status(500).json({
                error: err,
                message: 'Error: Group creation failed'
            });
        }
        else {
            console.log('Successful');
            res.status(200).json({
                message: 'Successful group creation'
            });
        }
    });
});


router.route('/get_groups').post((req, res) => {
  Group.find({}, function(err, groups) {
    var groupApiModelList = [];
    groups.forEach(function(group) {
      groupApiModelList.push(groupApiModel(group));
    });
    res.send(groupApiModelList);
  });
});

function groupApiModel(group){
    return {
        'name' : group.name,
        'description' : group.description
    };
}
/* End Group APIs */

/* Calendar APIs */
router.route('/calendar/add_event').post((req, res) => {
    var eventConfig = req.body.config;
    var eventData = req.body.event;
    api_calendar.add_event(eventConfig, eventData, res);
});

router.route('/calendar/delete_event').post((req, res) => {
    var eventConfig = req.body.config;
    var eventData = req.body.event;
    api_calendar.delete_event(eventConfig, eventData, res);
});

router.route('/calendar/edit_event').post((req, res) => {
    var eventConfig = req.body.config;
    var eventData = req.body.event;
    api_calendar.edit_event(eventConfig, eventData, res);
});

router.route('/calendar/get_events').post((req, res) => {
    var calendarId = req.body.calendarId;
    api_calendar.get_events(calendarId, res);
});
/* End Calendar APIs */

module.exports = router;
