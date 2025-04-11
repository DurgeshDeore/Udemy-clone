const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/classroomDB');

let con = mongoose.connection;
module.exports = con;