/**
 * /models/Order.js
 * Mongoose schema for Orders in HostelMart.
 */

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String, // Can be phone number or ObjectId string
    required: [true, 'User ID is required'],
  },
  products: [{
    productId: {
      type: String, // Storing slug or _id as string for flexibility
    },
    quantity: Number,
    price: Number,
    name: String,
    image: String,
    size: String
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: 'COD',
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
  },
  orderStatus: {
    type: String,
    default: 'Processing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
