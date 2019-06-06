var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
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