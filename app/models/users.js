var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    support_id: String,
    name: String,
    gender: String,
    position: String,
    company: String,
    country: String,
    domain: String,
    opinion: String
});

module.exports = mongoose.model('User', UserSchema);