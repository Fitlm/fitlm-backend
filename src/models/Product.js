const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "",
  },
  imageName: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "#ffffff",
  },
  flip: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    default: "",
  },
  part: {
    type: String,
  },
  time: {
    type: Number,
  },
  satisfactionId: {
    type: String,
  },
  memo: {
    type: String,
    default: "",
  },
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  rotate: {
    type: String,
    default: '0deg',
  },
  scale: {
    type: Number,
    default: 1,
  },
  zindex: {
    type: Number,
    default: 2,
  },
  flip: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
