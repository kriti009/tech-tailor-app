var mongoose = require("mongoose");
// var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;
var orderCounterSchema = new mongoose.Schema({
    _id : {
        type: String,
    },
    seq_val : Number,
});


module.exports = mongoose.model("OrderCounter", orderCounterSchema);

