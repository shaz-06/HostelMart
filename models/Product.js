/**
 * /models/Product.js
 * Mongoose schema for Products in HostelMart.
 */

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug.'],
    unique: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand.'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this product.'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category for this product.'],
  },
  subcategory: {
    type: String,
  },
  section: {
    type: String,
  },
  material: {
    type: String,
  },
  capacity: {
    type: String,
  },
  colors: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    required: [true, 'Please provide a primary image URL.'],
  },
  images: {
    type: [String],
    default: []
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this product.'],
  },
  originalPrice: {
    type: Number,
  },
  discount: {
    type: String,
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock count.'],
    default: 0,
  },
  rating: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
