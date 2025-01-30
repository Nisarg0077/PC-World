const mongoose = require('mongoose');

const ramSchema = new mongoose.Schema({
  type: String,
  speed: String,
  capacity: Number,
  modules: Number,
  casLatency: String,
}, { _id: false });

const storageSchema = new mongoose.Schema({
  type: String,
  interface: String,
  capacity: Number,
  rpm: Number,
}, { _id: false });

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
  ram: ramSchema, // Use sub-schema here
  motherboard: {
    manufacturer: String,
    model: String,
    socket: String,
    chipset: String,
    formFactor: String,
    memorySlots: Number,
    storageInterfaces: String,
  },
  storage: storageSchema, // Use sub-schema here
  desktopCase: {
    brand: String,
    model: String,
    formFactor: String,
    material: String,
  },
}, { _id: false});


  

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