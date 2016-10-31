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
var Task = require('../models/task');

var tasks = new Object();

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

tasks.tasksInGroup = function (req, res) {
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

tasks.tasksByUser = function (req, res) {
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

tasks.addTask = function (req, res) {
    passUser(req.cookies.grouprToken, function (err, user) {
        var form = formTaskObject({body: req.body, user: user});
        Task.insertMany(form, function (error, docs) {
            if (err)
                res.status(500).json({ message: 'Error: Database access' });
        });
    });
});

module.exports = tasks;
