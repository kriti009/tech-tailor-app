var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: {type: String},
    phone_no : {type: String},
    password :{type: String},
    address: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    ],
    email : {type: String},
    jwtToken: [{type:String}],
    role : {type: String , enum: ['customer','admin','technician']}
});

module.exports = mongoose.model("User", userSchema);