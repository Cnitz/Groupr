// Libraries

// Models
var User = require('../models/user');
var Calendar = require('../models/calendar');
var Group = require('../models/group');

var calendar = new Object();

var search_event = function(eventList, key) {
    eventList.forEach(function(event, index) {
        if ( (event.name == key.name) && 
             (event.startTime == key.startTime) && 
             (event.endTime == key.endTime) ) {
            return index;
        }
    })
}

calendar.event_action = function(calendars, event, action_type, callback) {
    var reponseObj = {};
        calendars.forEach(function(calendar) {
            switch (action_type) {
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
            calendar.save((err) => {
                counter++;
                if (err) {
                    reponseObj.status = 500;
                    reponseObj.message = 'Error: Database access';
                }
                else if (counter === calendars.length) {
                    callback(reponseObj);
                }
                else {}
            })
        })  
}

calendar.schedule_assistant = function(calendars, day, startTime, endTime, length, callback) {
    var reponseObj = {};
    
}

module.exports = calendar;