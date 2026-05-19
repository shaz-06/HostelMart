const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Apple", "Samsung", "OnePlus", "boAt", "Anker", "Portronics", "Mi", "Realme", "Belkin", "Ambrane"];

const chargerTypes = [
    { type: "Fast Charger", description: "Ultra-fast charging adapter with intelligent power delivery." },
    { type: "USB-C Charger", description: "Universal USB-C power adapter for all your modern devices." },
    { type: "Type-C Charger", description: "Reliable Type-C charger for smartphones and tablets." },
    { type: "Wireless Charger", description: "Sleek wireless charging pad with Qi-certification." },
    { type: "Multi-Port Charger", description: "Charge multiple devices simultaneously with this high-power hub." },
    { type: "Laptop Charger", description: "Replacement power adapter for high-performance laptops." },
    { type: "GaN Charger", description: "Compact and efficient GaN technology for cooler, faster charging." },
    { type: "Car Charger", description: "Keep your devices powered up on the go with this dual-port car charger." },
    { type: "Travel Charger", description: "Compact travel-friendly adapter with multi-national compatibility." },
    { type: "Power Delivery Charger", description: "Smart PD charger optimized for fast charging iPhones and Pixels." }
];

const wattages = ["18W", "20W", "33W", "45W", "65W", "80W", "100W", "120W"];
const compatibilities = ["iOS & Android", "Type-C Devices", "Laptops & Smartphones", "Qi-Enabled Devices", "Universal"];
const cableTypes = ["USB-C to USB-C", "USB-A to USB-C", "Lightning to USB-C", "Micro-USB", "No Cable Included"];
const colorList = ["Classic White", "Midnight Black", "Space Grey", "Navy Blue", "Silver"];

const chargerImages = [
    "https://images.unsplash.com/photo-1619130771181-2292f7461937?q=80&w=800&auto=format&fit=crop", // Wall adapter
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop", // Wireless pad
    "https://images.unsplash.com/photo-1625232490807-6c043003058c?q=80&w=800&auto=format&fit=crop", // Multiple ports
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop", // Cable + adapter
    "https://images.unsplash.com/photo-1600003014755-931d5bc7646b?q=80&w=800&auto=format&fit=crop", // Compact charger
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", // Tech context
    "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800&auto=format&fit=crop", // Car charger
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=800&auto=format&fit=crop"  // Detail shot
];

const generateChargers = () => {
    const products = [];
    for (let i = 1; i <= 40; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const typeObj = chargerTypes[Math.floor(Math.random() * chargerTypes.length)];
        const type = typeObj.type;
        
        const name = `${brand} ${type} ${i % 3 === 0 ? 'Pro' : 'Elite'}`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[&]/g, 'and') + '-' + i;
        
        const basePrice = type.includes("Laptop") ? 2500 : 
                         type.includes("Wireless") ? 1500 : 
                         type.includes("GaN") ? 2000 : 600;
        
        const price = Math.floor(basePrice + Math.random() * (basePrice * 0.5));
        const originalPrice = Math.floor(price * (1.2 + Math.random() * 0.4));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const selectedColors = colorList.sort(() => 0.5 - Math.random()).slice(0, 2);
        const image = chargerImages[Math.floor(Math.random() * chargerImages.length)];
        
        const wattage = wattages[Math.floor(Math.random() * wattages.length)];
        const compatibility = compatibilities[Math.floor(Math.random() * compatibilities.length)];
        const cableType = cableTypes[Math.floor(Math.random() * cableTypes.length)];

        products.push({
            name,
            slug,
            brand,
            description: `${typeObj.description} The ${name} by ${brand} provides ${wattage} output with ${compatibility} support. Featuring high-quality materials and multiple safety protections.`,
            category: "Electronics & Tech",
            subcategory: "Mobiles",
            section: "Tech Essentials",
            type,
            wattage,
            compatibility,
            cableType,
            colors: selectedColors,
            image: image,
            images: [image, chargerImages[(Math.floor(Math.random() * chargerImages.length))]],
            price,
            originalPrice,
            discount,
            stock: 30 + Math.floor(Math.random() * 200),
            rating: 3.9 + (Math.random() * 1.1),
            ratingsCount: 40 + Math.floor(Math.random() * 3000),
            featured: i % 8 === 0,
            trending: i % 6 === 0,
            highlights: [
                `${wattage} Fast Charging`,
                `Universal ${compatibility}`,
                "Short Circuit Protection",
                "Overheat Protection",
                "Compact & Travel-friendly"
            ],
            specifications: {
                "Input": "100-240V ~ 50/60Hz",
                "Output": wattage,
                "Connector": cableType,
                "Certification": "BIS Certified",
                "Box Contents": "Adapter, User Manual"
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

        const deleted = await Product.deleteMany({ section: "Tech Essentials", type: { $regex: /Charger/i } });
        console.log(`🗑️ ${deleted.deletedCount} existing charger products cleared.`);

        const chargers = generateChargers();
        await Product.insertMany(chargers);
        console.log(`🌱 ${chargers.length} Charger products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
