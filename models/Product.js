/**
 * /models/Product.js
 * Mongoose schema for Products in HostelMart.
 */

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
    maxlength: [200, 'Name cannot be more than 200 characters'],
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
  subCategory: {
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
  compartments: {
    type: String,
  },
  laptopCompatibility: {
    type: String,
  },
  waterproof: {
    type: String,
  },
  usbCharging: {
    type: String,
  },
  antiTheft: {
    type: String,
  },
  storageCapacity: {
    type: String,
  },
  foldable: {
    type: Boolean,
    default: false,
  },
  assemblyRequired: {
    type: Boolean,
    default: false,
  },
  weightCapacity: {
    type: String,
  },
  size: {
    type: String,
  },
  washable: {
    type: String,
  },
  dimensions: {
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
  batteryBackup: {
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
  chargingType: {
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
  socketCount: {
    type: String,
  },
  cableLength: {
    type: String,
  },
  powerRating: {
    type: String,
  },
  usbPorts: {
    type: String,
  },
  surgeProtection: {
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
  speed: {
    type: String,
  },
  remoteRange: {
    type: String,
  },
  ageGroup: {
    type: String,
  },
  batteryRequired: {
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
  rulingType: {
    type: String,
  },
  bindingType: {
    type: String,
  },
  paperQuality: {
    type: String,
  },
  skinType: {
    type: String,
  },
  hairType: {
    type: String,
  },
  processor: {
    type: String,
  },
  graphicsCard: {
    type: String,
  },
  ram: {
    type: String,
  },
  storage: {
    type: String,
  },
  display: {
    type: String,
  },
  refreshRate: {
    type: String,
  },
  operatingSystem: {
    type: String,
  },
  ports: {
    type: String,
  },
  keyboardType: {
    type: String,
  },
  coolingSystem: {
    type: String,
  },
  aiFeatures: {
    type: String,
  },
  rearCamera: {
    type: String,
  },
  frontCamera: {
    type: String,
  },
  camera: {
    type: String,
  },
  fingerprintType: {
    type: String,
  },
  warranty: {
    type: String,
  },
  colors: {
    type: [String],
    default: []
  },
  color: {
    type: String,
  },
  gender: {
    type: String,
  },
  soleType: {
    type: String,
  },
  closureType: {
    type: String,
  },
  ankleType: {
    type: String,
  },
  sportType: {
    type: String,
  },
  cushioning: {
    type: String,
  },
  sizeOptions: {
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
  oldPrice: {
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
  reviews: {
    type: Number,
    default: 0
  },
  highlights: {
    type: [String],
    default: []
  },
  badge: {
    type: String,
  },
  tags: {
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
