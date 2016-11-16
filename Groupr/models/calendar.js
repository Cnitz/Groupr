var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var CalendarSchema = new mongoose.Schema({
    events: [{
    	name: String,
    	location: String,
    	startTime: Date,
    	endTime: Date,
    	description: String
    }],
    pending_events: {
    	threshold: Number,
    	[{ 
    		name: String,
	    	location: String,
	    	startTime: Date,
	    	endTime: Date,
	    	description: String,
	    	votes: Number
    	}]
    },
});

module.exports = mongoose.model('Calendar', CalendarSchema);
