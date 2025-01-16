const mongoose = require('mongoose');

const sellerInventorySchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
      }
    ],
  });
  
  module.exports = mongoose.model('SellerInventory', sellerInventorySchema);
  