var express = require('express');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var router = express.Router();

//Google Auth
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var gcal = require('google-calendar');

// Config
var conf = require('../config.js');

// API logic
var api_account = require('../api_logic/api_account');
var api_calendar = require('../api_logic/api_calendar');
var api_groups = require('../api_logic/api_groups');
var api_tasks = require('../api_logic/api_tasks');

// Models
var User = require('../models/user');
var Group = require('../models/group');



router.route('/routes').get((req, res) => {
    res.json(router.stack);
});


/* Open Account APIs */
router.route('account/login').post((req, res) => {
    api_account.login(req.body.username, req.body.password, conf.TOKEN_SECRET, res);
});

router.route('account/signup').post((req, res) => {
    var account_info = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    api_account.signup(account_info, res);
});

router.route('account/verify_token').get((req, res) => {
    var token = req.cookies.grouprToken;
    if (token) {
        jwt.verify(token, conf.TOKEN_SECRET, function(err, decoded) {
            if (err) {
                res.status(403).json({
                    message: 'Error: Invalid token'
                });
            }
            else {
                res.status(200).json({
                    message: 'Success'
                });
            }
        });
    }
    else {
        res.status(403).json({
            message: 'Error: Invalid token'
        });
    }
});
/* End Open Account APIs */

/* Start of Google Auth -- Check if this is better placed elsewhere 10/25 */

passport.use(new GoogleStrategy({
    clientID:     "721031064145-8eec4v9olvj7o0808i56m2osjlk2ebte.apps.googleusercontent.com",
    clientSecret: "U1gDlLfab-oeclNN6xQ2wAir",
    callbackURL: "http://127.0.0.1:3000/api/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    //Should be retrieving cal events here?


    return done(null, profile);
  }
));

router.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar'], accessType: 'offline'}));

router.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/groups' }), //Set to groups for testing
  function(req, res) {
    res.redirect('/groups'); // Need to Change this some how to be defined by spot taken from
  }
);

/*End of Google Auth */

