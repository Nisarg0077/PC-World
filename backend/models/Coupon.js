const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  isUsed: { type: Boolean, default: false },
  expiryDate: { type: Date }, 
});

module.exports = mongoose.model("Coupon", couponSchema);