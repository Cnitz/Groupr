var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ComplaintSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, required: true},
    complaint: { type: String, required: true},
    dateCreated: { type: Date, required: true },

});

module.exports = mongoose.model('Complaint', ComplaintSchema);
