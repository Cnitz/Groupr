/*
 * Serve JSON to our AngularJS client
 */
var express = require('express');
var passport = requre('passport');
var googleCal = require('google-calendar');
var router = express.Router();

// Models
var User = require('../models/user');
var Meeting = require('../models/meeting');
var Group = require('../models/group');

/*
 * Group Data API
 */
var formGroupQuery = function(param) {
    var query = {
        _id: (req.param.id == null) ? undefined : req.param.id,
        name: (req.param.name == null) ? undefined : req.param.name,
        creator: (req.param.creator == null) ? undefined : req.param.creator,
        users: [(req.param.hasUser == null) ? undefined : req.param.hasUser]
    };
    return query;
};
var formMeetingQuery = function(param) {
    var query = {
        _id: (req.param.id == null) ? undefined : req.param.id,
        group: (req.param.group == null) ? undefined : req.param.group,
        name: (req.param.name == null) ? undefined : req.param.name,
        creator: (req.param.creator == null) ? undefined : req.param.creator,
        date: (req.param.date == null) ? undefined : req.param.date,
        location: (req.param.location == null) ? undefined : req.param.location,
    };
    return query;
};

router.get('/api/groups/all*', function (req, res, next) {
    var query = formGroupQuery(req.param);
    Group.findOne(query, function (err, group) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ group: group });
    });
});
router.get('/api/groups/calendar*', function (req, res, next) {
    var query = formGroupQuery(req.param);
    Group.findOne(query, 'calendar', function (err, group) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ calendar: group });
    });
});
router.get('/api/groups/id*', function (req, res, next) {
    var query = formGroupQuery(req.param);
    Group.findOne(query, '_id', function (err, group) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ calendar: group });
    });
});
router.get('/api/groups/meeting*', function (req, res, next) {
    var query = formMeetingQuery(req.param);
    Meeting.findOne(query, function (err, meeting) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ meeting: meeting });
    });
});
router.get('/api/calender/list*', function (req, res, next) {
    var query = formMeetingQuery(req.param);
    Meeting.findOne(query, function (err, meeting) {
        if (err)
            res.status(500).json({ message: 'Error: Database access' });
        else
            res.status(200).json({ meeting: meeting });
    });
});

module.exports = router;
