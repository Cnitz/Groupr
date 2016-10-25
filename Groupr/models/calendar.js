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
    }]
});

module.exports = mongoose.model('Calendar', CalendarSchema);
