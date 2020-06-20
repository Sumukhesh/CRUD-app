var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
  },
  description: {
    type: String,
    required: true,
    maxlength: 100,
  },
  imageURL: {
    type: String,
    required: true,
    maxlength: 100,
  },
  price: {
    type: Number,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
