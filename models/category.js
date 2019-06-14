var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var categorySchema = new mongoose.Schema({
    name: {type: String},
    image_url: {type: String}
});

module.exports = mongoose.model("Category", categorySchema);