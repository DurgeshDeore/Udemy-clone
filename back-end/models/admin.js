const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    name : { type: String, require: true},
    password : { type: String, require: true}
})
module.exports = mongoose.model('Admin', adminSchema);