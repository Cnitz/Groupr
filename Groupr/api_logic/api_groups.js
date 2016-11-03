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
    User.findOne({token: req.cookies.grouprToken}).populate('groups').exec(function(err,user){
        if(err)
            res.status(500).json({
                error: err,
                message: 'Error: Invalid Access'
            });
        console.log("HERE: " + user.groups);
        res.status(200).json({data: user.groups, message: "Group fetch successful."});
    });
    }
}


group.get_all_groups = function(req, res) {
  Group.find({}, function(err, groups) {
    res.status(200).json({data: groups, message: "Group fetch successful."});
  });
}

group.create_group = function(req, res){
    var username = '';
if(req.cookies.grouprToken){
    var cursor = User.findOne({token: req.cookies.grouprToken},function(err, user){

    var newGroup = Group();
    newGroup.name = req.body.name;
    newGroup.description = req.body.description;
    newGroup.creator = user._id;
    newGroup.users.push(user._id);
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


group.join_group = function(req, res, group_id){
    if(req.cookies.grouprToken){
        User.findOne({token: req.cookies.grouprToken},function(err, user){
            if (err) {

                res.status(500).json({
                    error: err,
                    message: 'Error: Cannot find group'
                });
            }
            if(user.groups.indexOf(group_id) == -1){

            Group.findOne({_id: group_id}, function (err, group){
                if (err) {
                    res.status(500).json({
                        error: err,
                        message:  'Error: Joining group failed'
                    });
                }
                if(group.users.indexOf(user._id) == -1){
                group.users.push(user._id);

                group.save((err) => {
                    if (err) {
                        res.status(500).json({
                            error: err,
                            message:  'Error: Joining group failed'
                        });
                    }
                    else{

                        user.groups.push(group._id);
                        group.save((err) => {
                            if (err) {
                                res.status(500).json({
                                    error: err,
                                    message:  'Error: Joining group failed'
                                });
                            }
                            else {
                                res.status(200).json({
                                message:  'Successfully joined group'
                                });
                            }
                        });
                    }


                });
                }
                else{
                    res.status(500).json({
                    message: 'Error: User already in group'
                });
                }
            });
            }
            else{
                res.status(500).json({
                    message: 'Error: User already in group'
                });
            }

    });

}
}

group.leave_group = function(req, res, group_id){
    if(req.cookies.grouprToken){
    User.findOne({token: req.cookies.grouprToken}).exec(function(err,user){
        if(err)
            res.status(500).json({
                error: err,
                message: 'Error: Invalid Access'
            });

        if(user.groups.indexOf(group_id) != -1){
           user.groups.splice(user.groups.indexOf(group_id), 1);
           user.save((err) => {
               if(err){
                   res.status(500).json({
                       error: err,
                       message: 'Error: Removing user failed'
                   });
               }
               else{
                   Group.findOne({_id: group_id}).exec(function(err, group){
                       if(group.users.indexOf(user._id) != 1){
                           group.users.splice(group.users.indexOf(user._id), 1);
                           group.save((err) =>{
                               if(err){
                                    res.status(500).json({
                                        error: err,
                                        message: 'Error: Removing user failed'
                                    });
                                }
                                else{
                                    res.status(200).json({
                                        message: 'User succesfully removed'
                                    });
                                }
                           });
                       }
                   })
               }
           })
        }
        else{
            res.status(500).json({
                error: err,
                message: 'Error: User is not a member of the group'
            });
        }
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
