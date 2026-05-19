const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Logitech", "HP", "Dell", "Zebronics", "Lenovo", "Razer", "Corsair", "Portronics", "Asus", "Redgear"];

const mouseTypes = [
    { type: "Wireless Mouse", description: "Seamless wireless freedom with long-lasting battery life." },
    { type: "Bluetooth Mouse", description: "Connect to multiple devices easily with Bluetooth technology." },
    { type: "Gaming Mouse", description: "High-precision gaming mouse with customizable buttons and RGB lighting." },
    { type: "Ergonomic Mouse", description: "Designed for comfort to reduce hand strain during long work hours." },
    { type: "RGB Mouse", description: "Vibrant RGB lighting with adjustable effects to match your setup." },
    { type: "Silent Click Mouse", description: "Ultra-quiet clicks for a peaceful work environment." },
    { type: "Rechargeable Mouse", description: "Built-in rechargeable battery, no need for external cells." },
    { type: "Wired Mouse", description: "Reliable plug-and-play wired connection for zero latency." },
    { type: "Compact Travel Mouse", description: "Small and lightweight design, perfect for people on the move." },
    { type: "Professional Productivity Mouse", description: "High-end productivity mouse with advanced scrolling and gestures." }
];

const connectivities = ["Wireless (2.4GHz USB)", "Bluetooth", "Dual Mode (Wireless + BT)", "Wired (USB)"];
const dpis = ["800 DPI", "1200 DPI", "1600 DPI", "2400 DPI", "3200 DPI", "6400 DPI", "12000 DPI+"];
const batteryLives = ["3 Months", "6 Months", "12 Months", "24 Months", "Rechargeable (up to 40 days)"];
const compatibilities = ["Windows & macOS", "Windows, macOS & Linux", "Universal (USB-A)", "Bluetooth Enabled Devices", "iPad & Android Tablets"];
const colorList = ["Matte Black", "Pearl White", "Graphite", "Cobalt Blue", "Ruby Red"];

const mouseImages = [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop", // Wireless mouse
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop", // Gaming mouse
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop", // Modern mouse
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop", // Setup context
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop", // Tech desk
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop", // Detail shot
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", // Product focus
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=800&auto=format&fit=crop"  // Professional focus
];

const generateMice = () => {
    const products = [];
    for (let i = 1; i <= 40; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const typeObj = mouseTypes[Math.floor(Math.random() * mouseTypes.length)];
        const type = typeObj.type;
        
        const name = `${brand} ${type} ${i % 2 === 0 ? 'G-Series' : 'Elite'}`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[&]/g, 'and') + '-' + i;
        
        const basePrice = type.includes("Gaming") ? 1500 : 
                         type.includes("Professional") ? 2500 : 
                         type.includes("Wireless") ? 800 : 400;
        
        const price = Math.floor(basePrice + Math.random() * (basePrice * 0.7));
        const originalPrice = Math.floor(price * (1.2 + Math.random() * 0.5));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const selectedColors = colorList.sort(() => 0.5 - Math.random()).slice(0, 2);
        const image = mouseImages[Math.floor(Math.random() * mouseImages.length)];
        
        const connectivity = connectivities[Math.floor(Math.random() * connectivities.length)];
        const dpi = dpis[Math.floor(Math.random() * dpis.length)];
        const batteryLife = batteryLives[Math.floor(Math.random() * batteryLives.length)];
        const compatibility = compatibilities[Math.floor(Math.random() * compatibilities.length)];

        products.push({
            name,
            slug,
            brand,
            description: `${typeObj.description} The ${name} by ${brand} provides ${dpi} precision with ${connectivity} connectivity. Featuring a sleek design and compatibility with ${compatibility}.`,
            category: "Electronics & Tech",
            subcategory: "Laptops",
            section: "Tech Essentials",
            type,
            connectivity,
            dpi,
            batteryLife,
            compatibility,
            colors: selectedColors,
            image: image,
            images: [image, mouseImages[(Math.floor(Math.random() * mouseImages.length))]],
            price,
            originalPrice,
            discount,
            stock: 20 + Math.floor(Math.random() * 150),
            rating: 4.0 + (Math.random() * 1.0),
            ratingsCount: 30 + Math.floor(Math.random() * 2000),
            featured: i % 9 === 0,
            trending: i % 6 === 0,
            highlights: [
                `${dpi} High-Precision Sensor`,
                `${connectivity} Technology`,
                `${batteryLife} Long Battery Life`,
                "Ergonomic & Lightweight Design",
                "Advanced Optical Tracking"
            ],
            specifications: {
                "Model": `MSE-${brand}-${i}`,
                "Buttons": type.includes("Gaming") ? "6 Programmable Buttons" : "3 Standard Buttons",
                "Tracking Type": "Optical",
                "Item Weight": "80g - 120g",
                "Warranty": "1 Year Brand Warranty"
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

        const deleted = await Product.deleteMany({ section: "Tech Essentials", type: { $regex: /Mouse/i } });
        console.log(`🗑️ ${deleted.deletedCount} existing mouse products cleared.`);

        const mice = generateMice();
        await Product.insertMany(mice);
        console.log(`🌱 ${mice.length} Mouse products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
