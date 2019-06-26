var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var orderSchema = new mongoose.Schema({
    product : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pickup_address : {type: String},
    pickup_date: {
        type: Date,
        // required: true,
    },
    audit: [{
        status: {type: String},
        date: {type: Date},
        updated_by: {type: Date},
        assigned_technician: {type: String},
    }],
    technician: {type: String},
    total_quantity: {type: Number},
    status : {type: String , enum: ['order placed','order picked-up','alteration in progress', 'order delivered']},
},{timestamps: true});

module.exports = mongoose.model("Order", orderSchema);