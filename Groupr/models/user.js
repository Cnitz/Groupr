var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    password : { type: String, required: true },
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    
};

module.exports = mongoose.model('User', UserSchema);