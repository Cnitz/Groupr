/*
 * Serve JSON to our AngularJS client
 */
 var express = require('express');
 var jwt = require('jsonwebtoken');
 var passport = require('passport');
 var router = express.Router();

 // Config
 var conf = require('../config.js');
// Models
var User = require('../models/user');
var Meeting = require('../models/meeting');
var Group = require('../models/group');
var Group = require('../models/task');
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
var formTaskQuery = function(param, incUser) {
    var query = {
        _id: (param.id == null) ? undefined : param.id,
        group: (param.group == null) ? undefined : param.group,
        title: (param.title == null) ? undefined : param.title,
        creator: (param.creator == null) ? undefined : param.creator,
        dateCreated: (param.dateCreated == null) ? undefined : param.dateCreated,
        dueDate: (param.dueDate == null) ? undefined : param.dueDate,
        category: (param.category == null) ? undefined : param.category,
        completed: (param.completed == null) ? undefined : param.completed,
        users: (incUser) ? param.user.name : undefined
    };
    return query;
};

var formTaskObject = function(param) {
    var obj = {
        group: (param.group == null) ? null : param.group,
        title: (param.title == null) ? "untitled" : param.title,
        creator: (param.creator == null) ? "undefined" : param.creator,
        dateCreated: new Date(),
        dueDate: (param.dueDate == null) ? undefined : param.dueDate,
        category: (param.category == null) ? undefined : param.category,
        completed: false,
        users: {},
    };
    return obj;
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

router.post('/api/groups/all', function (req, res, next) {
    var query = formGroupQuery(req.body);
    Group.findOne(query, function (err, group) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ group: group });
    });
});
router.post('/api/groups/calendar', function (req, res, next) {
    var query = formGroupQuery(req.body);
    Group.findOne(query, 'calendar', function (err, group) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ calendar: group });
    });
});
router.post('/api/groups/id', function (req, res, next) {
    var query = formGroupQuery(req.body);
    Group.findOne(query, '_id', function (err, group) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ calendar: group });
    });
});
router.post('/api/groups/meeting', function (req, res, next) {
    var query = formMeetingQuery(req.body);
    Meeting.findOne(query, function (err, meeting) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ meeting: meeting });
    });
});

/*
    TASKS API
*/
router.post('api/tasks/list', function (req, res, next) {
    var query = formTaskQuery(req.body, false);
    Task.findOne(query, function (err, task) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ task: task });
    });
});

router.post('api/tasks/user', function (req, res, next) {
    var query = formTaskQuery(req.body, true);
    Task.findOne(query, function (err, task) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ task: task });
    });
});

router.post('api/tasks/add', function (req, res, next) {
    var form = formTaskObject(req.body);
    Task.insertMany(form, function (error, docs){
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
    });
});

module.exports = router;
