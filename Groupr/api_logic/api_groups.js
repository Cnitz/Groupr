// Libraries
var jwt = require('jsonwebtoken');

// Models
var User = require('../models/user');
var Group = require('../models/group');

var group = new Object();


group.get_group_by_id = function (req, res, id){
Group.findOne({_id: id}, function(err, groups) {
    res.send(groups);
  });
}


group.get_user_groups = function(req, res) {
var groups = [];
if(req.cookies.grouprToken){
    User.findOne({token: req.cookies.grouprToken}).populate('groups', 'name description').exec(function(err,user){
        if(err)
            res.status(500).json({
                error: err,
                message: 'Error: Invalid Access'
            });     
        res.status(200).json(user.groups);
    });
    }
}


group.get_all_groups = function(req, res) {
  Group.find({}, function(err, groups) {
    var groupApiModelList = [];
    groups.forEach(function(group) {
      groupApiModelList.push(groupApiModel(group));
    });
    res.send(groupApiModelList);
  });
}

group.create_group = function(req, res){
    var username = '';
if(req.cookies.grouprToken){
    var cursor = User.findOne({token: req.cookies.grouprToken},function(err, user){

    var newGroup = Group();
    newGroup.name = req.body.name;
    newGroup.description = req.body.description;
    newGroup.creator = user.username;
    newGroup.users = [user.username];
    newGroup.isPublic = req.body.isPublic;

    newGroup.save((err) => {
        if (err) {

            res.status(500).json({
                error: err,
                message: 'Error: Group creation failed'
            });
        }
        else {
            
            user.groups.push(newGroup._id);
            user.save((err) => {
                if(err){

            res.status(500).json({
                error: err,
                message: 'Error: Group creation failed'
            });
                }
                else { 
                    res.status(200).json({
                    message: 'Successful group creation'
            });
                }
            })

        }
    });
    });
   
}
}

function groupApiModel(group){
    return {
        'name' : group.name,
        'description' : group.description
    };
}

module.exports = group;