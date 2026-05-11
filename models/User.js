/**
 * /models/User.js
 * Mongoose schema for Users in HostelMart.
 */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number.'],
    unique: true,
  },
  hostel: {
    type: String,
    default: '',
  },
  roomNumber: {
    type: String,
    default: '',
  },
  cart: {
    type: Array,
    default: [],
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  }],
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
