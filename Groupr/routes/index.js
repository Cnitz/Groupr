var express = require('express');
var router = express.Router();

// Models
var User = require('../models/user');

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
            res.status(200).json({
                user: user,
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