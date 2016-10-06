// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var gcal = require('google-calendar');
var googleCal;
// MONGO
mongoose.connect('mongodb://grouprdev:bobrossisour7th@jello.modulusmongo.net:27017/Ej2abuqu');

// Create the app
var app = express();

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new GoogleStrategy({
    clientID:     "721031064145-8eec4v9olvj7o0808i56m2osjlk2ebte.apps.googleusercontent.com",
    clientSecret: "U1gDlLfab-oeclNN6xQ2wAir",
    callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    googleCal = new gcal.GoogleCalendar(accessToken);


    return done(null, profile);
  }
));

// App use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/client'));

// Register all our routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']  }));
app.get('/auth/google/callback',
passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  function(req, res) {


    res.redirect('/listCal');
});
app.get('/listCal', function(req, res) {
  googleCal.calendarList.list(function(err, data) {
    if(err) return res.send(500,err);
    return res.send(data);
  });
});
app.use('/api', require('./routes'));

// Get the port
var port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
