const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const lampBrands = ["Philips", "Wipro", "Syska", "Havells", "Mi", "Portronics", "Bajaj", "Eveready", "Zebronics", "Murphy"];

const lampTypes = [
    { type: "LED Desk Lamps", brightness: ["3 Levels", "5 Levels", "Stepless Dimmable"], powers: ["Direct AC", "Dual (AC & Battery)"], backups: ["No Battery", "Up to 3 Hours", "Up to 5 Hours"] },
    { type: "Rechargeable LED Lamps", brightness: ["3 Levels", "Stepless Dimmable"], powers: ["Rechargeable Battery"], backups: ["Up to 5 Hours", "Up to 8 Hours", "Up to 12 Hours"] },
    { type: "Emergency LED Lamps", brightness: ["Single Level", "3 Levels"], powers: ["Dual (AC & Battery)", "Rechargeable Battery"], backups: ["Up to 5 Hours", "Up to 8 Hours", "Up to 12 Hours"] },
    { type: "Touch Control Lamps", brightness: ["3 Levels", "Stepless Dimmable"], powers: ["USB Powered", "Rechargeable Battery"], backups: ["Up to 3 Hours", "Up to 5 Hours", "No Battery"] },
    { type: "Clip-On Study Lamps", brightness: ["3 Levels"], powers: ["Rechargeable Battery", "USB Powered"], backups: ["Up to 3 Hours", "Up to 5 Hours", "No Battery"] },
    { type: "Smart LED Lamps", brightness: ["Stepless Dimmable"], powers: ["Direct AC"], backups: ["No Battery"] },
    { type: "RGB LED Lamps", brightness: ["5 Levels", "Stepless Dimmable"], powers: ["USB Powered", "Direct AC"], backups: ["No Battery", "Up to 3 Hours"] },
    { type: "Foldable LED Lamps", brightness: ["3 Levels", "5 Levels"], powers: ["Rechargeable Battery", "USB Powered"], backups: ["Up to 3 Hours", "Up to 5 Hours", "No Battery"] },
    { type: "USB Powered Lamps", brightness: ["Single Level", "3 Levels"], powers: ["USB Powered"], backups: ["No Battery"] },
    { type: "Bedside LED Lamps", brightness: ["3 Levels", "Stepless Dimmable"], powers: ["Direct AC", "Rechargeable Battery"], backups: ["No Battery", "Up to 8 Hours"] }
];

const availableColors = ["White", "Black", "Grey", "Blue", "Pink"];

const generateLamps = () => {
    const products = [];
    let idCounter = 1;

    for (const t of lampTypes) {
        // Generate 4 products per type to get 40 total (exceeds min 35)
        for (let i = 0; i < 4; i++) {
            const brand = lampBrands[Math.floor(Math.random() * lampBrands.length)];
            const brightnessLevels = t.brightness[Math.floor(Math.random() * t.brightness.length)];
            const powerSource = t.powers[Math.floor(Math.random() * t.powers.length)];
            const batteryBackup = t.backups[Math.floor(Math.random() * t.backups.length)];
            const color = availableColors[Math.floor(Math.random() * availableColors.length)];
            
            const name = `${brand} ${t.type} - ${color}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            // Random pricing for LED lamps
            const price = 299 + Math.floor(Math.random() * 2000);
            const originalPrice = Math.floor(price * 1.45); // 45% markup for discount
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `Illuminate your space with the ${brand} ${t.type}. Designed for maximum eye comfort and utility, featuring ${brightnessLevels} brightness control and reliable ${powerSource} power.`,
                category: "Hostel & Student Essentials",
                subcategory: "Home Utility",
                section: "Daily Use Essentials",
                type: t.type,
                brightnessLevels,
                powerSource,
                batteryBackup,
                colorTemperature: "Warm/Cool White",
                connectivity: t.type === "Smart LED Lamps" ? "Wi-Fi & Bluetooth" : "None",
                colors: [color],
                image: `https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 2500}`,
                images: [`https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 2500}`],
                price,
                originalPrice,
                discount,
                stock: 15 + Math.floor(Math.random() * 150),
                rating: 4.0 + (Math.random() * 0.9),
                ratingsCount: 60 + Math.floor(Math.random() * 900),
                featured: i % 2 === 0,
                trending: i % 3 === 0,
                highlights: [
                    `${brightnessLevels}`,
                    `Power: ${powerSource}`,
                    `Backup: ${batteryBackup}`,
                    "Eye Comfort Technology"
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

        const targetTypes = lampTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Hostel & Student Essentials", 
            subcategory: "Home Utility",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing LED Lamp products cleared.`);

        const lampProducts = generateLamps();
        await Product.insertMany(lampProducts);
        console.log(`🌱 ${lampProducts.length} LED Lamp products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
