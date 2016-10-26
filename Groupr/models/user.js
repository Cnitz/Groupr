var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    password : { type: String, required: true },
    groups : [ObjectId],
    token: { type: String, index : { unique: true } },
    calendar: { type: ObjectId, ref: 'Calendar' }
});

module.exports = mongoose.model('User', UserSchema);
