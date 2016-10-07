var mongoose = require('mongoose');

var GoogleSchema = new mongoose.Schema({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: false},
  id:{ type: String, required: true },
  username:{type: String, required: true}
});

module.exports = mongoose.model('Google', GoogleSchema);
