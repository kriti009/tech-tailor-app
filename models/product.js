var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var productSchema = new mongoose.Schema({
    
    gender : {type: String , enum : ['male' ,'female','kid']},
    image_url : {type: String},
    service_type: {type : String},
    category: {type: String , enum: ['formal', 'informal']},
    description: {type: String},
    alteration_price : {type: Number},
    is_available : {type: Boolean}
});

module.exports = mongoose.model("Product", productSchema);