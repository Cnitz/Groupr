/*
 * Serve JSON to our AngularJS client
 */
var express = require('express');
var router = express.Router();

// Models
var User = require('../models/user');
var Meeting = require('../models/meeting');
var Group = require('../models/group');

/*
 * Group Data API
 */
var formGroupQuery = function(param) {
    var query = {
        _id: (param.id == null) ? undefined : param.id,
        name: (param.name == null) ? undefined : param.name,
        creator: (param.creator == null) ? undefined : param.creator,
        users: param.user.name
    };
    return query;
};
var formMeetingQuery = function(param) {
    var query = {
        _id: (param.id == null) ? undefined : param.id,
        group: (param.group == null) ? undefined : param.group,
        name: (param.name == null) ? undefined : param.name,
        creator: (param.creator == null) ? undefined : param.creator,
        date: (param.date == null) ? undefined : param.date,
        location: (param.location == null) ? undefined : param.location,
    };
    return query;
};

// Route Protector
router.use((req, res, next) => {
    var token = req.body.token;
    console.log("hello");
    if (!token) {
        token = req.query.state;
    }
    if (token) {
        jwt.verify(token, conf.TOKEN_SECRET, function(err, decoded) {
            if (err) {
                res.status(450).json({
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
        res.status(450).json({
            message: 'Error: Invalid token'
        });
    }
});







module.exports = router;
