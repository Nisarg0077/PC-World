const mongoose = require('mongoose');
const { Schema } = mongoose;

const accessorySpecSchema = new Schema({
  type: {
    type: String,
    enum: ['Keyboard', 'Mouse', 'Headset', 'Monitor', 'Webcam', 'Speaker', 'Other'],
    required: true
  },
  interface: { type: String },
  compatibility: [String],
  dimensions: String,
  weight: Number,
  features: [String],
  keyboard: {
    switchType: String,
    layout: String,
    keyCount: Number,
    backlit: Boolean
  },
  mouse: {
    dpi: Number,
    buttons: Number,
    sensorType: String
  },
  headset: {
    driverSize: Number,
    frequencyResponse: String,
    microphone: Boolean
  },
  monitor: {
    screenSize: Number,
    resolution: String,
    refreshRate: Number,
    panelType: String
  }
}, { _id: false });

const accessorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['Peripherals', 'Audio', 'Display', 'Networking', 'Storage', 'Other'],
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  specifications: accessorySpecSchema,
  images: [{
    url: String,
    caption: String
  }],
  stock: {
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    sku: {
      type: String,
      unique: true,
      required: true
    }
  }, // Fixed closing bracket for stock object
  features: [String],
  compatibility: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  isFeatured: {
    type: Boolean,
    default: false
  }
});

// Indexes
accessorySchema.index({ name: 'text', description: 'text' });
accessorySchema.index({ brand: 1, category: 1 });
accessorySchema.index({ price: 1 });

accessorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Accessory', accessorySchema);