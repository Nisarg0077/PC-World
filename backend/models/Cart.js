const mongoose = require('mongoose');
const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
  });
  
  const cartSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cartItems: [cartItemSchema],
  });
  
  module.exports = mongoose.model('Cart', cartSchema);