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
    schedule_assistant: {
        active: Boolean,
        voters: [{type: ObjectId, ref: 'User'}],
        threshold: Number,
        name: String,
        description: String,
        location: String,
        events: [{ 
            startTime: Date,
            endTime: Date,
            votes: Number
        }]
    }
});

module.exports = mongoose.model('Calendar', CalendarSchema);
