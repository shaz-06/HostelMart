const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const containerProducts = [];

const brands = ["Milton", "Cello", "Borosil", "Tupperware", "Signoraware", "Solimo", "Home Puff", "Pigeon"];
const types = [
    "Food Storage Containers", "Airtight Containers", "Steel Containers", 
    "Plastic Containers", "Glass Containers", "Spice Containers", 
    "Lunch Storage Containers", "Microwave Safe Containers", 
    "Stackable Containers", "Multi-Container Sets"
];
const materials = ["Stainless Steel", "BPA-Free Plastic", "Borosilicate Glass", "Food-Grade Silicone", "Aluminium"];
const lidTypes = ["Airtight", "Clip-on", "Screw-top", "Press-fit", "Flip-top"];
const capacities = ["250ml", "500ml", "750ml", "1L", "1.5L", "2L", "Set of 3", "Set of 6", "Set of 12"];

for (let i = 1; i <= 40; i++) {
    const brand = brands[i % brands.length];
    const type = types[i % types.length];
    const material = materials[i % materials.length];
    const lidType = lidTypes[i % lidTypes.length];
    const capacity = capacities[i % capacities.length];
    const price = 150 + Math.floor(Math.random() * 1500);
    const originalPrice = price + Math.floor(Math.random() * 400);
    const discount = Math.floor(((originalPrice - price) / originalPrice) * 100) + "% OFF";

    containerProducts.push({
        name: `${brand} ${type} - ${material} (${capacity})`,
        slug: `${brand.toLowerCase()}-${type.toLowerCase().replace(/ /g, '-')}-${i}`,
        brand: brand,
        description: `Premium ${type} from ${brand}. Made of high-quality ${material} with a secure ${lidType} lid. Ideal for keeping food fresh for longer periods. ${type.includes("Microwave") ? "Completely microwave safe for convenient heating." : ""} ${type.includes("Stackable") ? "Space-saving stackable design." : ""}`,
        category: "Home",
        subcategory: "Kitchen & Appliances",
        section: "Daily Use Essentials",
        type: type,
        material: material,
        capacity: capacity,
        lidType: lidType,
        colors: ["Clear", "Blue", "Red", "Green", "Pink"].slice(0, 1 + Math.floor(Math.random() * 3)),
        image: `https://images.unsplash.com/photo-${1584263347416 + i}-85a696b4eda7?auto=format&fit=crop&w=800&q=80`,
        price: price,
        originalPrice: originalPrice,
        discount: discount,
        stock: 50 + Math.floor(Math.random() * 200),
        rating: 3.8 + (Math.random() * 1.2),
        featured: Math.random() > 0.8,
        trending: Math.random() > 0.7,
        createdAt: new Date()
    });
}

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Note: We don't clear existing kitchen products here, we just add containers.
        // Or if we want to be safe and avoid duplicates if re-run:
        await Product.deleteMany({ subcategory: "Kitchen & Appliances", type: { $in: types } });

        await Product.insertMany(containerProducts);
        console.log(`🌱 ${containerProducts.length} Container products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
