var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: {type: String},
    phone_no : {type: String},
    password :{type: String},
    address: [{type : String}],
    email : {type: String},
    jwtToken: [{type:String}],
    role : {type: String , enum: ['customer','admin','pickup_guy']}
});

module.exports = mongoose.model("User", userSchema);