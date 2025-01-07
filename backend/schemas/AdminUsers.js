const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
        unique: true, // Make sure this is unique
      },
      phone: {
        type: String,
      },
      address: {
        street: {
          type: String,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
        postalCode: {
          type: String,
        },
      },
      role: {
        type: String,
        enum: ['admin'],
        default: 'admin',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );
  
// Pre-save hook to update the `updatedAt` field
adminUserSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;
