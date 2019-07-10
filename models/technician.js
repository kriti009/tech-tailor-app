var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var technicianSchema = new mongoose.Schema({
    name: {type: String},
    phone_no : {type: String},
    email: {type: String},
    address: {type: String},
});

module.exports = mongoose.model("Technician", technicianSchema);