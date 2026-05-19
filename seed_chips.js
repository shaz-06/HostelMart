const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Lay’s", "Kurkure", "Bingo", "Haldiram’s", "Doritos", "Too Yumm", "Pringles", "Balaji"];

const chipTypes = [
    { type: "Potato Chips", baseFlavor: "Magic Masala", brands: ["Lay’s", "Bingo", "Balaji"], spice: "Medium" },
    { type: "Masala Chips", baseFlavor: "Chilli Chatka", brands: ["Kurkure", "Bingo", "Balaji"], spice: "High" },
    { type: "Cheese Chips", baseFlavor: "Cheese & Onion", brands: ["Lay’s", "Pringles"], spice: "Mild" },
    { type: "Nachos", baseFlavor: "Cheese Nachos", brands: ["Doritos", "Bingo"], spice: "Medium" },
    { type: "Banana Chips", baseFlavor: "Salted Banana", brands: ["Haldiram’s", "Balaji"], spice: "Mild" },
    { type: "Corn Chips", baseFlavor: "Tangy Corn", brands: ["Doritos", "Too Yumm"], spice: "Medium" },
    { type: "Tortilla Chips", baseFlavor: "Sizzling Hot", brands: ["Doritos", "Bingo"], spice: "Very High" },
    { type: "Spicy Chips", baseFlavor: "Flamin' Hot", brands: ["Lay’s", "Doritos", "Too Yumm"], spice: "Very High" },
    { type: "Baked Chips", baseFlavor: "Cream & Onion", brands: ["Too Yumm", "Lay’s"], spice: "Mild" },
    { type: "Combo Snack Packs", baseFlavor: "Party Mix", brands: ["Haldiram’s", "Balaji"], spice: "Medium" }
];

const chipImages = [
    "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=800&auto=format&fit=crop", // Chips
    "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?q=80&w=800&auto=format&fit=crop", // Open bag
    "https://images.unsplash.com/photo-1599490659223-eb53957bd35b?q=80&w=800&auto=format&fit=crop", // Snacks
    "https://images.unsplash.com/photo-1621447509323-5705627f45b2?q=80&w=800&auto=format&fit=crop"  // Doritos style
];

const generateChips = () => {
    const products = [];
    for (let i = 1; i <= 45; i++) {
        const typeData = chipTypes[Math.floor(Math.random() * chipTypes.length)];
        const brand = typeData.brands[Math.floor(Math.random() * typeData.brands.length)];
        
        const weights = ["30g", "50g", "90g", "150g"];
        const weight = brand === "Pringles" ? "134g" : weights[Math.floor(Math.random() * weights.length)];
        
        const name = `${brand} ${typeData.type} - ${typeData.baseFlavor}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const basePrice = brand === "Pringles" ? 99 : brand === "Doritos" ? 50 : 20;
        const weightMult = weight === "150g" ? 3 : weight === "90g" ? 2 : 1;
        const price = (basePrice * weightMult) + Math.floor(Math.random() * 10);
        const originalPrice = Math.floor(price * 1.25);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 6);

        products.push({
            name,
            slug,
            brand,
            description: `Crunchy, flavorful, and absolutely addictive! These ${typeData.type} from ${brand} are packed with ${typeData.baseFlavor} flavor. With a ${typeData.spice} spice level, they're the perfect companion for your movie nights or study breaks in the hostel.`,
            category: "Food",
            subcategory: "Snacks",
            section: "Late Night Cravings",
            type: "Chips",
            flavor: typeData.baseFlavor,
            weight: weight,
            packSize: i % 12 === 0 ? "Pack of 3" : "Single Pack",
            spiceLevel: typeData.spice,
            dietaryType: "Veg",
            expiryDate: expiry.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            image: chipImages[Math.floor(Math.random() * chipImages.length)],
            images: [chipImages[Math.floor(Math.random() * chipImages.length)], chipImages[0]],
            price,
            originalPrice,
            discount,
            stock: 200 + Math.floor(Math.random() * 500),
            rating: 4.3 + (Math.random() * 0.7),
            ratingsCount: 150 + Math.floor(Math.random() * 8000),
            featured: i % 9 === 0,
            trending: i % 6 === 0,
            highlights: [
                "Bursting with Flavor",
                "Ultra Crunchy Texture",
                "No Trans Fat",
                "Perfect Party Snack",
                "Travel Friendly Packaging"
            ],
            specifications: {
                "Net Weight": weight,
                "Packaging": "Pouch",
                "Shelf Life": "6 Months",
                "Allergen Info": "Contains Gluten",
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

        const deleted = await Product.deleteMany({ type: "Chips", section: "Late Night Cravings" });
        console.log(`🗑️ ${deleted.deletedCount} existing chips products cleared.`);

        const chips = generateChips();
        await Product.insertMany(chips);
        console.log(`🌱 ${chips.length} Chips products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
