var mongoose = require('mongoose');

var GroupMember = new mongoose.Schema({
    name: { type: String, required: true },
    userID: { type: Number},
    email: { type: String }
});

var GroupSchema = new mongoose.Schema({
    name: { type: String, required: true, index: { unique: true }  },
    members: [GroupMember],
    description: { type: String },
    isPublic: {type: Boolean}
});

module.exports = mongoose.model('Group', GroupSchema);
