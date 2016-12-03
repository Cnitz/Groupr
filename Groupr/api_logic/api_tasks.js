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
        _id: (param.body.taskId == undefined) ? undefined : mongoose.Types.ObjectId(param.body.taskId),
        group: (param.body.group == undefined) ? undefined : mongoose.Types.ObjectId(param.body.group),
        title: (param.body.title == undefined) ? undefined : param.body.title,
        creator: (param.body.creator == undefined) ? undefined : param.body.creator,
        dateCreated: (param.body.dateCreated == undefined) ? undefined : param.body.dateCreated,
        dueDate: (param.body.dueDate == undefined) ? undefined : param.body.dueDate,
        category: (param.body.category == undefined) ? undefined : param.body.category,
        completed: (param.body.completed == undefined) ? undefined : param.body.completed,
        users: (incUser) ? param.user.username : undefined
    };
    return query;
};

var formTaskObject = function(param) {
    var obj = {
        group: (param.body.group == undefined) ? null : mongoose.Types.ObjectId(param.body.group),
        title: (param.body.title == undefined) ? "untitled" : param.body.title,
        creator: param.user.username,
        dateCreated: new Date(),
        dueDate: (param.body.dueDate == undefined) ? undefined : param.body.dueDate,
        category: (param.body.category == undefined) ? undefined : param.body.category,
        completed: false,
        users: []
    };
    return obj;
};

var passUser = function(token, cb){
    User.findOne({token : token}, function(err, user) {
        cb(err, user);
    });
};

tasks.tasksInGroup = function (req, res) {
    passUser(req.cookies.grouprToken, function (err, user) {
        if (err || user == null) {
            res.status(500).json({ message: 'Error: invalid user' });
        }
        else if (req.body.group != undefined && user.groups.indexOf(mongoose.Types.ObjectId(req.body.group)) > -1) {
            //var query = formTaskQuery({body: req.body, user: user}, false);
            //console.log(JSON.stringify(query));
            //query.group = mongoose.Types.ObjectId(req.body.group);
            Task.find({group : mongoose.Types.ObjectId(req.body.group)}).exec(function (error, docs) {
                if (error)
                    res.status(500).json({ message: 'Error: Database access' });
                else
                    res.status(200).json(docs);
            });
        }
        else {
            res.status(500).json({ message: 'Error: Access denied, user is not a part of this group' });
        }
    });
};

tasks.tasksByUser = function (req, res) {
    passUser(req.cookies.grouprToken, function (err, user) {
        if (err || user == null) {
            res.status(500).json({ message: 'Error: invalid user' });
        }
        else if (req.body.group == undefined || user.groups.indexOf(mongoose.Types.ObjectId(req.body.group)) > -1) {
            //var query = formTaskQuery({body: req.body, user: user}, true);
            Task.find({group : mongoose.Types.ObjectId(req.body.group), users: [user.username]}, function (error, docs) {
                console.log(JSON.stringify(docs));
                if (error)
                    res.status(500).json({ message: 'Error: Database access' });
                else
                    res.status(200).json(docs);
            });
        }
        else {
            res.status(500).json({ message: 'Error: Access denied, user is not a part of this group' });
        }
    });
};

