const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  email: {type: String, required: true},
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to Product
      name: { type: String, required: true }, // Product name for redundancy
      price: { type: Number, required: true }, // Product price at time of order
      quantity: { type: Number, required: true, min: 1 }, // Quantity ordered
      imageUrl: { type: String, required: true }, // Product name for redundancy
    },
  ],
  totalAmount: { type: Number, required: true }, // Total order amount
  paymentMethod: { type: String, enum: ["COD"], default: "COD" }, // Only COD payment method
  paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" }, // Payment status
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  }, // Order status
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    building: { type: String, trim: true, required: true },
    street: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    pinCode: { type: String, trim: true, required: true },
  }, // Shipping details
  orderedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
