const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Portronics", "Amazon Basics", "Zebronics", "Tukzer", "Logitech", "Dyazo", "STRIFF", "IKEA"];

const laptopStandTypes = [
    { type: "Adjustable Laptop Stand", description: "Versatile laptop stand with multi-level height adjustment for ergonomic comfort." },
    { type: "Foldable Laptop Stand", description: "Ultra-portable foldable stand, perfect for digital nomads and students." },
    { type: "Aluminum Laptop Stand", description: "Premium aluminum build for superior stability and heat dissipation." },
    { type: "Cooling Laptop Stand", description: "Equipped with large silent fans to keep your laptop cool during intense tasks." },
    { type: "Wooden Laptop Stand", description: "Sustainable wooden stand that adds a touch of elegance to your workspace." },
    { type: "Portable Laptop Stand", description: "Lightweight and compact design, fits easily into any laptop bag." },
    { type: "Ergonomic Laptop Stand", description: "Designed to improve posture and reduce neck strain during long work hours." },
    { type: "Multi-Angle Laptop Stand", description: "Find your perfect viewing angle with 6-level adjustable tilts." },
    { type: "Vertical Laptop Stand", description: "Space-saving vertical stand to keep your desk organized when using external monitors." },
    { type: "Desk Laptop Riser", description: "Sturdy desk riser to elevate your screen to eye level." }
];

const materials = ["Aluminum Alloy", "Engineered Wood", "ABS Plastic", "Stainless Steel", "Silicone"];
const adjustabilities = ["6-Level Height Adjustment", "360-Degree Rotation", "Stepless Tilt", "Fixed Height", "Foldable"];
const compatibilities = ["10-15.6 inch Laptops", "13-17 inch Laptops", "All Tablets & Laptops", "MacBook & iPad", "Universal"];
const colorList = ["Space Grey", "Silver", "Midnight Black", "Rose Gold", "Natural Wood"];

const laptopStandImages = [
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop", // Modern setup
    "https://images.unsplash.com/photo-1616489953149-8e4266657962?q=80&w=800&auto=format&fit=crop", // Aluminum stand
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop", // Desk context
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop", // Working context
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop", // Minimalist
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop", // High tech
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop", // Detail shot
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"  // Product focus
];

const generateLaptopStands = () => {
    const products = [];
    for (let i = 1; i <= 35; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const typeObj = laptopStandTypes[Math.floor(Math.random() * laptopStandTypes.length)];
        const type = typeObj.type;
        
        const name = `${brand} ${type} ${i % 2 === 0 ? 'Pro' : 'Elite'}`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[&]/g, 'and') + '-' + i;
        
        const material = materials[Math.floor(Math.random() * materials.length)];
        const basePrice = material === "Aluminum Alloy" ? 1200 : 
                         material === "Engineered Wood" ? 1500 : 
                         material === "ABS Plastic" ? 400 : 800;
        
        const price = Math.floor(basePrice + Math.random() * (basePrice * 0.6));
        const originalPrice = Math.floor(price * (1.2 + Math.random() * 0.5));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const selectedColors = colorList.sort(() => 0.5 - Math.random()).slice(0, 2);
        const image = laptopStandImages[Math.floor(Math.random() * laptopStandImages.length)];
        
        const adjustability = adjustabilities[Math.floor(Math.random() * adjustabilities.length)];
        const compatibility = compatibilities[Math.floor(Math.random() * compatibilities.length)];

        products.push({
            name,
            slug,
            brand,
            description: `${typeObj.description} The ${name} by ${brand} is crafted from high-quality ${material} and offers ${adjustability}. Perfect for ${compatibility}, this stand is a must-have for any modern workstation.`,
            category: "Electronics & Tech",
            subcategory: "Laptops",
            section: "Tech Essentials",
            type,
            material,
            adjustability,
            compatibility,
            colors: selectedColors,
            image: image,
            images: [image, laptopStandImages[(Math.floor(Math.random() * laptopStandImages.length))]],
            price,
            originalPrice,
            discount,
            stock: 15 + Math.floor(Math.random() * 120),
            rating: 4.2 + (Math.random() * 0.8),
            ratingsCount: 20 + Math.floor(Math.random() * 1500),
            featured: i % 7 === 0,
            trending: i % 4 === 0,
            highlights: [
                `Premium ${material} Build`,
                `${adjustability} Feature`,
                `Compatible with ${compatibility}`,
                "Anti-Slip Silicone Pads",
                "Heat Dissipation Design"
            ],
            specifications: {
                "Model": `LS-${brand}-${i}`,
                "Foldable": type.includes("Foldable") ? "Yes" : "No",
                "Weight Capacity": "Up to 10kg",
                "Item Weight": "250g - 800g",
                "Warranty": "6 Months Brand Warranty"
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

        const deleted = await Product.deleteMany({ section: "Tech Essentials", type: { $regex: /Laptop Stand/i } });
        console.log(`🗑️ ${deleted.deletedCount} existing laptop stand products cleared.`);

        const laptopStands = generateLaptopStands();
        await Product.insertMany(laptopStands);
        console.log(`🌱 ${laptopStands.length} Laptop Stand products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
