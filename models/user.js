var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: {type: String},
    phone_no : {type: Number},
    address: [{type : String}],
    email : {type: String}
});

module.exports = mongoose.model("User", userSchema);