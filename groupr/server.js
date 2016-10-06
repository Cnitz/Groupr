// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var googleCal;
// MONGO
mongoose.connect('mongodb://grouprdev:bobrossisour7th@jello.modulusmongo.net:27017/Ej2abuqu');

// Create the app
var app = express();

app.use(passport.initialize());
app.use(passport.session());

// App use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/client'));

// Register all our routes

app.use('/api', require('./routes'));

// Get the port
var port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
