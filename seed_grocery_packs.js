const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const groceryPackTypes = [
    {
        type: "Monthly Grocery Packs",
        brands: ["Aashirvaad", "Fortune", "Tata"],
        weights: ["5kg", "10kg", "15kg"],
        dietaryTypes: ["Vegetarian"],
        included: ["Rice", "Atta", "Dal", "Oil", "Salt", "Sugar"]
    },
    {
        type: "Student Grocery Kits",
        brands: ["Maggi", "Britannia", "Tata", "Haldiram’s"],
        weights: ["2kg", "3kg", "5kg"],
        dietaryTypes: ["Vegetarian"],
        included: ["Noodles", "Biscuits", "Tea", "Namkeen", "Ready to Eat"]
    },
    {
        type: "Hostel Survival Packs",
        brands: ["Maggi", "Nescafé", "Britannia"],
        weights: ["1kg", "2kg"],
        dietaryTypes: ["Vegetarian"],
        included: ["Instant Noodles", "Coffee", "Cookies", "Soup", "Chips"]
    },
    {
        type: "Snack Combo Packs",
        brands: ["Haldiram’s", "Britannia", "MTR"],
        weights: ["500g", "1kg", "2kg"],
        dietaryTypes: ["Vegetarian"],
        included: ["Aloo Bhujia", "Moong Dal", "Cookies", "Mixture"]
    },
    {
        type: "Breakfast Combo Packs",
        brands: ["Kellogg’s", "MTR", "Nescafé"],
        weights: ["1kg", "2kg"],
        dietaryTypes: ["Vegetarian"],
        included: ["Corn Flakes", "Oats", "Poha", "Coffee"]
    },
    {
        type: "Essential Cooking Packs",
        brands: ["Fortune", "Tata", "Aashirvaad"],
        weights: ["3kg", "5kg"],
        dietaryTypes: ["Vegetarian"],
        included: ["Oil", "Salt", "Spices", "Sugar"]
    },
    {
        type: "Family Grocery Packs",
        brands: ["Aashirvaad", "Fortune"],
        weights: ["10kg", "20kg"],
        dietaryTypes: ["Vegetarian"],
        included: ["Atta", "Rice", "Oil", "Pulses", "Spices"]
    },
    {
        type: "Rice + Atta Combo Packs",
        brands: ["Aashirvaad", "Fortune"],
        weights: ["5kg", "10kg"],
        dietaryTypes: ["Vegetarian"],
        included: ["Basmati Rice", "Whole Wheat Atta"]
    },
    {
        type: "Tea & Biscuit Packs",
        brands: ["Tata", "Britannia", "Bru"],
        weights: ["1kg", "2kg"],
        dietaryTypes: ["Vegetarian"],
        included: ["Tea Powder", "Marie Gold", "Good Day", "Coffee"]
    },
    {
        type: "Emergency Grocery Packs",
        brands: ["Maggi", "MTR", "Haldiram’s"],
        weights: ["1kg", "2kg"],
        dietaryTypes: ["Vegetarian"],
        included: ["Instant Meals", "Noodles", "Namkeen", "Biscuits"]
    }
];

const generateGroceryPacks = () => {
    const products = [];
    let idCounter = 1;

    for (const pack of groceryPackTypes) {
        // Generate 5 products per type to get 50 total (exceeds min 40)
        for (let i = 0; i < 5; i++) {
            const brand = pack.brands[Math.floor(Math.random() * pack.brands.length)];
            const weight = pack.weights[Math.floor(Math.random() * pack.weights.length)];
            const dietaryType = pack.dietaryTypes[Math.floor(Math.random() * pack.dietaryTypes.length)];
            
            const name = `${brand} ${pack.type} - ${weight}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            const price = 250 + Math.floor(Math.random() * 2500);
            const originalPrice = Math.floor(price * 1.20);
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `Complete ${pack.type} by ${brand}. Perfect for your daily needs. Includes: ${pack.included.join(", ")}. Carefully packed and delivered to your doorstep.`,
                category: "Daily Needs",
                subcategory: "Grocery & Snacks",
                section: "Daily Essentials",
                type: pack.type,
                weight,
                dietaryType,
                includedItems: pack.included,
                packSize: weight,
                expiryDate: "6-12 Months from Manufacture",
                image: `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 700}`,
                images: [`https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 700}`],
                price,
                originalPrice,
                discount,
                stock: 20 + Math.floor(Math.random() * 150),
                rating: 4.3 + (Math.random() * 0.7),
                ratingsCount: 80 + Math.floor(Math.random() * 1000),
                featured: i % 2 === 0,
                trending: i % 3 === 0,
                highlights: [
                    "Value Combo Pack",
                    "Premium Quality Products",
                    "Savings Assured",
                    "Hostel/Family Friendly"
                ],
                createdAt: new Date()
            });
            idCounter++;
        }
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const targetTypes = groceryPackTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Daily Needs", 
            subcategory: "Grocery & Snacks", 
            section: "Daily Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing grocery pack products cleared.`);

        const groceryPacks = generateGroceryPacks();
        await Product.insertMany(groceryPacks);
        console.log(`🌱 ${groceryPacks.length} Grocery Pack products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
