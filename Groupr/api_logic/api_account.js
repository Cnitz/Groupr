// Libraries
var jwt = require('jsonwebtoken');

// Models
var User = require('../models/user');

var account = new Object();

// login
account.login = function(username, password, TOKEN_SECRET, res) {
	User.findOne({ 'username': username}, (err, user) => {
        if (err) {
        	res.status(500).json({message: 'Error: Database access'});
        }
        else if (user === null) {
        	res.status(403).json({message: 'Error: Invalid login'});
        }
        else if (user.password != password) {
        	res.status(403).json({message: 'Error: Invalid login'});
        }
        else {
            var token = jwt.sign({ email: user.email }, TOKEN_SECRET, {
                expiresIn: '12h'
            });
            user.token = token;
            user.save((err) => {
		        if (err) {
		        	res.status(500).json({message: 'Error: Storing Token Failed'});
		        }
		        else {
		        	res.status(200).cookie('grouprToken', token).json({message: 'Successful account login'});
		        }
		    });
        }
    });
}

// signup
account.signup = function(account_info, res) {
	var newAccount = User();
    newAccount.name = account_info.name;
    newAccount.username = account_info.username;
    newAccount.email = account_info.email;
    newAccount.password = account_info.password;
    newAccount.save((err) => {
        if (err) {
        	res.status(500).json({message: 'Error: Account creation failed'});
        }
        else {
        	res.status(200).json({message: 'Successful account creation'});
        }
    });
}

module.exports = account;