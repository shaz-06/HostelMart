const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Cadbury", "KitKat", "Nestlé", "Ferrero Rocher", "Hershey’s", "Mars", "Snickers", "Lindt"];

const chocolateTypes = [
    { type: "Milk Chocolates", baseFlavor: "Smooth Milk", brands: ["Cadbury", "Hershey’s", "Nestlé"] },
    { type: "Dark Chocolates", baseFlavor: "70% Cocoa Dark", brands: ["Lindt", "Cadbury", "Hershey’s"] },
    { type: "Wafer Chocolates", baseFlavor: "Crispy Wafer", brands: ["KitKat", "Nestlé", "Mars"] },
    { type: "Filled Chocolates", baseFlavor: "Fruit & Nut", brands: ["Cadbury", "Hershey’s"] },
    { type: "Chocolate Bars", baseFlavor: "Classic Bar", brands: ["Mars", "Snickers", "Cadbury"] },
    { type: "Mini Chocolates", baseFlavor: "Bite-sized", brands: ["Cadbury", "KitKat", "Snickers"] },
    { type: "Premium Chocolates", baseFlavor: "Hazelnut Praline", brands: ["Ferrero Rocher", "Lindt"] },
    { type: "Nut Chocolates", baseFlavor: "Roasted Almond", brands: ["Snickers", "Cadbury", "Hershey’s"] },
    { type: "Caramel Chocolates", baseFlavor: "Salted Caramel", brands: ["Mars", "Cadbury", "Lindt"] },
    { type: "Combo Chocolate Packs", baseFlavor: "Celebration Pack", brands: ["Cadbury", "Ferrero Rocher"] }
];

const chocolateImages = [
    "https://images.unsplash.com/photo-1582208993918-28f0ca49aa92?q=80&w=800&auto=format&fit=crop", // Chocolate bar
    "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=800&auto=format&fit=crop", // Dark chocolate
    "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop", // Wrapped chocolates
    "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800&auto=format&fit=crop"  // Ferrero style
];

const generateChocolates = () => {
    const products = [];
    for (let i = 1; i <= 45; i++) {
        const typeData = chocolateTypes[Math.floor(Math.random() * chocolateTypes.length)];
        const brand = typeData.brands[Math.floor(Math.random() * typeData.brands.length)];
        
        const weights = ["40g", "80g", "100g", "250g", "500g"];
        const weight = brand === "Ferrero Rocher" ? "200g" : weights[Math.floor(Math.random() * weights.length)];
        
        const name = `${brand} ${typeData.type} - ${typeData.baseFlavor}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const basePrice = brand === "Lindt" || brand === "Ferrero Rocher" ? 250 : 40;
        const weightMult = weight === "500g" ? 4 : weight === "250g" ? 2.2 : weight === "100g" ? 1 : 0.6;
        const price = Math.floor(basePrice * weightMult) + Math.floor(Math.random() * 10);
        const originalPrice = Math.floor(price * 1.2);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 12);

        products.push({
            name,
            slug,
            brand,
            description: `Indulge in the rich, velvety taste of ${brand} ${typeData.type}. With its ${typeData.baseFlavor} notes, it's the perfect treat to boost your mood during those late-night hostel study sessions or to celebrate a small win. Made with the finest cocoa for an unforgettable experience.`,
            category: "Food",
            subcategory: "Snacks",
            section: "Late Night Cravings",
            type: "Chocolates",
            flavor: typeData.baseFlavor,
            weight: weight,
            packSize: i % 10 === 0 ? "Gift Box" : i % 5 === 0 ? "Multipack" : "Single Bar",
            dietaryType: "Veg",
            expiryDate: expiry.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            image: chocolateImages[Math.floor(Math.random() * chocolateImages.length)],
            images: [chocolateImages[Math.floor(Math.random() * chocolateImages.length)], chocolateImages[0]],
            price,
            originalPrice,
            discount,
            stock: 100 + Math.floor(Math.random() * 500),
            rating: 4.6 + (Math.random() * 0.4),
            ratingsCount: 500 + Math.floor(Math.random() * 15000),
            featured: i % 10 === 0,
            trending: i % 7 === 0,
            highlights: [
                "Rich & Creamy Texture",
                "Premium Quality Cocoa",
                "Perfect for Gifting",
                "Satisfies Sweet Cravings",
                "Individually Wrapped"
            ],
            specifications: {
                "Net Weight": weight,
                "Type": typeData.type,
                "Shelf Life": "12 Months",
                "Vegetarian": "Yes",
                "Storage": "Store in a cool and dry place"
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

        const deleted = await Product.deleteMany({ type: "Chocolates", section: "Late Night Cravings" });
        console.log(`🗑️ ${deleted.deletedCount} existing chocolate products cleared.`);

        const chocolates = generateChocolates();
        await Product.insertMany(chocolates);
        console.log(`🌱 ${chocolates.length} Chocolate products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
