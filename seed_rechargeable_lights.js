const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const rlBrands = ["Philips", "Wipro", "Syska", "Havells", "Eveready", "Bajaj", "Mi", "Portronics", "Murphy", "DP"];

const rlTypes = [
    { type: "Rechargeable Emergency Lights", capacity: "4000mAh", charging: ["Type-C", "Direct AC Plug"], backups: ["Up to 10 Hours", "Up to 15 Hours"], brightness: ["3 Levels", "Dual Level"] },
    { type: "LED Rechargeable Lamps", capacity: "2000mAh", charging: ["Micro USB", "Type-C"], backups: ["Up to 6 Hours", "Up to 10 Hours"], brightness: ["3 Levels", "Stepless Dimmable"] },
    { type: "USB Rechargeable Lights", capacity: "1200mAh", charging: ["Micro USB"], backups: ["Up to 4 Hours", "Up to 6 Hours"], brightness: ["Single Level", "Dual Level"] },
    { type: "Portable Rechargeable Lanterns", capacity: "3000mAh", charging: ["Type-C", "Solar & AC"], backups: ["Up to 10 Hours", "Up to 24 Hours"], brightness: ["Stepless Dimmable"] },
    { type: "Study Rechargeable Lights", capacity: "2500mAh", charging: ["Type-C", "Micro USB"], backups: ["Up to 6 Hours", "Up to 10 Hours"], brightness: ["3 Levels"] },
    { type: "Motion Sensor Lights", capacity: "800mAh", charging: ["Micro USB"], backups: ["Up to 24 Hours"], brightness: ["Single Level"] },
    { type: "Camping Rechargeable Lights", capacity: "5000mAh", charging: ["Type-C", "Solar & AC"], backups: ["Up to 15 Hours", "Up to 24 Hours"], brightness: ["Dual Level", "3 Levels"] },
    { type: "Foldable Rechargeable Lamps", capacity: "2000mAh", charging: ["Type-C"], backups: ["Up to 6 Hours", "Up to 10 Hours"], brightness: ["3 Levels"] },
    { type: "Wall Mounted Rechargeable Lights", capacity: "1500mAh", charging: ["Micro USB", "Direct AC Plug"], backups: ["Up to 6 Hours"], brightness: ["Dual Level"] },
    { type: "Multi-Brightness Emergency Lights", capacity: "3600mAh", charging: ["Type-C", "Direct AC Plug"], backups: ["Up to 10 Hours", "Up to 15 Hours"], brightness: ["Stepless Dimmable", "3 Levels"] }
];

const availableColors = ["White", "Black", "Red", "Blue", "Yellow"];

const generateRechargeableLights = () => {
    const products = [];
    let idCounter = 1;

    for (const t of rlTypes) {
        // Generate 4 products per type to get 40 total (exceeds min 30)
        for (let i = 0; i < 4; i++) {
            const brand = rlBrands[Math.floor(Math.random() * rlBrands.length)];
            const batteryBackup = t.backups[Math.floor(Math.random() * t.backups.length)];
            const chargingType = t.charging[Math.floor(Math.random() * t.charging.length)];
            const brightnessLevels = t.brightness[Math.floor(Math.random() * t.brightness.length)];
            const color = availableColors[Math.floor(Math.random() * availableColors.length)];
            
            const name = `${brand} ${t.type} - ${batteryBackup} Backup (${color})`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            // Random pricing for rechargeable lights
            const price = 350 + Math.floor(Math.random() * 1500);
            const originalPrice = Math.floor(price * 1.50); // 50% markup for discount
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `Stay illuminated with the ${brand} ${t.type}. It boasts a high-capacity ${t.capacity} battery yielding ${batteryBackup} of power. Featuring ${chargingType} charging and ${brightnessLevels} brightness control. Perfect for hostels and emergencies.`,
                category: "Hostel & Student Essentials",
                subcategory: "Home Utility",
                section: "Daily Use Essentials",
                type: t.type,
                batteryCapacity: t.capacity,
                chargingType,
                batteryBackup,
                brightnessLevels,
                powerSource: "Rechargeable Battery",
                colors: [color],
                image: `https://images.unsplash.com/photo-1592859600972-1b0834d83747?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 3000}`,
                images: [`https://images.unsplash.com/photo-1592859600972-1b0834d83747?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 3000}`],
                price,
                originalPrice,
                discount,
                stock: 25 + Math.floor(Math.random() * 150),
                rating: 4.1 + (Math.random() * 0.8),
                ratingsCount: 90 + Math.floor(Math.random() * 600),
                featured: i % 2 === 0,
                trending: i % 3 === 0,
                highlights: [
                    `${batteryBackup} Backup`,
                    `${t.capacity} Battery`,
                    `${chargingType} Charging`,
                    `${brightnessLevels}`
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

        const targetTypes = rlTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Hostel & Student Essentials", 
            subcategory: "Home Utility",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing Rechargeable Light products cleared.`);

        const lightProducts = generateRechargeableLights();
        await Product.insertMany(lightProducts);
        console.log(`🌱 ${lightProducts.length} Rechargeable Light products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
