const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zip: { type: String }, // US ZIP Code format
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'seller', 'client'], required: true },
  department: { type: String, enum: ['','Sales', 'Support', 'HR', 'IT', 'Marketing'] }, // Predefined departments
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  gender: { type: String, trim: true, enum: ['male', 'female', 'other'], required: false },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  phone: { type: String, match: /^[0-9]{10}$/ }, // Ensures valid phone number format
  address: [addressSchema], // Allows multiple addresses (optional)
  profilePicture: { type: String, default: 'default.jpg' }, // Stores image URL
  dateOfBirth: { type: Date },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }, // Soft delete flag
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

module.exports = mongoose.model('User', userSchema);