tasks.addTask = function (req, res) {
    passUser(req.cookies.grouprToken, function (err, user) {
        if (err || user == null) {
            res.status(500).json({ message: 'Error: invalid user' });
        }
        else if (user.groups.indexOf(req.body.group) > -1) {
            var taskdoc = Task();
            taskdoc.group = (req.body.group == undefined) ? null : mongoose.Types.ObjectId(req.body.group);
            taskdoc.title = (req.body.title == undefined) ? "untitled" : req.body.title;
            taskdoc.description = (req.body.description == undefined) ? "untitled" : req.body.description;
            taskdoc.creator = user.username;
            taskdoc.dateCreated = new Date();
            taskdoc.dueDate = (req.body.dueDate == undefined) ? undefined : req.body.dueDate;
            taskdoc.category = (req.body.category == undefined) ? undefined : req.body.category;
            taskdoc.status = "Incomplete";
            taskdoc.users = [];
            taskdoc.save(function (err) {
                if (err) {
                    res.status(500).json({ message: 'Error: unable to save document into database' });
                }
                else {
                    res.status(200).json({ message: 'Created task' });
                }
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
    passUser(req.cookies.grouprToken, function(err, user) {
        if (err || user == null) {
            res.status(500).json({ message: 'Error: invalid user' });
        }
        else {
            Task.findOne({_id: mongoose.Types.ObjectId(req.body.taskId), creator: user.username}).remove(function (err) {
                if (err) {
                    res.status(500).json({ message: 'Error: Task not found or user does not own task' });
                }
                else {
                    res.status(200).json({ message: 'Successfully removed entry' });
                }
            });
        }
    });
};

tasks.updateStatus = function (req, res) {
    passUser(req.cookies.grouprToken, function(err, user) {
        if (err || user == null) {
            res.status(500).json({ message: 'Error: invalid user' });
        }
        else if (req.body.group == undefined || user.groups.indexOf(mongoose.Types.ObjectId(req.body.group)) > -1) {
            Task.findOne({_id: mongoose.Types.ObjectId(req.body.taskId)}, function (err, task) {
                if (err) {
                    res.status(500).json({ message: 'Error: Task not found' });
                }
                else {
                  console.log("HERE: ");
                  console.log(req.body);
                    task.status = req.body.status;
                    task.save(function (err, updatedTask){
                        if (err)
                            res.status(500).json({ message: 'Error: could not update task' });
                        else
                            res.status(200).json({ message: 'Successfully updated task' });
                    });
                }
            });
        }
        else {
            res.status(500).json({ message: 'Error: Access denied, user is not a part of this group' });
        }
    });
};

tasks.updateInfo = function (req, res) {
    passUser(req.cookies.grouprToken, function(err, user) {
        if (err || user == null) {
            res.status(500).json({ message: 'Error: invalid user' });
        }
        else if (req.body.group == undefined || user.groups.indexOf(mongoose.Types.ObjectId(req.body.group)) > -1) {
            Task.findOne({_id: mongoose.Types.ObjectId(req.body.taskId)}, function (err, task) {
                if (err) {
                    res.status(500).json({ message: 'Error: Task not found' });
                }
                else {
                    task.title = (req.body.title != undefined) ? req.body.title : task.title;
                    task.description = (req.body.description != undefined) ? req.body.description : task.description;
                    task.save(function (err, updatedTask){
                        if (err)
                            res.status(500).json({ message: 'Error: could not update task' });
                        else
                            res.status(200).json({ message: 'Successfully updated task' });
                    });
                }
            });
        }
        else {
            res.status(500).json({ message: 'Error: Access denied, user is not a part of this group' });
        }
    });
};

tasks.addUser = function (req, res) {
    passUser(req.cookies.grouprToken, function(err, user) {
        if (err || user == null) {
            res.status(500).json({ message: 'Error: invalid user' });
        }
        else if (req.body.group == undefined || user.groups.indexOf(mongoose.Types.ObjectId(req.body.group)) > -1) {
            Task.findOne({_id: mongoose.Types.ObjectId(req.body.taskId)}, function (err, task) {
                if (err) {
                    res.status(500).json({ message: 'Error: DB Access' });
                }
                else if (task == undefined) {
                    res.status(500).json({ message: 'Error: Task not found' });
                }
                else {
                    if (req.body.user != undefined && task.indexOf(req.body.user) < 0)
                        task.users.push(req.body.user);

                    task.save(function (err, updatedTask){
                        if (err) res.status(500).json({ message: 'Error: could not update task' });
                        else res.status(200).json({ message: 'Successfully updated task' });
                    });
                }
            });
        }
        else {
            res.status(500).json({ message: 'Error: Access denied, user is not a part of this group' });
        }
    });
};

module.exports = tasks;
