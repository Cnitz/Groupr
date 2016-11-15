// Libraries

// Models
var User = require('../models/user');
var Calendar = require('../models/calendar');
var Group = require('../models/group');

var calendar = new Object();

var search_event = function(eventList, key) {
    eventList.forEach(function(event, index) {
        if (event.name == key.name) {
            return index;
        }
    })
    return -1;
}

calendar.event_action = function(calendarList, eventList, action_type, callback) {
    var reponseObj = {};
    var counter = 0;
    var index = 0;
    calendarList.forEach(function(calendar) {
        index = 0;
        switch (action_type) {
            case 'add':
                eventList.forEach(function(event) {
                    console.log(event);
                    calendar.events.push(event);
                });
            break;
            case 'delete':
                eventList.forEach(function(event) {
                    if (index != -1) {
                        index = search_event(calendar.events, event);
                        calendar.events.splice(index, 1);
                    }
                    else {
                        reponseObj.status == 500;
                        reponseObj.message = 'Error: Event not found';
                    }
                });
            break;
            case 'edit':
                eventList.forEach(function(event) {
                    index = search_event(calendar.events, event);
                    console.log("42 " + index);
                    if (index != -1) {
                        calendar.events[index] = event;
                        console.log('46 ' + calendar.events[index]);
                    }
                    else {
                        reponseObj.status == 500;
                        reponseObj.message = 'Error: Event not found';
                    }
                });
        }
    })
    calendarList.forEach(function(calendar) {
        calendar.save((err) => {
            counter++;
            if (err) {
                reponseObj.status = 500;
                reponseObj.message = 'Error: Database access';
            }
            else if (counter === calendarList.length) {
                console.log(counter);
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
