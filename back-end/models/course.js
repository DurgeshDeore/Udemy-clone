const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dprice: { type: Number, required: true },
    price: { type: Number, required: true },
    instructor: { type: String, required: true },
    duration: { type: String, required: true },
    videoLink: { type: String, required: true }  //link added
});

module.exports = mongoose.model('Course', courseSchema);