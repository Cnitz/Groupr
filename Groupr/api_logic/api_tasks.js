/*
* Serve JSON to our AngularJS client
*/
var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var mongoose = require('mongoose');
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
        _id: (param.body.id == null) ? undefined : mongoose.Types.ObjectId(param.body.taskId),
        group: (param.body.group == null) ? undefined : mongoose.Types.ObjectId(param.body.group),
        title: (param.body.title == null) ? undefined : param.body.title,
        creator: (param.body.creator == null) ? undefined : param.body.creator,
        dateCreated: (param.body.dateCreated == null) ? undefined : param.body.dateCreated,
        dueDate: (param.body.dueDate == null) ? undefined : param.body.dueDate,
        category: (param.body.category == null) ? undefined : param.body.category,
        completed: (param.body.completed == null) ? undefined : param.body.completed,
        users: (incUser) ? [param.user.username] : undefined
    };
    return query;
};

var formTaskObject = function(param) {
    var obj = {
        group: (param.body.group == null) ? null : mongoose.Types.ObjectId(param.body.group),
        title: (param.body.title == null) ? "untitled" : param.body.title,
        creator: param.user.username,
        dateCreated: new Date(),
        dueDate: (param.body.dueDate == null) ? undefined : param.body.dueDate,
        category: (param.body.category == null) ? undefined : param.body.category,
        completed: false,
        users: []
    };
    return obj;
};

var passUser = function(token, groupId, cb){
    User.findOne({token : token}, function(err, user) {
        cb(err, user);
    });
};

tasks.tasksInGroup = function (req, res) {
    passUser(req.cookies.grouprToken, req.body.group, function (err, user) {
        if (err) {
            res.status(500).json({ message: 'Error: invalid user' });
        }
        else if (user.groups.indexOf(mongoose.Types.ObjectId(groupId)) > -1) {
            var query = formTaskQuery({body: req.body, user: user}, false);
            Task.find(query, function (error, task) {
                if (error)
                    res.status(500).json({ message: 'Error: Database access' });
                else
                    res.status(200).json(task);
            });
        }
        else {
            res.status(500).json({ message: 'Error: Access denied, user is not a part of this group' });
        }
    });
};

tasks.tasksByUser = function (req, res) {
    passUser(req.cookies.grouprToken, req.body.group, function (err, user) {
        if (err) {
            res.status(500).json({ message: 'Error: invalid user' });
        }
        else if (user.groups.indexOf(mongoose.Types.ObjectId(groupId)) > -1) {
            var query = formTaskQuery({body: req.body, user: user}, true);
            Task.find(query, function (error, task) {
                if (error)
                    res.status(500).json({ message: 'Error: Database access' });
                else
                    res.status(200).json(task);
            });
        }
        else {
            res.status(500).json({ message: 'Error: Access denied, user is not a part of this group' });
        }
    });
};

tasks.addTask = function (req, res) {
    passUser(req.cookies.grouprToken, req.body.group, function (err, user) {
        if (err) {
            res.status(500).json({ message: 'Error: invalid user' });
        }
        else if (user.groups.indexOf(mongoose.Types.ObjectId(groupId)) > -1) {
            var form = formTaskObject({body: req.body, user: user});
            Task.insertMany(form, function (error, docs) {
                if (error)
                    res.status(500).json({ message: 'Error: Database access' });
            });
        }
        else {
            res.status(500).json({ message: 'Error: Access denied, user is not a part of this group' });
        }
    });
};

tasks.getById = function (req, res) {
    Task.findOne({_id: req.body.taskId}, function (err, task){
        res.status(200).json(task);
    });
};

tasks.removeTask = function (req, res) {
    passUser(req.cookies.grouprToken, req.body.group, function(err, user) {
        if (err) {
            res.status(500).json({ message: 'Error: invalid user' });
        }
        else if (user.groups.indexOf(mongoose.Types.ObjectId(groupId)) > -1) {
            Task.remove({_id: mongoose.Types.ObjectId(req.body.taskId), creator: user.username}, function (err) {
                if (err) {
                    res.status(500).json({ message: 'Error: Task not found or user does not own task' });
                }
            });
        }
        else {
            res.status(500).json({ message: 'Error: Access denied, user is not a part of this group' });
        }
    });
};

module.exports = tasks;
