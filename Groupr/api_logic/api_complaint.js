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

var complaint = new Object();

complaint.createComplaint = function(req, res) {
     
    console.log(res.body);

    User.findOne({token: req.cookies.grouprToken}).exec(function(err, user){
        if(err){
            res.status(500).json({
                    error: err,
                    message: 'Error: User cannot create comlpaints'
                });
        }
        else if(user.groups.indexOf(req.body.group) == -1){
            res.status(500).json({
                    error: err,
                    message: 'Error: User not in group'
                });
        }

    else {

    var newComplaint = new Complaint();
        newComplaint.group = req.body.group;
        newComplaint.title = req.body.title;
        newComplaint.message = req.body.message;
        newComplaint.dateCreated = new Date();
        newComplaint.urgency = req.body.urgency;

       

        newComplaint.save((err, complaint) => {
            if (err) {
                res.status(500).json({
                    error: err,
                    message: 'Error: Complaint creation failed'
                });
            }
            else {
                 Group.findOne({_id: req.body.group}).exec(function(err,group){
                    group.complaints.push(complaint._id);
                    group.save((err, group) => {
                        if (err) {
                            res.status(500).json({
                                error: err,
                                message: 'Error: Complaint creation failed'
                            });
                        }
                        else {
                            res.status(200).json({
                                message: 'Complaint submitted!',
                                complaintID: newComplaint._id,
                            })
                        }
                    });

                 });
            }


        });

    }

        });
}


complaint.getGroupComplaints = function (req, res, groupid) {
    console.log(groupid);
        Group.findOne({_id: groupid}).populate('complaints').exec(function(err, group){
         if (err) {
                            res.status(500).json({
                                error: err,
                                message: 'Error: Complaints not found'
                            });
                        }
                        else {
                            res.status(200).json({
                                message: 'Complaints Retreived Succesfullly!',
                                complaints: group.complaints
                            })
                        }
    
        });


}

module.exports = complaint;
