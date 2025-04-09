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
    speed: Number,
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
    connectivity: String,
    weight: String
  },
  { _id: false }
);

const preBuiltSpecSchema = new mongoose.Schema(
  {
    cpu: { type: String, required: true },
    gpu: { type: String, default: 'N/A'},
    ram: { type: String, required: true },
    storage: { type: String, required: true },
    motherboard: { type: String, required: true },
    psu: { type: String, required: true },
    case: { type: String, required: true },
  },
  { _id: false }
);

const pcCaseSchema = new mongoose.Schema({
    formFactor: { type: String, required: true }, // ATX, Micro-ATX, Mini-ITX
    material: { type: String, required: true },
    dimensions: { type: String, required: true }, // e.g., "450mm x 210mm x 470mm"
    weight: { type: Number, required: true }, // in kg
    fanSupport: { type: String, required: true }, // e.g., "3x 120mm front, 1x 120mm rear"
    radiatorSupport: { type: String, required: true }, // e.g., "Up to 360mm front, 240mm top"
    gpuClearance: { type: Number, required: true }, // in mm
    cpuCoolerClearance: { type: Number, required: true }, // in mm
    psuSupport: { type: String, required: true }, // e.g., "ATX, SFX"
  },{ _id: false });

const cpuCoolerSchema = new mongoose.Schema({
    coolerType: {type: String, enum: ["Air", "Liquid"], required: true}, // Air or Liquid
    fanSize: {type: String},
    rpm: {type: String, default: "N/A"},
    compatibility: {type: String, required: true},
    dimensions: {type: String, required: true},
    weight: {type: Number, required: true},
},{_id: false});
// Monitor Schema
const monitorSchema = new mongoose.Schema(
  {
    screenSize: { type: String, required: true },
    resolution: { type: String, required: true },
    refreshRate: { type: Number, default: 60 },
    panelType: { type: String, enum: ["IPS", "VA", "TN", "OLED"], required: true },
    responseTime: { type: Number },
    hdrSupport: { type: Boolean, default: false }, 
    adaptiveSync: { type: String, enum: ["G-Sync", "FreeSync", "None"]},
    ports: { type: [String] }, 
  },
  { _id: false }
);


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
    keyboard: keyboardSchema,
    mouse: mouseSchema,
    monitor: monitorSchema,
    pcCase: pcCaseSchema,
    cpuCooler: cpuCoolerSchema,
    preBuilt: preBuiltSpecSchema,
  },
  { _id: false }
);
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['cpu', 'gpu', 'ram', 'motherboard', 'storage', 'psu', 'keyboard', 'mouse', 'monitor', 'PC Case', 'cpu cooler', 'preBuilt'], 
      required: true 
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, required: true },
    views: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    specifications: specificationSchema,
    averageRating: {
      type: Number,
      default: 0,
    },    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },

);

// Ensure updatedAt updates automatically
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", productSchema);
