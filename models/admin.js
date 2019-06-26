var mongoose = require("mongoose");

var adminSchema = new mongoose.Schema({
    username: {type: String},
    password :{type: String},
    jwtToken: [{type:String}],
    role : {type: String , enum: ['customer','admin','technician']}
});

module.exports = mongoose.model("Admin", adminSchema);