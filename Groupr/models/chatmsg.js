var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ChatSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, required: true},
    message: { type: String, required: true },
    user: { type: String, required: true},
    dateCreated: { type: Date, required: true }
});

module.exports = mongoose.model('ChatMessage', ChatSchema);
