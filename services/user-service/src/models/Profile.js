const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: addressSchema,
  avatar: {
    type: String,
    default: 'default.jpg'
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
