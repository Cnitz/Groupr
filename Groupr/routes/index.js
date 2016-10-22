var express = require('express');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var router = express.Router();

// Config
var conf = require('../config.js');

// API logic
var api_account = require('../api_logic/api_account');

// Models
var User = require('../models/user');
var Group = require('../models/group');



router.route('/routes').get((req, res) => {
    res.json(router.stack);
});

router.route('/login').post((req, res) => {
    api_account.login(req.body.username, req.body.password, conf.TOKEN_SECRET, res);
});

router.route('/signup').post((req, res) => {
    var account_info = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    api_account.signup(account_info, res);
});

router.route('/verify_token').get((req, res) => {
    var token = req.cookies.grouprToken;
    console.log(token);
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


router.route('/groups/create').post((req, res) => {
var username = '';
if(req.cookies.grouprToken){
    var cursor = User.find({token: req.cookies.grouprToken},function(err, user){
       
    });
   
}
});


function createGroup(username, req, res){
    console.log(username);
    var newGroup = Group();
    newGroup.name = req.body.name;
    newGroup.description = req.body.description;
    newGroup.creator = username;
    newGroup.users = [username];
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
}


//Get all groups

router.route('/groups/all').get((req, res) => {
  Group.find({}, function(err, groups) {
    var groupApiModelList = [];
    groups.forEach(function(group) {
      groupApiModelList.push(groupApiModel(group));
    });
    res.send(groupApiModelList);
  });
});

//Get groups that the user is a part of
router.route('/groups').get((req, res) => {

var groups = [];

if(req.cookies.grouprToken){
    User.find({token: req.cookies.grouprToken},function(err, user) {
        if(user.groups){
            user.groups.forEach(function (userGroup){
                Group.find({_id: userGroup._id}, function (err, group){
                    groups.push(groupApiModel(group));
                });
            });
        }
    });
    res.send(groups);
    }
});


function groupApiModel(group){
    return {
        'name' : group.name,
        'description' : group.description
    };
}

// function getUser(token){
// var currentUser = {};
//      return User.findOne({token: token},function(err, user) {     
// }).then(function(){
//      return userApiModel(user);
// });


// }

// function userApiModel(user){
//     return{
//     username: user.username,
//     email: user.email,
//     name: user.name 
//     }; 
// }


module.exports = router;
