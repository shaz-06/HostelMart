const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Coca-Cola", "Pepsi", "Sprite", "Fanta", "Mountain Dew", "Red Bull", "Sting", "Appy Fizz", "7UP", "Limca"];

const drinkTypes = [
    { type: "Soft Drinks", baseFlavor: "Cola", brands: ["Coca-Cola", "Pepsi"], sugar: "Regular" },
    { type: "Cola Drinks", baseFlavor: "Zero Cola", brands: ["Coca-Cola", "Pepsi"], sugar: "Zero Sugar" },
    { type: "Lemon Drinks", baseFlavor: "Lemon Lime", brands: ["Sprite", "7UP", "Limca"], sugar: "Regular" },
    { type: "Orange Drinks", baseFlavor: "Orange", brands: ["Fanta", "Pepsi"], sugar: "Regular" },
    { type: "Energy Drinks", baseFlavor: "Energy", brands: ["Red Bull", "Sting", "Mountain Dew"], sugar: "Regular" },
    { type: "Soda Drinks", baseFlavor: "Club Soda", brands: ["Coca-Cola", "Pepsi"], sugar: "Sugar-Free" },
    { type: "Sparkling Water", baseFlavor: "Sparkling", brands: ["Coca-Cola"], sugar: "Sugar-Free" },
    { type: "Fruit Beverages", baseFlavor: "Apple", brands: ["Appy Fizz"], sugar: "Regular" },
    { type: "Sports Drinks", baseFlavor: "Blue Bolt", brands: ["Pepsi", "Sting"], sugar: "Regular" },
    { type: "Combo Drink Packs", baseFlavor: "Mixed Party Pack", brands: ["Coca-Cola", "Pepsi"], sugar: "Regular" }
];

const drinkImages = [
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop", // Coke
    "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=800&auto=format&fit=crop", // Energy drink
    "https://images.unsplash.com/photo-1543253687-c931c8e01820?q=80&w=800&auto=format&fit=crop", // Soda cans
    "https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=800&auto=format&fit=crop"  // Cold bottle
];

const generateDrinks = () => {
    const products = [];
    for (let i = 1; i <= 40; i++) {
        const typeData = drinkTypes[Math.floor(Math.random() * drinkTypes.length)];
        const brand = typeData.brands[Math.floor(Math.random() * typeData.brands.length)];
        
        const volumes = ["250ml", "330ml", "600ml", "750ml", "1.25L", "2L", "2.25L"];
        const volume = brand === "Red Bull" ? "250ml" : volumes[Math.floor(Math.random() * volumes.length)];
        
        const name = `${brand} ${typeData.type} - ${typeData.baseFlavor} (${volume})`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const basePrice = brand.includes("Red Bull") ? 115 : brand.includes("Sting") ? 20 : 40;
        const volMult = volume.includes("2L") ? 2.5 : volume.includes("1.25L") ? 1.8 : volume.includes("600ml") ? 1 : 0.8;
        const price = Math.floor(basePrice * volMult) + Math.floor(Math.random() * 5);
        const originalPrice = Math.floor(price * 1.15);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 8);

        products.push({
            name,
            slug,
            brand,
            description: `Stay refreshed with the crisp and cool taste of ${brand} ${typeData.type}. Featuring the iconic ${typeData.baseFlavor} flavor, it's the perfect companion for your study sessions, gaming nights, or just to beat the hostel heat. Served best chilled.`,
            category: "Food",
            subcategory: "Snacks",
            section: "Late Night Cravings",
            type: "Cold Drinks",
            flavor: typeData.baseFlavor,
            volume: volume,
            packSize: i % 15 === 0 ? "Pack of 6" : i % 8 === 0 ? "Pack of 2" : "Single Bottle",
            sugarType: typeData.sugar,
            dietaryType: "Veg",
            expiryDate: expiry.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            image: drinkImages[Math.floor(Math.random() * drinkImages.length)],
            images: [drinkImages[Math.floor(Math.random() * drinkImages.length)], drinkImages[0]],
            price,
            originalPrice,
            discount,
            stock: 500 + Math.floor(Math.random() * 1000),
            rating: 4.4 + (Math.random() * 0.6),
            ratingsCount: 1000 + Math.floor(Math.random() * 20000),
            featured: i % 10 === 0,
            trending: i % 7 === 0,
            highlights: [
                "Refreshing Taste",
                "Best Served Chilled",
                `${typeData.sugar} Content`,
                "Recyclable Packaging",
                "Instant Energy Boost"
            ],
            specifications: {
                "Net Volume": volume,
                "Sugar Type": typeData.sugar,
                "Format": "Bottle/Can",
                "Shelf Life": "8 Months",
                "Storage": "Store in a cool place away from direct sunlight"
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

        const deleted = await Product.deleteMany({ type: "Cold Drinks", section: "Late Night Cravings" });
        console.log(`🗑️ ${deleted.deletedCount} existing cold drink products cleared.`);

        const drinks = generateDrinks();
        await Product.insertMany(drinks);
        console.log(`🌱 ${drinks.length} Cold Drink products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
