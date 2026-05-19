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
  size: {
    type: String,
  },
  lidType: {
    type: String,
  },
  type: {
    type: String,
  },
  bladeMaterial: {
    type: String,
  },
  handleMaterial: {
    type: String,
  },
  bladeLength: {
    type: String,
  },
  operationType: {
    type: String,
  },
  inkColor: {
    type: String,
  },
  tipSize: {
    type: String,
  },
  packSize: {
    type: String,
  },
  displayType: {
    type: String,
  },
  brightnessLevels: {
    type: String,
  },
  colorTemperature: {
    type: String,
  },
  powerSource: {
    type: String,
  },
  functions: {
    type: String,
  },
  pageCount: {
    type: String,
  },
  connectivity: {
    type: String,
  },
  battery: {
    type: String,
  },
  batteryLife: {
    type: String,
  },
  noiseCancellation: {
    type: String,
  },
  waterResistance: {
    type: String,
  },
  wattage: {
    type: String,
  },
  compatibility: {
    type: String,
  },
  powerConsumption: {
    type: String,
  },
  controlType: {
    type: String,
  },
  presetModes: {
    type: [String],
  },
  warranty: {
    type: String,
  },
  cableType: {
    type: String,
  },
  batteryCapacity: {
    type: String,
  },
  chargingSpeed: {
    type: String,
  },
  outputPorts: {
    type: String,
  },
  adjustability: {
    type: String,
  },
  dpi: {
    type: String,
  },
  switchType: {
    type: String,
  },
  backlight: {
    type: String,
  },
  flavor: {
    type: String,
  },
  weight: {
    type: String,
  },
  dietaryType: {
    type: String,
  },
  expiryDate: {
    type: String,
  },
  spiceLevel: {
    type: String,
  },
  volume: {
    type: String,
  },
  sugarType: {
    type: String,
  },
  usage: {
    type: String,
  },
  quantity: {
    type: String,
  },
  dosageForm: {
    type: String,
  },
  absorbency: {
    type: String,
  },
  fragrance: {
    type: String,
  },
  ingredients: {
    type: [String],
    default: []
  },
  skinType: {
    type: String,
  },
  hairType: {
    type: String,
  },
  warranty: {
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
  ratingsCount: {
    type: Number,
    default: 0
  },
  highlights: {
    type: [String],
    default: []
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  seller: {
    name: { type: String, default: 'HostelMart Official' },
    rating: { type: Number, default: 4.5 },
    isVerified: { type: Boolean, default: true }
  },
  returnPolicy: {
    type: String,
    default: '7 Days Return & Exchange'
  },
  deliveryDays: {
    type: Number,
    default: 2
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
