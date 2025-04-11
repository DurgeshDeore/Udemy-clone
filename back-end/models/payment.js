const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    userid : { type: String, require: true},
    cartid : { type: String, require: true},
    quantity : { type: Number, require: true},
    totalamt : { type: Number, require: true},
    status : { type: String, require: true},
    date : { type: Date, require: true},
})
const cartModel = mongoose.model('cart', cartSchema);