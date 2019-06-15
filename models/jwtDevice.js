var mongoose = require("mongoose");

var jwtDeviceSchema = new mongoose.Schema({
    jwt: String,
    device_id: String,
    user_id: String,    
});

module.exports = mongoose.model("JwtDevice", jwtDeviceSchema);