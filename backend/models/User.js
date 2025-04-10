// const mongoose = require('mongoose');

// const addressSchema = new mongoose.Schema({
//   building: { type: String, trim: true },
//   street: { type: String, trim: true },
//   city: { type: String, trim: true },
//   state: { type: String, trim: true },
//   pinCode: { type: String, trim: true },
// });

// const officeAddressSchema = new mongoose.Schema({
//   officeBuilding: { type: String, trim: true },
//   officeStreet: { type: String, trim: true },
//   officeCity: { type: String, trim: true },
//   officeState: { type: String, trim: true },
//   officePinCode: { type: String, trim: true },
// });

// const userSchema = new mongoose.Schema({
//   username: { type: String, unique: true, required: true, trim: true },
//   password: { type: String, required: true },
//   firstName: { type: String, trim: true, required: true },
//   lastName: { type: String, trim: true, required: true },
//   dob: { type: Date, required: true },
//   gender: { type: String, trim: true, enum: ['male', 'female', 'other'], required: true },
//   phoneNumber: { type: String, match: /^[0-9]{10}$/, required: true }, // Ensures valid phone number format
//   designation: { type: String, trim: true, required: true },
//   jobProfile: { type: String, trim: true, required: true },
//   orgName: { type: String, trim: true, required: true },
//   officeAddress: officeAddressSchema, // Embedded office address
//   email: { type: String, unique: true, required: true, lowercase: true, trim: true },
//   address: addressSchema, // Embedded residential address
//   aadharNumber: { type: String, unique: true, required: true, trim: true },
//   aadharFront: { type: String }, // Store file paths or URLs
//   aadharBack: { type: String }, // Store file paths or URLs
//   role: { type: String, enum: ['admin', 'seller', 'client'], default: 'client' },
//   isActive: { type: Boolean, default: true },
//   isDeleted: { type: Boolean, default: false }, // Soft delete flag
// }, { timestamps: true }); // Adds createdAt & updatedAt automatically

// module.exports = mongoose.model('User', userSchema);





const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  building: { type: String, trim: true },
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  pinCode: { type: String, trim: true },
});


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, trim: true, enum: ['male', 'female', 'other'], required: true },
  phoneNumber: { type: String, match: /^[0-9]{10}$/, required: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  address: addressSchema, 
  role: { type: String, enum: ['admin', 'seller', 'client'], default: 'client' },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);