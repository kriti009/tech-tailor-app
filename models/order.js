var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var orderSchema = new mongoose.Schema({
    _id : {type: Number},
    product_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pickup_address : {type: String},
    pickup_date: {
        type: Date,
        // required: true,
    },
    pickup_time: {
        type : String ,
        // required: true
    }
});

module.exports = mongoose.model("Order", orderSchema);