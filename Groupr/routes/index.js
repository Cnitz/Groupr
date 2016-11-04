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
var api_chat = require('../api_logic/api_chat');


// Models
var User = require('../models/user');
var Group = require('../models/group');



router.route('/routes').get((req, res) => {
    res.json(router.stack);
});


/* Open Account APIs */
router.route('/account/login').post((req, res) => {
    api_account.login(req.body.username, req.body.password, conf.TOKEN_SECRET, res);
});

router.route('/account/signup').post((req, res) => {
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
                    error: err,
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
    callbackURL: "http://localhost:3000/api/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    //Should be retrieving cal events here?
    var googleCal = new gcal.GoogleCalendar(accessToken);

    googleCal.calendarList.list(function(err, data) {
      if(err) {
        console.log("error");
      } else {
        googleCal.events.list(data.items[0].id, function(err, calendarList) {
          if (err) {
            console.log("error: " + err);
          } else {
          var i = 0;

          //Getting user token: req.cookies.grouprToken
          User.findOne({token:request.cookies.grouprToken}).populate('calendar').exec(function(err,user){
            var eventList = [];
            while (i < calendarList.items.length){
              var newEvent = {
                name: calendarList.items[i].summary,
              	location: calendarList.items[i].location,
              	startTime: new Date(calendarList.items[i].start.dateTime),
              	endTime: new Date(calendarList.items[i].end.dateTime),
              	description: calendarList.items[i].description,
              };
              eventList.push(newEvent);
              i++;
            }
            var userCal = [];
            userCal.push(user.calendar);
            api_calendar.event_action(userCal, eventList, 'add', (obj) => {
                if (obj.status != 500) {

                }
                else {

                }
            });
          });
        }
        });
      }
      });

      return done(null, profile);
    }
));

router.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']}));

router.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/#/home' }), //Set to groups for testing
  function(req, res) {
      res.statusCode = 302;
      res.setHeader("Location", "/#/home");
      res.end();
  }
);

/*End of Google Auth */

// Route Protector
// router.use((req, res, next) => {
//     //console.log(req);

//     var token = req.cookies.grouprToken;
//     if (token) {
//         jwt.verify(token, conf.TOKEN_SECRET, function(err, decoded) {
//             if (err) {
//                 res.status(403).json({
//                     error: err,
//                     message: 'Error: Invalid token'
//                 });
//             }
//             else {
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     }
//     else {
//         res.status(403).json({
//             message: 'Error: Invalid token'
//         });
//     }
// });

