const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const kettleBrands = ["Prestige", "Pigeon", "Philips", "Havells", "Butterfly", "Bajaj", "Milton", "Lifelong"];
const kettleTypes = [
    "Stainless Steel Electric Kettles", "Glass Electric Kettles", "Travel Electric Kettles", 
    "Fast Boil Kettles", "Temperature Control Kettles", "Auto Shut-Off Kettles", 
    "Cordless Electric Kettles", "Compact Hostel Kettles", "Multi-Purpose Kettles", 
    "Smart Electric Kettles"
];

const kettleMaterials = ["Stainless Steel", "Borosilicate Glass", "Plastic (BPA-Free)", "Double-Wall Metal"];
const kettleCapacities = ["0.5L", "1.0L", "1.2L", "1.5L", "1.7L", "2.0L"];
const kettlePowers = ["600W", "1000W", "1200W", "1500W", "1800W", "2000W"];

const generateKettles = () => {
    const products = [];
    for (let i = 1; i <= 35; i++) {
        const brand = kettleBrands[Math.floor(Math.random() * kettleBrands.length)];
        const type = kettleTypes[Math.floor(Math.random() * kettleTypes.length)];
        const material = kettleMaterials[Math.floor(Math.random() * kettleMaterials.length)];
        const capacity = kettleCapacities[Math.floor(Math.random() * kettleCapacities.length)];
        const power = kettlePowers[Math.floor(Math.random() * kettlePowers.length)];
        
        const name = `${brand} ${type} - ${capacity}, ${power}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const price = 600 + Math.floor(Math.random() * 2500);
        const originalPrice = Math.floor(price * 1.3);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

        products.push({
            name,
            slug,
            brand,
            description: `Boil water in minutes with the ${brand} ${type}. Features a ${capacity} capacity and ${power} power for high efficiency. Made with high-quality ${material}, it includes auto shut-off and boil-dry protection for safety. Perfect for making tea, coffee, and instant noodles in your hostel room.`,
            category: "Hostel & Student Essentials",
            subcategory: "Kitchen & Appliances",
            section: "Daily Use Essentials",
            type,
            capacity,
            powerConsumption: power,
            material,
            warranty: "1 Year Manufacturer Warranty",
            colors: ["Silver", "Black", "Red", "Blue", "White"].slice(0, 1 + Math.floor(Math.random() * 2)),
            image: `https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?auto=format&fit=crop&w=800&q=80&sig=${i}`,
            images: [`https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?auto=format&fit=crop&w=800&q=80&sig=${i}`],
            price,
            originalPrice,
            discount,
            stock: 20 + Math.floor(Math.random() * 100),
            rating: 3.8 + (Math.random() * 1.2),
            featured: i % 7 === 0,
            trending: i % 10 === 0,
            createdAt: new Date()
        });
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const typesToClear = kettleTypes;
        await Product.deleteMany({ subcategory: "Kitchen & Appliances", type: { $in: typesToClear } });
        console.log("🗑️ Existing kettle products cleared.");

        const kettles = generateKettles();
        await Product.insertMany(kettles);
        console.log(`🌱 ${kettles.length} Electric Kettle products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
