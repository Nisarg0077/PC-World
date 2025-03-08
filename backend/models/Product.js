// const mongoose = require("mongoose");

// // RAM Schema
// const ramSchema = new mongoose.Schema(
//   {
//     type: String,
//     speed: String,
//     capacity: Number,
//     modules: Number,
//     casLatency: String,
//   },
//   { _id: false }
// );

// // Storage Schema
// const storageSchema = new mongoose.Schema(
//   {
//     type: String,
//     interface: String,
//     capacity: String,
//     rpm: Number,
//   },
//   { _id: false }
// );

// // Power Supply Schema (PSU)
// const powerSupplySchema = new mongoose.Schema(
//   {
//     wattage: Number,
//     efficiencyRating: String,
//     modular: { type: Boolean, default: false }, // True for modular PSUs
//     connectors: [String], // List of available connectors
//   },
//   { _id: false }
// );

// // Accessory Schema
// const accessorySchema = new mongoose.Schema(
//   {
//     type: {
//       type: String,
//       enum: ["Keyboard", "Mouse", "Headset", "Monitor", "Webcam", "Speaker", "Other"],
//       required: true,
//     },
//     interface: String,
//     compatibility: [String],
//     dimensions: String,
//     weight: Number,
//     features: [String],
//     keyboard: {
//       switchType: String,
//       layout: String,
//       keyCount: Number,
//       backlit: Boolean,
//     },
//     mouse: {
//       dpi: Number,
//       buttons: Number,
//       sensorType: String,
//     },
//     headset: {
//       driverSize: Number,
//       frequencyResponse: String,
//       microphone: Boolean,
//     },
//     monitor: {
//       screenSize: Number,
//       resolution: String,
//       refreshRate: Number,
//       panelType: String,
//     },
//   },
//   { _id: false }
// );

// // Specification Schema
// const specificationSchema = new mongoose.Schema(
//   {
//     cpu: {
//       manufacturer: String,
//       cores: Number,
//       threads: Number,
//       baseClock: Number,
//       boostClock: Number,
//       socket: String,
//       cache: String,
//     },
//     gpu: {
//       manufacturer: String,
//       vram: Number,
//       vramType: String,
//       coreClock: Number,
//       memoryClock: Number,
//       interface: String,
//     },
//     ram: ramSchema, // Embedded RAM schema
//     motherboard: {
//       manufacturer: String,
//       socket: String,
//       chipset: String,
//       formFactor: String,
//       memorySlots: Number,
//       storageInterfaces: String,
//     },
//     storage: storageSchema, // Embedded Storage schema
//     desktopCase: {
//       brand: String,
//       formFactor: String,
//       material: String,
//     },
//     psu: powerSupplySchema, // Embedded Power Supply schema
//     accessory: accessorySchema, // Embedded Accessory schema
//   },
//   { _id: false }
// );

// // Product Schema
// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   category: { type: String, enum: ['cpu', 'gpu', 'ram', 'storage', 'keyboard', 'mouse', 'monitor'] },
//   brand: { type: String, required: true },
//   model: { type: String, required: true },
//   description: String,
//   price: { type: Number, required: true },
//   stock: { type: Number, default: 0 },
//   imageUrl: String,
//   specifications: specificationSchema, // Embedding specifications
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Product", productSchema);
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
    modular: { type: Boolean, default: false },
    connectors: [String], // List of available connectors
  },
  { _id: false }
);

// Keyboard Schema
const keyboardSchema = new mongoose.Schema(
  {
    switchType: String,
    layout: String,
    keyCount: Number,
    backlit: Boolean,
  },
  { _id: false }
);

// Mouse Schema
const mouseSchema = new mongoose.Schema(
  {
    dpi: Number,
    buttons: Number,
    sensorType: String,
  },
  { _id: false }
);

// Headset Schema
const headsetSchema = new mongoose.Schema(
  {
    driverSize: Number,
    frequencyResponse: String,
    microphone: Boolean,
  },
  { _id: false }
);

// Monitor Schema
const monitorSchema = new mongoose.Schema(
  {
    screenSize: Number,
    resolution: String,
    refreshRate: Number,
    panelType: String,
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
    ram: ramSchema,
    motherboard: {
      manufacturer: String,
      socket: String,
      chipset: String,
      formFactor: String,
      memorySlots: Number,
      storageInterfaces: String,
    },
    storage: storageSchema,
    desktopCase: {
      brand: String,
      formFactor: String,
      material: String,
    },
    psu: powerSupplySchema,

    // Global Accessories
    keyboard: keyboardSchema,
    mouse: mouseSchema,
    headset: headsetSchema,
    monitor: monitorSchema,
  },
  { _id: false }
);

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['cpu', 'gpu', 'ram', 'storage', 'keyboard', 'mouse', 'monitor', 'headset'], 
      required: true 
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, required: true },
    specifications: specificationSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }
);

// Ensure updatedAt updates automatically
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", productSchema);
