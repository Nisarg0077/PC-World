const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
  });
  
  const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    totalPrice: Number,
    shippingAddress: addressSchema,
    orderItems: [orderItemSchema],
  });
  
  module.exports = mongoose.model('Order', orderSchema);