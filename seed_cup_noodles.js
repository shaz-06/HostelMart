const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Maggi", "Yippee", "Nissin", "Nongshim", "Top Ramen", "Knorr"];

const cupNoodleTypes = [
    { type: "Veg Cup Noodles", baseFlavor: "Vegetable Masala", brands: ["Maggi", "Yippee", "Top Ramen"], spice: "Mild" },
    { type: "Chicken Cup Noodles", baseFlavor: "Spicy Chicken", brands: ["Maggi", "Nissin", "Nongshim"], spice: "High" },
    { type: "Spicy Cup Noodles", baseFlavor: "Peri Peri", brands: ["Nissin", "Top Ramen"], spice: "Very High" },
    { type: "Korean Style Cup Noodles", baseFlavor: "Kimchi", brands: ["Nongshim", "Nissin"], spice: "Very High" },
    { type: "Cheese Cup Noodles", baseFlavor: "Cheese & Herbs", brands: ["Maggi", "Nissin"], spice: "Mild" },
    { type: "Schezwan Cup Noodles", baseFlavor: "Schezwan Masala", brands: ["Top Ramen", "Yippee"], spice: "High" },
    { type: "Hot & Sour Cup Noodles", baseFlavor: "Tangy Hot & Sour", brands: ["Knorr", "Nissin"], spice: "Medium" },
    { type: "Instant Pasta Cups", baseFlavor: "Tomato Salsa", brands: ["Maggi", "Knorr"], spice: "Mild" },
    { type: "Premium Ramen Cups", baseFlavor: "Miso Ramen", brands: ["Nongshim", "Nissin"], spice: "Medium" },
    { type: "Combo Cup Noodle Packs", baseFlavor: "Mixed Flavors", brands: ["Nissin", "Maggi"], spice: "Medium" }
];

const cupImages = [
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop", // Ramen Cup
    "https://images.unsplash.com/photo-1599490659223-eb53957bd35b?q=80&w=800&auto=format&fit=crop", // Noodle bowl
    "https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=800&auto=format&fit=crop", // Cooking noodles
    "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop"  // Close up
];

const generateCupNoodles = () => {
    const products = [];
    for (let i = 1; i <= 30; i++) {
        const typeData = cupNoodleTypes[Math.floor(Math.random() * cupNoodleTypes.length)];
        const brand = typeData.brands[Math.floor(Math.random() * typeData.brands.length)];
        const weight = Math.random() > 0.5 ? "70g" : "80g";
        
        const name = `${brand} ${typeData.type} - ${typeData.baseFlavor}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const basePrice = brand === "Nongshim" ? 80 : 45;
        const price = basePrice + Math.floor(Math.random() * 20);
        const originalPrice = Math.floor(price * 1.2);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 10);

        products.push({
            name,
            slug,
            brand,
            description: `Instant satisfaction in a cup! This ${typeData.type} from ${brand} features an authentic ${typeData.baseFlavor} taste with a ${typeData.spice} kick. Just add hot water and wait for 3 minutes. Ideal for quick meals during study hours.`,
            category: "Food",
            subcategory: "Snacks",
            section: "Late Night Cravings",
            type: "Cup Noodles",
            flavor: typeData.baseFlavor,
            weight: weight,
            packSize: i % 10 === 0 ? "Pack of 4" : "Single Cup",
            spiceLevel: typeData.spice,
            dietaryType: typeData.type.includes("Chicken") ? "Non-Veg" : "Veg",
            expiryDate: expiry.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            image: cupImages[Math.floor(Math.random() * cupImages.length)],
            images: [cupImages[0], cupImages[1]],
            price,
            originalPrice,
            discount,
            stock: 150 + Math.floor(Math.random() * 300),
            rating: 4.4 + (Math.random() * 0.6),
            ratingsCount: 200 + Math.floor(Math.random() * 5000),
            featured: i % 8 === 0,
            trending: i % 5 === 0,
            highlights: [
                "Ready in 3 Minutes",
                "Includes Folding Fork",
                "No Artificial Colors",
                "Authentic Flavors",
                "Portable & Convenient"
            ],
            specifications: {
                "Serving Size": weight,
                "Calories": "350 kcal",
                "Contains": "Wheat, Soy",
                "Prep Time": "3 Minutes",
                "Shelf Life": "12 Months"
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

        const deleted = await Product.deleteMany({ type: "Cup Noodles", section: "Late Night Cravings" });
        console.log(`🗑️ ${deleted.deletedCount} existing cup noodles cleared.`);

        const cups = generateCupNoodles();
        await Product.insertMany(cups);
        console.log(`🌱 ${cups.length} Cup Noodles products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
