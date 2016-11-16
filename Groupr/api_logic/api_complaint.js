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
var Complaint = require('../models/complaint');

var comlaint = new Object();

var passUser = function(token, cb){
    console.log("Finding user with token " + token);
    User.findOne({token : token}, function(err, user) {
        cb(err, user);
    });
};

complaint.createComplaint = function(req, res) {
    var complaint = new Complaint();
        complaint.group = req.body.group;
        complaint.title = req.body.title;
        complaint.message = req.body.message;
        complaint.dateCreated = Date();
        complaint.urgency = req.body.urgency;

        comlaint.save((err, complaint) => {
            if (err) {
                res.status(500).json({
                    error: err,
                    message: 'Error: Complaint creation failed'
                });
            }
            else {
                res.status(200).json({
                    message: 'Complaint created'
                });
            }


        });
}


module.exports = complaint;
