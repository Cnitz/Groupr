/*
 * Serve JSON to our AngularJS client
 */
 var express = require('express');
 var jwt = require('jsonwebtoken');
 var passport = require('passport');
 var nodemailer = require('nodemailer');
 var router = express.Router();

 // Config
 var conf = require('../config.js');
// Models
var User = require('../models/user');
var Meeting = require('../models/meeting');
var Group = require('../models/group');
var Task = require('../models/task');



/*
 * Group Data API
 */
var formGroupQuery = function(param) {
    var query = {
        _id: (param.body.id == null) ? undefined : param.body.id,
        name: (param.user == null) ? undefined : param.body.name,
        creator: (param.body.creator == null) ? undefined : param.body.creator,
        users: param.user.name
    };
    return query;
};
var formMeetingQuery = function(param) {
    var query = {
        _id: (param.body.id == null) ? undefined : param.id,
        group: (param.body.group == null) ? undefined : param.group,
        name: (param.body.name == null) ? undefined : param.body.name,
        creator: (param.body.creator == null) ? undefined : param.body.creator,
        date: (param.body.date == null) ? undefined : param.body.date,
        location: (param.body.location == null) ? undefined : param.body.location,
    };
    return query;
};
var formTaskQuery = function(param, incUser) {
    var query = {
        _id: (param.body.id == null) ? undefined : param.body.id,
        group: (param.body.group == null) ? undefined : param.body.group,
        title: (param.body.title == null) ? undefined : param.body.title,
        creator: (param.body.creator == null) ? undefined : param.body.creator,
        dateCreated: (param.body.dateCreated == null) ? undefined : param.body.dateCreated,
        dueDate: (param.body.dueDate == null) ? undefined : param.body.dueDate,
        category: (param.body.category == null) ? undefined : param.body.category,
        completed: (param.body.completed == null) ? undefined : param.body.completed,
        users: (incUser) ? param.user.name : undefined
    };
    return query;
};

var formTaskObject = function(param) {
    var obj = {
        group: (param.body.group == null) ? null : param.body.group,
        title: (param.body.title == null) ? "untitled" : param.body.title,
        creator: param.user.name,
        dateCreated: new Date(),
        dueDate: (param.body.dueDate == null) ? undefined : param.body.dueDate,
        category: (param.body.category == null) ? undefined : param.body.category,
        completed: false,
        users: {}
    };
    return obj;
};

var passUser = function(token, cb){
    User.findOne({token : token}, function(err, user){
        cb(err, user);
    });
}

router.post('/api/groups/all', function (req, res, next) {
    passUser(req.cookies.grouprToken, function (err, user) {
        var query = formGroupQuery({body: req.body, user: user});
        Group.find(query, function (err, group) {
            if (err)
                res.status(500).json({ message: 'Error: Database access' });
            else
                res.status(200).json({ group: group });
        });

    });
});
router.post('/api/groups/calendar', function (req, res, next) {
    passUser(req.cookies.grouprToken, function (err, user) {
        var query = formGroupQuery({body: req.body, user: user});
        Group.find(query, 'calendar', function (err, group) {
            if (err)
                res.status(500).json({ message: 'Error: Database access' });
            else
                res.status(200).json({ calendar: group });
        });
    });
});
router.post('/api/groups/id', function (req, res, next) {
    passUser(req.cookies.grouprToken, function (err, user) {
        var query = formGroupQuery({body: req.body, user: user});
        Group.findOne(query, '_id', function (err, group) {
            if (err)
                res.status(500).json({ message: 'Error: Database access' });
            else
                res.status(200).json({ calendar: group });
        });
    });
});
router.post('/api/groups/meeting', function (req, res, next) {
    passUser(req.cookies.grouprToken, function (err, user) {
        var query = formMeetingQuery({body: req.body, user: user});
        Meeting.find(query, function (err, meeting) {
            if (err)
                res.status(500).json({ message: 'Error: Database access' });
            else
                res.status(200).json({ meeting: meeting });
        });
    });
});

/*
    TASKS API
*/
router.post('api/tasks/all', function (req, res, next) {
    passUser(req.cookies.grouprToken, function (err, user) {
        var query = formTaskQuery({body: req.body, user: user}, false);
        Task.find(query, function (err, task) {
            if (err)
                res.status(500).json({ message: 'Error: Database access' });
            else
                res.status(200).json({ task: task });
        });
    });
});
router.post('/api/groups/create', function (req, res, next) {
    var query = formMeetingQuery(req.body);
    Meeting.findOne(query, function (err, meeting) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ meeting: meeting });
    });
});

router.post('api/tasks/me', function (req, res, next) {
    passUser(req.cookies.grouprToken, function (err, user) {
        var query = formTaskQuery({body: req.body, user: user}, true);
        Task.find(query, function (err, task) {
            if (err)
                res.status(500).json({ message: 'Error: Database access' });
            else
                res.status(200).json({ task: task });
        });
    });
});

router.post('api/tasks/add', function (req, res, next) {
    passUser(req.cookies.grouprToken, function (err, user) {
        var form = formTaskObject({body: req.body, user: user});
        Task.insertMany(form, function (error, docs) {
            if (err)
                res.status(500).json({ message: 'Error: Database access' });
        });
    });
});

// Email Notifications API

router.post('api/email/Notifications', function (req, res, next)){

    var transporter = nodemailer.createTransport(connection);
    var mailOptions = {
      from: '"No Reply Groupr" <noreplygroupr@gmail.com>', // sender address
      to: "fische17@purdue.edu", // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world ?', // plaintext body
      html: '<b>Hello world ?</b>' // html body

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
  }
}



module.exports = router;
