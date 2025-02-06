const mongoose = require("mongoose");

// RAM Schema
const ramSchema = new mongoose.Schema(
  {
    type: String,
    speed: String,
    capacity: Number,
    modules: Number,
    casLatency: String,
  },
  { _id: false }
);

// Storage Schema
const storageSchema = new mongoose.Schema(
  {
    type: String,
    interface: String,
    capacity: String,
    rpm: Number,
  },
  { _id: false }
);

// Power Supply Schema (PSU)
const powerSupplySchema = new mongoose.Schema(
  {
    wattage: Number,
    efficiencyRating: String,
    modular: { type: Boolean, default: false }, // True for modular PSUs
    connectors: [String], // List of available connectors
  },
  { _id: false }
);

// Specification Schema
const specificationSchema = new mongoose.Schema(
  {
    cpu: {
      manufacturer: String,
      cores: Number,
      threads: Number,
      baseClock: Number,
      boostClock: Number,
      socket: String,
      cache: String,
    },
    gpu: {
      manufacturer: String,
      vram: Number,
      vramType: String,
      coreClock: Number,
      memoryClock: Number,
      interface: String,
    },
    ram: ramSchema, // Embedded RAM schema
    motherboard: {
      manufacturer: String,
      socket: String,
      chipset: String,
      formFactor: String,
      memorySlots: Number,
      storageInterfaces: String,
    },
    storage: storageSchema, // Embedded Storage schema
    desktopCase: {
      brand: String,
      formFactor: String,
      material: String,
    },
    psu: powerSupplySchema, // Embedded Power Supply schema
  },
  { _id: false }
);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["cpu", "gpu", "ram", "motherboard", "storage", "psu"] },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: String,
  specifications: specificationSchema, // Embedding specifications
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
