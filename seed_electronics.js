const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Apple", "Samsung", "OnePlus", "Sony", "JBL", "boAt", "HP", "Dell", "Lenovo", "Asus", "Logitech", "Xiaomi"];

const subcategories = [
    { name: "Mobiles", types: ["Smartphone", "Tablet Device", "Power Bank", "Charger"] },
    { name: "Laptops", types: ["Laptop", "USB Hub", "Wireless Mouse", "Mechanical Keyboard", "Laptop Cooling Pad", "Portable SSD"] },
    { name: "Audio", types: ["Earbuds", "Bluetooth Speaker", "Gaming Headset"] },
    { name: "Smartwatches", types: ["Smartwatch"] }
];

const connectivities = ["Wireless", "Wired", "Bluetooth 5.0", "USB-C", "Wi-Fi", "5G"];
const batteries = ["5000mAh", "4500mAh", "10 Hours", "24 Hours", "7 Days Standby", "No Battery (Wired)"];
const warranties = ["1 Year Brand Warranty", "2 Years Brand Warranty", "6 Months Brand Warranty"];
const colorList = ["Space Grey", "Phantom Black", "Midnight Blue", "Arctic White", "Rose Gold", "Graphite"];

const electronicsImages = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop", // Phone
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop", // Laptop
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", // Headphones
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", // Watch
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop", // Speaker
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop", // Tablet
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop", // Mouse
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop"  // Keyboard
];

const generateElectronics = () => {
    const products = [];
    for (let i = 1; i <= 85; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const subcatObj = subcategories[Math.floor(Math.random() * subcategories.length)];
        const subcategory = subcatObj.name;
        const type = subcatObj.types[Math.floor(Math.random() * subcatObj.types.length)];
        
        const name = `${brand} ${type} ${i % 2 === 0 ? 'Pro Max' : 'Elite Series'}`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[&]/g, 'and') + '-' + i;
        
        const basePrice = type.includes("Laptop") ? 45000 : 
                         type.includes("Smartphone") ? 15000 : 
                         type.includes("Earbuds") ? 2000 : 
                         type.includes("Watch") ? 3000 : 800;
        
        const price = basePrice + Math.floor(Math.random() * (basePrice * 0.5));
        const originalPrice = Math.floor(price * (1.1 + Math.random() * 0.3));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const selectedColors = colorList.sort(() => 0.5 - Math.random()).slice(0, 2);
        const image = electronicsImages[Math.floor(Math.random() * electronicsImages.length)];
        
        products.push({
            name,
            slug,
            brand,
            description: `The ${name} offers cutting-edge technology and premium design. Perfect for students and professionals alike, this ${type} by ${brand} provides exceptional performance and reliability. Featuring ${connectivities[Math.floor(Math.random() * connectivities.length)]} and a sleek finish.`,
            category: "Electronics & Tech",
            subcategory,
            section: "Electronics",
            type,
            connectivity: connectivities[Math.floor(Math.random() * connectivities.length)],
            battery: batteries[Math.floor(Math.random() * batteries.length)],
            warranty: warranties[Math.floor(Math.random() * warranties.length)],
            colors: selectedColors,
            image: image,
            images: [image, electronicsImages[(Math.floor(Math.random() * electronicsImages.length))]],
            price,
            originalPrice,
            discount,
            stock: 10 + Math.floor(Math.random() * 100),
            rating: 3.8 + (Math.random() * 1.2),
            ratingsCount: 100 + Math.floor(Math.random() * 2000),
            featured: i % 8 === 0,
            trending: i % 10 === 0,
            highlights: [
                "Premium Build Quality",
                "High-performance Hardware",
                "Ergonomic Design",
                "Best-in-class Battery Life",
                "Official Brand Warranty"
            ],
            specifications: {
                "Model": `${brand}-${i}`,
                "Weight": "Varies by model",
                "Interface": connectivities[Math.floor(Math.random() * connectivities.length)],
                "Box Contents": "Main Device, Charging Cable, User Manual"
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

        const deleted = await Product.deleteMany({ category: "Electronics & Tech" });
        console.log(`🗑️ ${deleted.deletedCount} existing electronic products cleared.`);

        const electronics = generateElectronics();
        await Product.insertMany(electronics);
        console.log(`🌱 ${electronics.length} Electronic products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
