var mongoose = require('mongoose');

var MeetingSchema = new mongoose.Schema({
    group: { type: ObjectId, required: true},
    name: String,
    creator: { type: ObjectId, required: true},
    location: String,
    date: { type: Date, required: true },
});

module.exports = mongoose.model('Meeting', MeetingSchema);
