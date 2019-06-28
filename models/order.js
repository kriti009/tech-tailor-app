var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var orderSchema = new mongoose.Schema({
    product : [{   
        quantity: {type: Number},
        product_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    }],
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pickup_address : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    pickup_date: {
        type: Date,
    },
    audit: [{
        status: {type: String},
        date: {type: Date},
        updated_by: {type: String},
        remark: {type: String},
    },{timestamps: true}],

    technician: {type: String},
    total_quantity: {type: Number},
    status : {type: String , enum: ['order placed','technician assigned','order picked-up','alteration in progress', 'order delivered']},
},{timestamps: true});

module.exports = mongoose.model("Order", orderSchema);