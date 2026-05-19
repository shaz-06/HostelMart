/**
 * /models/Review.js
 * Mongoose schema for Reviews in HostelMart.
 */

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userImage: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  verifiedPurchase: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
