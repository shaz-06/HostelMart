const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const brandsList = ["Philips", "Syska", "Havells", "Scotch", "Gala", "Home Puff", "Solimo", "IKEA", "Eveready", "Pigeon"];

const typesList = [
    { type: "Extension Boards", materials: ["Plastic", "Metal"], powerSources: ["Electrical"], colors: ["White", "Black", "Grey"] },
    { type: "LED Bulbs", materials: ["Plastic"], powerSources: ["Electrical", "Rechargeable"], colors: ["White"] },
    { type: "Emergency Lights", materials: ["Plastic", "Metal"], powerSources: ["Rechargeable", "Battery"], colors: ["White", "Red", "Blue"] },
    { type: "Room Fresheners", materials: ["Metal", "Plastic"], powerSources: ["None", "Battery"], colors: ["Transparent"] },
    { type: "Door Mats", materials: ["Rubber", "Fabric"], powerSources: ["None"], colors: ["Grey", "Black", "Blue", "Red"] },
    { type: "Wall Hooks", materials: ["Plastic", "Metal"], powerSources: ["None"], colors: ["White", "Transparent"] },
    { type: "Cloth Clips", materials: ["Plastic", "Wood"], powerSources: ["None"], colors: ["Blue", "Red", "Green"] },
    { type: "Tape & Adhesives", materials: ["Plastic", "Rubber"], powerSources: ["None"], colors: ["Transparent", "White"] },
    { type: "Mini Tool Kits", materials: ["Metal", "Plastic"], powerSources: ["None"], colors: ["Black", "Red"] },
    { type: "Storage Hooks", materials: ["Metal", "Plastic"], powerSources: ["None"], colors: ["White", "Grey"] },
    { type: "Rechargeable Torches", materials: ["Plastic", "Metal"], powerSources: ["Rechargeable", "Battery"], colors: ["Black", "Blue", "Red"] },
    { type: "Mosquito Bats", materials: ["Plastic"], powerSources: ["Rechargeable"], colors: ["Yellow", "Red", "Blue"] },
    { type: "Alarm Clocks", materials: ["Plastic", "Wood"], powerSources: ["Battery", "Electrical"], colors: ["Black", "White", "Grey"] },
    { type: "Dustbins", materials: ["Plastic", "Metal"], powerSources: ["None"], colors: ["Blue", "Green", "Black", "Grey"] },
    { type: "Utility Organizers", materials: ["Plastic", "Fabric", "Silicone"], powerSources: ["None"], colors: ["White", "Transparent", "Grey"] }
];

const generateUtilityProducts = () => {
    const products = [];
    let idCounter = 1;

    for (const t of typesList) {
        // Generate 4 products per type to get 60 total (exceeds min 50)
        for (let i = 0; i < 4; i++) {
            const brand = brandsList[Math.floor(Math.random() * brandsList.length)];
            const material = t.materials[Math.floor(Math.random() * t.materials.length)];
            const powerSource = t.powerSources[Math.floor(Math.random() * t.powerSources.length)];
            const color = t.colors[Math.floor(Math.random() * t.colors.length)];
            
            const name = `${brand} ${t.type} - ${color} (${material})`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            // Random pricing for typical home utility items
            const price = 99 + Math.floor(Math.random() * 800);
            const originalPrice = Math.floor(price * 1.50);
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `Essential ${t.type.toLowerCase()} by ${brand}. Made of high-quality ${material}. Designed for everyday hostel and student needs. Power source: ${powerSource}. Highly durable and affordable.`,
                category: "Hostel & Student Essentials",
                subcategory: "Home Utility",
                section: "Daily Use Essentials",
                type: t.type,
                material,
                powerSource,
                colors: [color],
                image: `https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 1500}`,
                images: [`https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 1500}`],
                price,
                originalPrice,
                discount,
                stock: 30 + Math.floor(Math.random() * 200),
                rating: 3.8 + (Math.random() * 1.1),
                ratingsCount: 40 + Math.floor(Math.random() * 500),
                featured: i % 2 === 0,
                trending: i % 3 === 0,
                highlights: [
                    "Durable Quality",
                    "Perfect for Hostels",
                    `Material: ${material}`,
                    `Brand: ${brand}`
                ],
                createdAt: new Date()
            });
            idCounter++;
        }
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const targetTypes = typesList.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Hostel & Student Essentials", 
            subcategory: "Home Utility",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing Home Utility products cleared.`);

        const utilityProducts = generateUtilityProducts();
        await Product.insertMany(utilityProducts);
        console.log(`🌱 ${utilityProducts.length} Home Utility products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
