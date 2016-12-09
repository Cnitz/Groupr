// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var http = require('http');

// MONGO
mongoose.connect('mongodb://grouprdev:bobrossisour7th@jello.modulusmongo.net:27017/Ej2abuqu');

// Create the app
var app = express();

// App use
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/client'));

// Register all our routes
app.use('/api', require('./routes'));

// Get the port
var port = process.env.PORT || 3000;

var j = schedule.scheduleJob('* * 8 * *', function(){

});
// Start the server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
