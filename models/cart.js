var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var cartSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    product_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

module.exports = mongoose.model("Cart", cartSchema);