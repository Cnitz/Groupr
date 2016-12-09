// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var nodemailer = require('nodemailer');
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
// var connection = {
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'noreplygroupr@gmail.com',
//         pass: 'ILikeToEatApples'
//     },
//     logger: true
// };
//
// var transporter = nodemailer.createTransport(connection);
// var mailOptions = {
//   from: '"No Reply Groupr" <noreplygroupr@gmail.com>', // sender address
//   to: "fische17@purdue.edu", // list of receivers
//   subject: 'Groupr Started up', // Subject line
//   text: 'Groupr has started', // plaintext body
//   html: '<b>Groupr has Started</b>' // html body
// }
// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         return console.log(error);
//     }
//     console.log('Message sent: ' + info.response);
// });


// Start the server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