// Route Protector
router.use((req, res, next) => {
    console.log(req);
    var token = req.cookies.grouprToken;
    if (token) {
        jwt.verify(token, conf.TOKEN_SECRET, function(err, decoded) {
            if (err) {
                res.status(403).json({
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
        res.status(403).json({
            message: 'Error: Invalid token'
        });
    }
});

/* Account APIs */
router.route('account/get_user').get((req, res) => {
    var token = req.cookies.grouprToken;
    api_account.get_user(token, res);
});

/* End Account APIs */

/*
 * Group Api routes
 *  -Create Group
 *  -Get all groups
 *  -Get all groups by current user
 *  -Get group by id
 *
 */

//Create a brand new group
router.route('/groups/create').post((req, res) => {
    api_groups.create_group(req, res);
});

//Get all groups
router.route('/groups/all').get((req, res) => {
    api_groups.get_all_groups(req, res);
});

//Get groups by current user
router.route('/groups').get((req, res) => {
    api_groups.get_user_groups(req, res);
});

//Get information pertaining to a specific Group
router.route('/groups/:id').get((req, res) => {
    api_groups.get_group_by_id(req, res, req.params.id);
});

router.route('/groups/join/:id').put((req, res) => {
    api_groups.join_group(req, res, req.params.id);
});

router.route('/groups/leave/:id').put((req, res) => {
    api_groups.leave_group(req, res, req.params.id);
});

function groupApiModel(group){
    return {
        'name' : group.name,
        'description' : group.description
    };
}
/* End Group APIs */

/* Calendar APIs */
router.route('/calendar/add_event').post((req, res) => {
    User.findOne({token: req.cookies.grouprToken})
    .populate('calendar')
    .exec(function(err, user) {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else {
            var calendars = [];
            calendars.push(user.calendar);
            api_calendar.event_action(calendars, req.body.calendarEvent, 'add', (obj) => {
                if (obj.status != 500) {
                    res.status(200).json({message: 'Success: The event has been added'})
                }
                else {
                    res.status(obj.status).json(obj.message);    
                }             
            });
        }
    });    
});

router.route('/calendar/delete_event').post((req, res) => {
    User.findOne({token: req.cookies.grouprToken})
    .populate('calendar')
    .exec(function(err, user) {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else {
            var calendars = [];
            calendars.push(user.calendar);
            api_calendar.event_action(calendars, req.body.calendarEvent, 'delete', (obj) => {
                if (obj.status != 500) {
                    res.status(200).json({message: 'Success: The event has been deleted'})
                }
                else {
                    res.status(obj.status).json(obj.message);    
                }              
            });
        }
    });
});

router.route('/calendar/edit_event').post((req, res) => {
    User.findOne({token: req.cookies.grouprToken})
    .populate('calendar')
    .exec(function(err, user) {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else {
            var calendars = [];
            calendars.push(user.calendar);
            api_calendar.event_action(calendars, req.body.calendarEvent, 'edit', (obj) => {
                if (obj.status != 500) {
                    res.status(200).json({message: 'Success: The event has been edited'})
                }
                else {
                    res.status(obj.status).json(obj.message);    
                }             
            });
        }
    });
});

router.route('/calendar/get_events').post((req, res) => {
    if (req.body.calendarType == 'group') {
        Group.findOne({_id: req.body.groupId})
        .populate('calendar')
        .exec(function(err, calendar) {
            if (err) {
                res.status(500).json({message: 'Error: Calendar does not exist'});
            }
            else if (calendar === null) {
                res.status(403).json({message: 'Error: Calendar does not exist'});
            }
            else {
                res.status(200).send(calendar);
            }
        });
    }
    else {
        User.findOne({_id: req.body.userId})
        .populate('calendar')
        .exec(function(err, calendar) {
            if (err) {
                res.status(500).json({message: 'Error: Calendar does not exist'});
            }
            else if (calendar === null) {
                res.status(403).json({message: 'Error: Calendar does not exist'});
            }
            else {
                res.status(200).send(calendar);
            }
        });
    }
});

router.route('/calendar/add_group_events').post((req, res) => {
    Group.findOne({ _id: req.body.groupId })
    .populate('calendar')
    .populate('users')
    .exec(function(err, group) {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else {
            var calendars = [];
            calendars.push(group.calendar);
            group.users.forEach(function(user) {
                calendars.push(user.calendar);
            })
            api_calendar.event_action(calendars, req.body.calendarEvent, 'add', (obj) => {
                if (obj.status != 500) {
                    res.status(200).json({message: 'Success: The event has been added'})
                }
                else {
                    res.status(obj.status).json(obj.message);    
                }
            });
        }
    });
});

router.route('/calendar/delete_group_events').post((req, res) => {
    Group.findOne({ _id: req.body.groupId })
    .populate('calendar')
    .populate('users')
    .exec(function(err, group) {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else {
            var calendars = [];
            calendars.push(group.calendar);
            group.users.forEach(function(user) {
                calendars.push(user.calendar);
            })
            api_calendar.event_action(calendars, req.body.calendarEvent, 'delete', (obj) => {
                if (obj.status != 500) {
                    res.status(200).json({message: 'Success: The event has been deleted'})
                }
                else {
                    res.status(obj.status).json(obj.message);    
                }
            });
        }
    });
});

router.route('/calendar/edit_group_events').post((req, res) => {
    Group.findOne({ _id: req.body.groupId })
    .populate('calendar')
    .populate('users')
    .exec(function(err, group) {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else {
            var calendars = [];
            calendars.push(group.calendar);
            group.users.forEach(function(user) {
                calendars.push(user.calendar);
            })
            api_calendar.event_action(calendars, req.body.calendarEvent, 'edit', (obj) => {
                if (obj.status != 500) {
                    res.status(200).json({message: 'Success: The event has been edited'})
                }
                else {
                    res.status(obj.status).json(obj.message);    
                }
            });
        }
    });
});

router.route('/calendar/schedule_assistant').post((req, res) => {
    Group.findOne({ _id: req.body.groupId })
    .populate('calendar')
    .populate('users')
    .exec(function(err, group) {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else {
            var calendars = [];
            calendars.push(group.calendar);
            group.users.forEach(function(user) {
                calendars.push(user.calendar);
            })
            api_calendar.schedule_assistant(calendars, req.body.day, req.body.startTime, req.body.endTime, req.body.length, (obj) => {
                if (obj.status != 500) {
                    res.status(200).json({message: 'Success'})
                }
                else {
                    res.status(obj.status).json(obj.message);    
                }
            });
        }
    });
});
/* End Calendar APIs */

/*
 * Tasks Api routes
 *  -Create tasks
 *  -Get all tasks in a group
 *  -Get all tasks involving user
 *  -Remove tasks
 *  -Mark task completed/incomplete
 */
router.route('/tasks/user').post((req, res) => {
    api_tasks.tasksByUser(req, res);
});
router.route('/tasks/add').post((req, res) => {
    console.log(JSON.stringify(req.body));
    api_tasks.addTask(req, res);
});
router.route('/tasks/group').post((req, res) => {
    api_tasks.tasksInGroup(req, res);
});
router.route('/tasks/remove').post((req, res) => {
    api_tasks.removeTask(req, res);
});

module.exports = router;

