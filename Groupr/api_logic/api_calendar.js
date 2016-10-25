// Libraries

// Models
var User = require('../models/user');
var Calendar = require('../models/calendar');

var calendar = new Object();
calendar.user = new Object();
calendar.group = new Object();

calendar.user.add_event = function(event, res) {
	var newCalendar = Calendar();
	// set calendar fields
    newCalendar.save((err) => {
        if (err) {
        	res.status(500).json({message: 'Error: Account creation failed'});
        }
        else {
        	res.status(200).json({message: 'Successful calendar creation'});
        }
    });
}

calendar.user.delete_event = function(event, res) {
	
}

calendar.user.edit_event = function(event, res) {
	Calendar.findOne({ 'username': username}, (err, user) => {
        if (err) {
        	res.status(500).json({message: 'Error: Database access'});
        }
        else if (user === null) {
        	res.status(403).json({message: 'Error: Event does not exist'});
        }
        else {
            
        }
    });
}

calendar.group.add_event = function() {

}

calendar.group.delete_event = function() {

}

calendar.group.edit_event = function() {

}

module.exports = calendar;