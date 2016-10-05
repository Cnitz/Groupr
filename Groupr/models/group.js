var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    creator: { type: ObjectId, required: true},
    users: [{type: String, required: true}],
    calendar: [ObjectId],
    chat: [{ body: String, user: String, date: Date }],
    complaints: [{ body: String, date: Date }],
});

module.exports = mongoose.model('Group', GroupSchema);
