var express = require('express');
var router = express.Router();

//var api_access = require('../api_logic/google_access');

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

router.route('/create_account').get((req, res) => {
	res.json({
		status: 200
	});
});

router.route('/login').post((req, res) => {
    // Check if user exists

    // If user exists
    res.json({
    	token: 'token'
    });

    // else return 403
});

router.route('/signup').post((req, res) => {
	res.json({
		things: true
	})
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