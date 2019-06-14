var mongoose = require("mongoose");

var Schema = mongoose.Schema;
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
    },
    status : {type: String , enum: ['order placed','order picked-up','alteration in progress', 'order delivered']},
},{timestamps: true});

module.exports = mongoose.model("Order", orderSchema);