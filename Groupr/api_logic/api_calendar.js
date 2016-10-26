// Libraries

// Models
var User = require('../models/user');
var Calendar = require('../models/calendar');
var Group = require('../models/group');

var calendar = new Object();

calendar.event_action = function(eventConfig, eventData, actionType, propagate, res) {
    if (propagate) {
        Group.find({ _id: eventConfig.groupId }, (err, group) => {
            if (err) {
                res.status(500).json({message: 'Error: Database access'});
            }
            else if (group === null) {
                res.status(403).json({message: 'Error: Group does not exist'});
            }
            else {

            }
        })
    }
    else {
        Calendar.findOne({ _id: calendarId}, (err, calendar) => {
            if (err) {
                res.status(500).json({message: 'Error: Database access'});
            }
            else if (calendar === null) {
                res.status(403).json({message: 'Error: Calendar does not exist'});
            }
            else {
                switch (actionType) {
                    case 'add':
                        calendar.events.push(event);
                    break;
                    case 'delete':
                        var index = search_event(calendar.events, event);
                        calendar.events.splice(index, 1);
                    break;
                    case 'edit':
                        var index = search_event(calendar.events, event);
                        calendar.events[index] = event;
                }              
                res.status(200).json({ message: 'Success: Event' + actionType + ' was completed'});
            }
        });
    }
}

var search_event = function(eventList, key) {
    eventList.forEach(function(event, index) {
        if ( (event.name == key.name) && 
             (event.startTime == key.startTime) && 
             (event.endTime == key.endTime) ) {
            return index;
        }
    })
}

calendar.add_event = function(eventConfig, eventData, res) {
    if (eventConfig.type == 'group') {
        Group.find({ _id: eventConfig.groupId }, (err, group) => {
            if (err) {
                res.status(500).json({message: 'Error: Database access'});
            }
            else if (group === null) {
                res.status(403).json({message: 'Error: Group does not exist'});
            }
            else {

            }
        })
    }
    else if (eventConfig.type == 'user') {
        Calendar.findOne({ _id: calendarId}, (err, calendar) => {
            if (err) {
                res.status(500).json({message: 'Error: Database access'});
            }
            else if (calendar === null) {
                res.status(403).json({message: 'Error: Calendar does not exist'});
            }
            else {
                calendar.events.push(event);
                res.status(200).json({ message: 'Success: Event added to calendar'});
            }
        });
    }
    else {
        res.status(403).json({message: 'Error: No event configuration'});
    }
    
}

calendar.delete_event = function(eventConfig, eventData, res) {
    if (eventConfig.type == 'group') {
        
    }
    else if (eventConfig.type == 'user') {
        Calendar.findOne({ _id: calendarId}, (err, calendar) => {
            if (err) {
                res.status(500).json({message: 'Error: Database access'});
            }
            else if (calendar === null) {
                res.status(403).json({message: 'Error: Calendar does not exist'});
            }
            else {
                var index = search_event(calendar.events, event);
                calendar.events.splice(index, 1);
                res.status(200).json({ message: 'Success: Event deleted from calendar'});
            }
        });
    }
    else {
        res.status(403).json({message: 'Error: No event configuration'});
    }
	
}

calendar.edit_event = function(eventConfig, eventData, res) {
    if (eventConfig.type == 'group') {
        
    }
    else if (eventConfig.type == 'user') {
        Calendar.findOne({ _id: calendarId}, (err, calendar) => {
            if (err) {
                res.status(500).json({message: 'Error: Database access'});
            }
            else if (calendar === null) {
                res.status(403).json({message: 'Error: Calendar does not exist'});
            }
            else {
                var index = search_event(calendar.events, event);
                calendar.events[index] = event;
                res.status(200).json({ message: 'Success: Event changes added to calendar'});
            }
        });
    }
    else {
        res.status(403).json({message: 'Error: No event configuration'});
    }
	
}

calendar.get_events = function(calendarId, res) {
    Calendar.findOne({ _id: calendarId}, (err, calendar) => {
        if (err) {
            res.status(500).json({message: 'Error: Database access'});
        }
        else if (calendar === null) {
            res.status(403).json({message: 'Error: Calendar does not exist'});
        }
        else {
            res.status(200).json(calendar);
        }
    });
}

module.exports = calendar;