/* Account APIs */
router.route('/account/get_user').get((req, res) => {
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
    console.log(req.body);
    User.findOne({token: req.cookies.grouprToken})
    .populate('calendar')
    .exec(function(err, user) {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else {
            var calendarList = [];
            calendarList.push(user.calendar);
            var eventList = [];
            eventList.push(req.body);
            api_calendar.event_action(calendarList, eventList, 'add', (obj) => {
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
            var calendarList = [];
            calendarList.push(user.calendar);
            var eventList = [];
            eventList.push(req.body);
            api_calendar.event_action(calendarList, eventList, 'delete', (obj) => {
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
            var calendarList = [];
            calendarList.push(user.calendar);
            var eventList = [];
            eventList.push(req.body);
            api_calendar.event_action(calendarList, eventList, 'edit', (obj) => {
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
        .exec(function(err, group) {
            if (err) {
                res.status(500).json({message: 'Error: Calendar does not exist'});
            }
            else if (group === undefined) {
                res.status(403).json({message: 'Error: Calendar does not exist'});
            }
            else {
                console.log(group.calendar);
                res.status(200).send(group.calendar);
            }
        });
    }
    else {
        User.findOne({_id: req.body.userId})
        .populate('calendar')
        .exec(function(err, user) {
            if (err) {
                res.status(500).json({message: 'Error: Calendar does not exist'});
            }
            else if (user === undefined) {
                res.status(403).json({message: 'Error: Calendar does not exist'});
            }
            else {
                console.log(user.calendar);
                res.status(200).json(user.calendar);
            }
        });
    }
});

router.route('/calendar/add_group_event').post((req, res) => {
    Group.findOne({ _id: req.body.groupId })
    .populate('calendar')
    .populate('users')
    .exec(function(err, group) {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else {
            var calendarList = [];
            calendarList.push(group.calendar);
            userIds = [];
            group.users.forEach(function(user) {
                userIds.push(user._id);
            });
            console.log(calendarList);
            console.log(userIds);
            User.find({'_id': { $in: userIds } })
            .populate('calendar')
            .exec(function(err, users) {
                users.forEach(function(user) {
                    calendarList.push(user.calendar);
                })
                var eventList = [];
                eventList.push(req.body.event);
                console.log(eventList);
                console.log(calendarList);
                api_calendar.event_action(calendarList, eventList, 'add', (obj) => {
                    if (obj.status != 500) {
                        res.status(200).json({message: 'Success: The event has been added'})
                    }
                    else {
                        res.status(obj.status).json(obj.message);
                    }
                });
            })
        }
    });
});

router.route('/calendar/delete_group_event').post((req, res) => {
    Group.findOne({ _id: req.body.groupId })
    .populate('calendar')
    .populate('users')
    .exec(function(err, group) {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else {
            var calendarList = [];
            calendarList.push(group.calendar);
            userIds = [];
            group.users.forEach(function(user) {
                userIds.push(user._id);
            });
            User.find({'_id': { $in: userIds } })
            .populate('calendar')
            .exec(function(err, users) {
                users.forEach(function(user) {
                    calendarList.push(user.calendar);
                })
                var eventList = [];
                eventList.push(req.body.event);
                api_calendar.event_action(calendarList, eventList, 'delete', (obj) => {
                    if (obj.status != 500) {
                        res.status(200).json({message: 'Success: The event has been added'})
                    }
                    else {
                        res.status(obj.status).json(obj.message);
                    }
                });
            })
        }
    });
});

router.route('/calendar/edit_group_event').post((req, res) => {
    Group.findOne({ _id: req.body.groupId })
    .populate('calendar')
    .populate('users')
    .exec(function(err, group) {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else {
            var calendarList = [];
            calendarList.push(group.calendar);
            userIds = [];
            group.users.forEach(function(user) {
                userIds.push(user._id);
            });
            User.find({'_id': { $in: userIds } })
            .populate('calendar')
            .exec(function(err, users) {
                users.forEach(function(user) {
                    calendarList.push(user.calendar);
                })
                var eventList = [];
                eventList.push(req.body.event);
                api_calendar.event_action(calendarList, eventList, 'edit', (obj) => {
                    if (obj.status != 500) {
                        res.status(200).json({message: 'Success: The event has been added'})
                    }
                    else {
                        res.status(obj.status).json(obj.message);
                    }
                });
            })
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
            var calendarList = [];
            calendarList.push(group.calendar);
            group.users.forEach(function(user) {
                calendarList.push(user.calendar);
            })
            api_calendar.schedule_assistant(calendarList, req.body.day, req.body.startTime, req.body.endTime, req.body.length, (obj) => {
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
 */
router.route('/tasks/user').post((req, res) => {
    api_tasks.tasksByUser(req, res);
});
router.route('/tasks/add').post((req, res) => {
    api_tasks.addTask(req, res);
});
router.route('/tasks/group').post((req, res) => {
    api_tasks.tasksInGroup(req, res);
});
router.route('/tasks/remove').post((req, res) => {
    api_tasks.removeTask(req, res);
});
router.route('/tasks/markComplete').post((req, res) => {
    api_tasks.removeTask(req, res);
});
router.route('/tasks/updateStatus').post((req, res) => {
    api_tasks.updateStatus(req, res);
});

/*
 * Chat Api routes
 *  -Create chat messages
 *  -Get all chat messages in a group
 */
router.route('/chat/:group/send').post((req, res) => {
    api_chat.sendMessage(req, res);
});
router.route('/chat/:group').get((req, res) => {
    api_chat.getMessages(req, res);
});

module.exports = router;
