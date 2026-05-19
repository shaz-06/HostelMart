const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Mi", "Ambrane", "boAt", "Realme", "Anker", "Portronics", "Redmi", "Samsung", "Urbn", "Syska"];

const powerBankTypes = [
    { type: "Fast Charging Power Bank", description: "Ultra-fast charging power bank with high-density batteries." },
    { type: "Wireless Power Bank", description: "Convenient wireless charging on the go with MagSafe support." },
    { type: "Slim Power Bank", description: "Pocket-sized slim power bank, perfect for daily commutes." },
    { type: "High Capacity Power Bank", description: "Massive capacity to keep all your devices powered for days." },
    { type: "Mini Power Bank", description: "Compact mini power bank that fits in your palm." },
    { type: "MagSafe Power Bank", description: "Magnetic snap-on power bank optimized for the latest iPhones." },
    { type: "Solar Power Bank", description: "Eco-friendly solar-powered bank for outdoor adventures." },
    { type: "Gaming Power Bank", description: "High-output power bank designed for gaming smartphones." },
    { type: "Dual Output Power Bank", description: "Charge two devices at once with balanced power distribution." },
    { type: "Laptop Compatible Power Bank", description: "65W+ output to charge laptops and high-demand devices." }
];

const capacities = ["10000mAh", "20000mAh", "30000mAh", "5000mAh", "12000mAh"];
const speeds = ["10W", "18W", "20W", "22.5W", "33W", "45W", "65W"];
const ports = ["1 USB-A, 1 USB-C", "2 USB-A, 1 USB-C", "1 USB-C", "2 USB-A", "2 USB-C"];
const colorList = ["Midnight Black", "Arctic White", "Ocean Blue", "Space Grey", "Crimson Red"];

const powerBankImages = [
    "https://images.unsplash.com/photo-1609091839697-eb211ff6d313?q=80&w=800&auto=format&fit=crop", // Black power bank
    "https://images.unsplash.com/photo-1619130771181-2292f7461937?q=80&w=800&auto=format&fit=crop", // Charging context
    "https://images.unsplash.com/photo-1625232490807-6c043003058c?q=80&w=800&auto=format&fit=crop", // Tech stack
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop", // Hands on
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop", // Detail shot
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", // Lifestyle
    "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800&auto=format&fit=crop", // Outdoor
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=800&auto=format&fit=crop"  // Professional
];

const generatePowerBanks = () => {
    const products = [];
    for (let i = 1; i <= 40; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const typeObj = powerBankTypes[Math.floor(Math.random() * powerBankTypes.length)];
        const type = typeObj.type;
        
        const name = `${brand} ${type} ${i % 2 === 0 ? 'Turbo' : 'PowerX'}`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[&]/g, 'and') + '-' + i;
        
        const capacity = capacities[Math.floor(Math.random() * capacities.length)];
        const basePrice = capacity.includes("30000") ? 3000 : 
                         capacity.includes("20000") ? 2000 : 
                         capacity.includes("10000") ? 1000 : 800;
        
        const price = Math.floor(basePrice + Math.random() * (basePrice * 0.4));
        const originalPrice = Math.floor(price * (1.3 + Math.random() * 0.5));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const selectedColors = colorList.sort(() => 0.5 - Math.random()).slice(0, 2);
        const image = powerBankImages[Math.floor(Math.random() * powerBankImages.length)];
        
        const chargingSpeed = speeds[Math.floor(Math.random() * speeds.length)];
        const outputPorts = ports[Math.floor(Math.random() * ports.length)];
        const compatibility = "Universal (iOS, Android, Laptops)";

        products.push({
            name,
            slug,
            brand,
            description: `${typeObj.description} The ${name} by ${brand} offers a massive ${capacity} capacity with ${chargingSpeed} fast charging. Featuring ${outputPorts} for versatile connectivity.`,
            category: "Electronics & Tech",
            subcategory: "Mobiles",
            section: "Tech Essentials",
            type,
            batteryCapacity: capacity,
            chargingSpeed,
            outputPorts,
            compatibility,
            colors: selectedColors,
            image: image,
            images: [image, powerBankImages[(Math.floor(Math.random() * powerBankImages.length))]],
            price,
            originalPrice,
            discount,
            stock: 25 + Math.floor(Math.random() * 180),
            rating: 4.1 + (Math.random() * 0.8),
            ratingsCount: 60 + Math.floor(Math.random() * 4500),
            featured: i % 9 === 0,
            trending: i % 5 === 0,
            highlights: [
                `${capacity} High Density Battery`,
                `${chargingSpeed} Fast Charging Support`,
                `${outputPorts} Output Options`,
                "Advanced Safety Protection Layer",
                "Flight-Friendly Design"
            ],
            specifications: {
                "Model Name": `PB-${brand}-${i}`,
                "Battery Type": "Lithium Polymer",
                "Input": "Type-C / Micro-USB",
                "Weight": "Varies by capacity",
                "Warranty": "1 Year Limited Warranty"
            },
            createdAt: new Date()
        });
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const deleted = await Product.deleteMany({ section: "Tech Essentials", type: { $regex: /Power Bank/i } });
        console.log(`🗑️ ${deleted.deletedCount} existing power bank products cleared.`);

        const powerBanks = generatePowerBanks();
        await Product.insertMany(powerBanks);
        console.log(`🌱 ${powerBanks.length} Power Bank products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
