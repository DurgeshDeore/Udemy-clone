const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userid : { type: String, require: true},
    productid : { type: String, require: true},
    quantity : { type: Number, require: true},
    price : { type: Number, require: true},
    totalamt : { type: Number, require: true},
    status : { type: String, require: true},
    date : { type: String, require: true},
})
module.exports = mongoose.model('Cart', cartSchema);