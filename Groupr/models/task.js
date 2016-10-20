var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TaskSchema = new mongoose.Schema({
    group: { type: ObjectId, required: true},
    title: { type: String, required: true },
    description: String,
    creator: { type: ObjectId, required: true},
    users: [ String ],
    dateCreated: { type: Date, required: true },
    dueDate: Date,
    category: String,
    completed: { type: Boolean, required: true }
});

module.exports = mongoose.model('Task', TaskSchema);
