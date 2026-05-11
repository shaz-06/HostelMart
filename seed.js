/**
 * seed.js
 * Script to seed sample test product data into MongoDB Atlas.
 */

const connectDB = require('./lib/mongodb');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: "Classic Leather Sneakers",
    description: "Premium leather sneakers for everyday comfort and style.",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800",
    price: 2499,
    stock: 50
  },
  {
    name: "Cotton Crewneck T-Shirt",
    description: "Soft, breathable 100% cotton T-shirt in multiple colors.",
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    price: 699,
    stock: 100
  },
  {
    name: "Minimalist Watch",
    description: "Elegant watch with a stainless steel strap and sapphire glass.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    price: 3999,
    stock: 25
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "High-fidelity audio with active noise cancellation technology.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    price: 12999,
    stock: 15
  }
];

async function seedData() {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Existing products cleared.');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('🌱 Sample products seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
