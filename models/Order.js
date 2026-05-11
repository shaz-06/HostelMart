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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
    price: Number,
    name: String,
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online', 'UPI'],
    default: 'COD',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
