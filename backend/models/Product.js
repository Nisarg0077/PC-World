const mongoose = require('mongoose');
const specificationSchema = new mongoose.Schema({
    cpu: {
      manufacturer: String,
      model: String,
      cores: Number,
      threads: Number,
      baseClock: Number,
      boostClock: Number,
      socket: String,
      cache: String,
    },
    gpu: {
      manufacturer: String,
      model: String,
      vram: Number,
      vramType: String,
      coreClock: Number,
      memoryClock: Number,
      interface: String,
    },
    ram: {
      type: String,
      speed: String,
      capacity: Number,
      modules: Number,
      casLatency: Number,
    },
    motherboard: {
      manufacturer: String,
      model: String,
      socket: String,
      chipset: String,
      formFactor: String,
      memorySlots: Number,
      storageInterfaces: String,
    },
    storage: {
      type: String,
      interface: String,
      capacity: Number,
      rpm: Number,
    },
    desktopCase: {
      brand: String,
      model: String,
      formFactor: String,
      material: String,
    }
  });
  
  const productSchema = new mongoose.Schema({
    name: String,
    category: { type: String, enum: ['cpu', 'gpu', 'ram', 'motherboard', 'storage'] },
    brand: String,
    model: String,
    description: String,
    price: Number,
    stock: Number,
    imageUrl: String,
    specifications: specificationSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Product', productSchema);