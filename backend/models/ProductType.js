const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProductType = mongoose.model('ProductType', productTypeSchema);
module.exports = ProductType;