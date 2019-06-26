var mongoose = require("mongoose");

var addressSchema = new mongoose.Schema({
   pincode: {type: Number, required: true},
   area: {type: String , required: true},
   city: {type: String , required:true},
   state: {type: String, required:true},
   landmark: {type: String}
});

module.exports = mongoose.model("Address", addressSchema);