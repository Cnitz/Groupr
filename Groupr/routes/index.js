var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var router = express.Router();

// Config
var conf = require('../config.js');

// Models
var User = require('../models/user');
var Group = require('../models/group');

router.use((req, res, next) => {
    // Default route
    next();
});

router.route('/').get((req, res) => {
    console.log('Got here');
});

router.route('/routes').get((req, res) => {
    res.json(router.stack);
});

router.route('/login').post((req, res) => {
    User.findOne({ 'username': req.body.username}, (err, user) => {
        if (err) {
            res.status(500).json({
                message: 'Error: Database access'
            });
        }
        else if (user === null) {
            res.status(401).json({
                message: 'Error: Invalid login'
            });
        }
        else if (user.password != req.body.password) {
            res.status(401).json({
                message: 'Error: Invalid login'
            });
        }
        else {
            var token = jwt.sign({ email: user.email }, conf.TOKEN_SECRET, {
                expiresIn: '1h'
            });
            res.status(200).json({
                user: user,
                token: token,
                message: 'Successful login'
            });
        }
    })
});

router.route('/signup').post((req, res) => {
    console.log(req.body.name);
    var newAccount = User();
    newAccount.name = req.body.name;
    newAccount.username = req.body.username;
    newAccount.email = req.body.email;
    newAccount.password = req.body.password;
    newAccount.save((err) => {
        if (err) {
            res.status(500).json({
                error: err,
                message: 'Error: Account creation failed'
            });
        }
        else {
            res.status(200).json({
                message: 'Successful account creation'
            });
        }
    });
});




// Route Protector

router.use((req, res, next) => {
    var token = req.body.token;
    if (!token) {
        token = req.query.state;
    }
    if (token) {
        jwt.verify(token, conf.TOKEN_SECRET, function(err, decoded) {
            if (err) {
                res.status(450).json({
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
        res.status(450).json({
            message: 'Error: Invalid token'
        });
    }
});


router.route('/create_group').post((req, res) => {
    console.log(req.body);
    var newGroup = Group();
    newGroup.name = req.body.name;
    newGroup.description = req.body.description;
    newGroup.isPublic = req.body.isPublic;
    newGroup.save((err) => {
        if (err) {
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
    });
});


router.route('/get_groups').get((req, res) => {

  Group.find({}, function(err, groups) {
    var groupApiModelList = [];
    groups.forEach(function(group) {
      groupApiModelList.push(groupApiModel(group));
    });
    res.send(groupApiModelList);
  });
});

function groupApiModel(group){
    return {
        'name' : group.name,
        'description' : group.description
    };
}

router.get('/groups/all', function (req, res, next) {
    var query = formGroupQuery(req.body);
    Group.findOne(query, function (err, group) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ group: group });
    });
});
router.get('/groups/calendar', function (req, res, next) {
    var query = formGroupQuery(req.body);
    Group.findOne(query, 'calendar', function (err, group) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ calendar: group });
    });
});
router.get('/groups/id', function (req, res, next) {
    var query = formGroupQuery(req.body);
    Group.findOne(query, '_id', function (err, group) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ calendar: group });
    });
});
router.get('/api/groups/meeting', function (req, res, next) {
    var query = formMeetingQuery(req.body);
    Meeting.findOne(query, function (err, meeting) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ meeting: meeting });
    });
});

// var savedAuth = null

// router.route('/authorize_google').get((req, res) => {
// 	function saveAuth(auth) {
// 		savedAuth = auth;
// 		res.send("saved auth");
// 	}

// 	api_access.login_google(saveAuth);
// });

// router.route('/get_google_files').get((req, res) => {
// 	function result(obj) {
// 		res.json(obj)
// 	}
// 	var folder = req.query.folderId;
// 	api_access.get_google_files(savedAuth, folder, null, result)
// });

// router.route('/upload_google_text').get((req, res) => {
// 	function result(obj) {
// 		res.json(obj)
// 	}
// 	var fileObj = {mimeType: 'text/plain', body: 'hello world!'};
// 	api_access.put_google_file(savedAuth, "hello.txt", fileObj, result)
// });

module.exports = router;
