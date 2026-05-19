const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const chopperProducts = [];

const brands = ["Pigeon", "Prestige", "Borosil", "Home Puff", "Cello", "Ganesh", "Butterfly", "Solimo"];
const types = [
    "Vegetable Choppers", "Manual Choppers", "Push Choppers", 
    "Pull Cord Choppers", "Electric Choppers", "Mini Choppers", 
    "Multi-Blade Choppers", "Onion Choppers", "Food Processor Choppers", 
    "Multipurpose Choppers"
];
const bladeMaterials = ["Stainless Steel", "Hardened Steel", "High-Carbon Steel", "Rust-Proof Steel"];
const operationTypes = ["Manual (Pull Cord)", "Manual (Push)", "Electric", "Manual (Twist)"];
const capacities = ["250ml", "350ml", "500ml", "650ml", "900ml", "1L"];

for (let i = 1; i <= 35; i++) {
    const brand = brands[i % brands.length];
    const type = types[i % types.length];
    const bladeMaterial = bladeMaterials[i % bladeMaterials.length];
    const operationType = operationTypes[i % operationTypes.length];
    const capacity = capacities[i % capacities.length];
    const price = 250 + Math.floor(Math.random() * 1800);
    const originalPrice = price + Math.floor(Math.random() * 500);
    const discount = Math.floor(((originalPrice - price) / originalPrice) * 100) + "% OFF";

    chopperProducts.push({
        name: `${brand} ${type} with ${bladeMaterial} Blades`,
        slug: `${brand.toLowerCase()}-${type.toLowerCase().replace(/ /g, '-')}-${i}`,
        brand: brand,
        description: `Efficient ${type} from ${brand}. Features high-quality ${bladeMaterial} blades for precision chopping. ${operationType} operation makes it easy to use for all your kitchen needs. Ideal for chopping vegetables, fruits, and nuts in seconds.`,
        category: "Home",
        subcategory: "Kitchen & Appliances",
        section: "Daily Use Essentials",
        type: type,
        bladeMaterial: bladeMaterial,
        capacity: capacity,
        operationType: operationType,
        colors: ["Green", "White", "Red", "Blue", "Black"].slice(0, 1 + Math.floor(Math.random() * 3)),
        image: `https://images.unsplash.com/photo-${1550989460 + i}-0adf9ea622e2?auto=format&fit=crop&w=800&q=80`,
        price: price,
        originalPrice: originalPrice,
        discount: discount,
        stock: 40 + Math.floor(Math.random() * 150),
        rating: 3.9 + (Math.random() * 1.0),
        featured: Math.random() > 0.8,
        trending: Math.random() > 0.7,
        createdAt: new Date()
    });
}

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Clear existing choppers to avoid duplicates if re-running
        await Product.deleteMany({ subcategory: "Kitchen & Appliances", type: { $in: types } });

        await Product.insertMany(chopperProducts);
        console.log(`🌱 ${chopperProducts.length} Chopper products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
