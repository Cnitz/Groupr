var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    password : { type: String, required: true },
    groups : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' } ],
    token: { type: String, index : { unique: true } }
});

module.exports = mongoose.model('User', UserSchema);
