var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    creator: { type: String, required: true},
    description: { type: String},
    users: [{type: String, required: true}],
    //calendar: [ObjectId],
    isPublic: {type: Boolean, required: true},
    chat: [{ body: String, user: String, date: Date }],
    complaints: [{ body: String, date: Date }],
});

module.exports = mongoose.model('Group', GroupSchema);
