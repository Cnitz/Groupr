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
var Group = require('../models/group');
var ChatMessage = require('../models/chatmsg');

var chat = new Object();

var passUser = function(token, cb){
    console.log("Finding user with token " + token);
    User.findOne({token : token}, function(err, user) {
        cb(err, user);
    });
};

chat.getMessages = function(req, res) {
    passUser(req.cookies.grouprToken, function(uerr, user) {
        if (uerr)
            res.status(500).json({message: "Error: invalid user"});
        else if (req.params.group != undefined && user.groups.indexOf(mongoose.Types.ObjectId(req.params.group)) > -1) {

            ChatMessage.find({
                group : mongoose.Types.ObjectId(req.params.group)
            }).exec(function(err, docs){
                if (err)
                    res.status(500).json({message : "Error: Failed database access"});
                else
                    res.status(200).json(docs);
            });

        }
        else
            res.status(500).json({message : "Error: User does not have permission to view this chat, not apart of group"});
    });
}

chat.sendMessage = function(req, res) {
    passUser(req.cookies.grouprToken, function(uerr, user) {
        if (uerr)
            res.status(500).json({message: "Error: invalid user"});
        else if (req.params.group != undefined && user.groups.indexOf(mongoose.Types.ObjectId(req.params.group)) > -1) {

            var newMessage = ChatMessage();

            newMessage.group = mongoose.Types.ObjectId(req.params.group);
            newMessage.message = req.body.message;
            newMessage.user = user.username;
            newMessage.dateCreated = new Date();

            newMessage.save(function(err) {
                if (err)
                    res.status(500).json({message : "Error: Failed database access"});
                else
                    res.status(200).json({message : "Sucess: chat message sent"});
            });

        }
        else
            res.status(500).json({message : "Error: User does not have permission to access this chat, not apart of group"});
    });
}

module.exports = chat;
