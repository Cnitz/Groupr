var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var CalendarSchema = new mongoose.Schema({
    events: [
    {
    	 
    }
    ]
});

module.exports = mongoose.model('Calendar', CalendarSchema);
