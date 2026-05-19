const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const brands = ["Wipro", "Philips", "Mi", "Portronics", "Syska", "Havells"];
const types = [
    "LED Desk Lamp",
    "Rechargeable Desk Lamp",
    "Clip-On Study Lamp",
    "Foldable Desk Lamp",
    "Touch Control Lamp",
    "USB Powered Lamp",
    "Adjustable Study Lamp",
    "RGB Desk Lamp",
    "Wireless Charging Lamp",
    "Minimalist Desk Lamp"
];

const powerSources = ["USB Powered", "Battery Operated", "AC Plug-in", "Rechargeable (Built-in Battery)", "Solar Powered"];
const brightnessLevels = ["3 Levels", "5 Levels", "Stepless Dimming", "Fixed Brightness"];
const colorTemperatures = ["Warm White (3000K)", "Cool White (6000K)", "Natural Daylight (4500K)", "3-Mode Adjustable"];
const colors = ["White", "Black", "Space Grey", "Navy Blue", "Pastel Pink", "Mint Green"];

const lampImages = [
    "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542728928-1413d1894ed1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80"
];

function generateDeskLamps(count) {
    const products = [];
    for (let i = 0; i < count; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const powerSource = powerSources[Math.floor(Math.random() * powerSources.length)];
        const brightness = brightnessLevels[Math.floor(Math.random() * brightnessLevels.length)];
        const temp = colorTemperatures[Math.floor(Math.random() * colorTemperatures.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const img = lampImages[i % lampImages.length];

        const basePrice = type.includes("Wireless") ? 1499 : type.includes("Rechargeable") ? 899 : 499;
        const price = basePrice + Math.floor(Math.random() * 1000);
        const originalPrice = price + Math.floor(Math.random() * 800) + 200;
        const discountVal = Math.round(((originalPrice - price) / originalPrice) * 100);

        const name = `${brand} ${type} - ${color} Edition`;
        const slug = `${brand.toLowerCase()}-${type.toLowerCase().replace(/ /g, '-')}-${i}-${Math.floor(Math.random()*1000)}`;

        products.push({
            name: name,
            slug: slug,
            brand: brand,
            description: `Illuminate your workspace with the ${name}. Featuring ${brightness} and ${temp}, this ${type} is perfect for long study sessions. The ${powerSource} ensures you never run out of light when you need it most. Designed by ${brand} for maximum comfort and eye protection.`,
            category: "Home",
            subcategory: "Bedroom",
            section: "Student Essentials",
            type: type,
            brightnessLevels: brightness,
            powerSource: powerSource,
            colorTemperature: temp,
            colors: [color],
            image: img,
            images: [img, lampImages[(i + 1) % lampImages.length]],
            price: price,
            originalPrice: originalPrice,
            discount: `${discountVal}% OFF`,
            stock: 15 + Math.floor(Math.random() * 100),
            rating: 4.1 + (Math.random() * 0.9),
            ratingsCount: 50 + Math.floor(Math.random() * 500),
            highlights: [
                `${brightness} control`,
                `${temp} light modes`,
                `${powerSource} flexibility`,
                "Eye-friendly flickering-free light",
                "Adjustable neck for perfect positioning"
            ],
            featured: i % 5 === 0,
            trending: i % 4 === 0,
            createdAt: new Date()
        });
    }
    return products;
}

const allProducts = generateDeskLamps(35);

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const result = await Product.deleteMany({ 
            subcategory: "Bedroom", 
            $or: [
                { name: /Lamp/i },
                { type: /Lamp/i }
            ]
        });
        console.log(`🗑️ ${result.deletedCount} existing desk lamp products cleared.`);

        await Product.insertMany(allProducts);
        console.log(`🌱 ${allProducts.length} Desk Lamp products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
