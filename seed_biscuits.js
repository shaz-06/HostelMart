const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Britannia", "Parle", "Sunfeast", "Oreo", "Unibic", "Good Day", "McVitie’s", "Hide & Seek"];

const biscuitTypes = [
    { type: "Cream Biscuits", baseFlavor: "Chocolate Cream", brands: ["Oreo", "Britannia", "Sunfeast", "Hide & Seek"] },
    { type: "Chocolate Biscuits", baseFlavor: "Choco Chip", brands: ["Hide & Seek", "Unibic", "Sunfeast"] },
    { type: "Glucose Biscuits", baseFlavor: "Original Glucose", brands: ["Parle", "Britannia"] },
    { type: "Digestive Biscuits", baseFlavor: "Whole Wheat", brands: ["McVitie’s", "Britannia", "Sunfeast"] },
    { type: "Butter Cookies", baseFlavor: "Classic Butter", brands: ["Good Day", "Unibic", "Britannia"] },
    { type: "Crackers", baseFlavor: "Salty Crackers", brands: ["Britannia", "Parle"] },
    { type: "Marie Biscuits", baseFlavor: "Light Marie", brands: ["Britannia", "Parle", "Sunfeast"] },
    { type: "Oat Biscuits", baseFlavor: "Healthy Oats", brands: ["Unibic", "McVitie’s"] },
    { type: "Sugar-Free Biscuits", baseFlavor: "No Sugar Wheat", brands: ["Britannia", "Sunfeast"] },
    { type: "Combo Biscuit Packs", baseFlavor: "Family Mix", brands: ["Britannia", "Parle", "Sunfeast"] }
];

const biscuitImages = [
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop", // Biscuits
    "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop", // Cookies
    "https://images.unsplash.com/photo-1499195333224-3ce974eecb47?q=80&w=800&auto=format&fit=crop", // Oats
    "https://images.unsplash.com/photo-1559622214-f8a9850965bb?q=80&w=800&auto=format&fit=crop"  // Chocolate chip
];

const generateBiscuits = () => {
    const products = [];
    for (let i = 1; i <= 45; i++) {
        const typeData = biscuitTypes[Math.floor(Math.random() * biscuitTypes.length)];
        const brand = typeData.brands[Math.floor(Math.random() * typeData.brands.length)];
        
        const weights = ["100g", "150g", "200g", "400g"];
        const weight = weights[Math.floor(Math.random() * weights.length)];
        
        const name = `${brand} ${typeData.type} - ${typeData.baseFlavor}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const basePrice = brand === "McVitie’s" ? 40 : brand === "Oreo" ? 30 : 10;
        const weightMult = weight === "400g" ? 3.5 : weight === "200g" ? 2 : 1;
        const price = Math.floor(basePrice * weightMult) + Math.floor(Math.random() * 5);
        const originalPrice = Math.floor(price * 1.2);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 9);

        products.push({
            name,
            slug,
            brand,
            description: `Sweet, crunchy, and perfect with tea or coffee! These ${typeData.type} from ${brand} are baked to perfection with ${typeData.baseFlavor} notes. A classic choice for your morning routine or late-night study sessions in the hostel.`,
            category: "Food",
            subcategory: "Snacks",
            section: "Late Night Cravings",
            type: "Biscuits",
            flavor: typeData.baseFlavor,
            weight: weight,
            packSize: i % 10 === 0 ? "Pack of 6" : i % 5 === 0 ? "Value Pack" : "Single Pack",
            dietaryType: "Veg",
            expiryDate: expiry.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            image: biscuitImages[Math.floor(Math.random() * biscuitImages.length)],
            images: [biscuitImages[Math.floor(Math.random() * biscuitImages.length)], biscuitImages[0]],
            price,
            originalPrice,
            discount,
            stock: 300 + Math.floor(Math.random() * 700),
            rating: 4.5 + (Math.random() * 0.5),
            ratingsCount: 500 + Math.floor(Math.random() * 15000),
            featured: i % 12 === 0,
            trending: i % 8 === 0,
            highlights: [
                "Crispy & Crunchy Texture",
                "Made with Quality Ingredients",
                "Perfect Tea-Time Partner",
                "Hygienically Packed",
                "Long Shelf Life"
            ],
            specifications: {
                "Net Weight": weight,
                "Type": typeData.type,
                "Shelf Life": "9 Months",
                "Vegetarian": "Yes",
                "Storage": "Store in an airtight container after opening"
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

        const deleted = await Product.deleteMany({ type: "Biscuits", section: "Late Night Cravings" });
        console.log(`🗑️ ${deleted.deletedCount} existing biscuit products cleared.`);

        const biscuits = generateBiscuits();
        await Product.insertMany(biscuits);
        console.log(`🌱 ${biscuits.length} Biscuits products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
