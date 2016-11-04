var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TaskSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, required: true},
    title: { type: String, required: true },
    description: String,
    creator: { type: String, required: true},
    users: [ String ],
    dateCreated: { type: Date, required: true },
    dueDate: Date,
    category: String,
    status: { type: String, required: true }

});

module.exports = mongoose.model('Task', TaskSchema);
