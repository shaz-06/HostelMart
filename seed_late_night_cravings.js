const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const brands = ["Cadbury", "KitKat", "Oreo", "Britannia", "Sunfeast", "Parle", "Lay’s", "Haldiram’s", "Tropicana", "Real", "Minute Maid"];
const flavors = ["Classic", "Spicy", "Sweet", "Salty", "Tangy", "Cheese", "Chocolate", "Mango", "Mixed Fruit", "Vanilla"];
const dietaryTypes = ["Vegetarian", "Vegan", "Contains Egg", "Gluten Free"];
const weights = ["50g", "100g", "150g", "200g", "500g"];
const volumes = ["200ml", "250ml", "500ml", "1L"];

const productGroups = [
    {
        category: "Snacks",
        types: [
            { type: "Chips", packSizes: ["Pack of 1", "Pack of 3"] },
            { type: "Namkeen", packSizes: ["Pack of 1"] },
            { type: "Popcorn", packSizes: ["Pack of 2"] },
            { type: "Instant Snacks", packSizes: ["Pack of 1", "Pack of 4"] },
            { type: "Protein Snacks", packSizes: ["Pack of 1", "Pack of 6"] }
        ]
    },
    {
        category: "Chocolates",
        types: [
            { type: "Milk Chocolates", packSizes: ["Pack of 1", "Pack of 2"] },
            { type: "Dark Chocolates", packSizes: ["Pack of 1"] },
            { type: "Wafer Chocolates", packSizes: ["Pack of 3"] },
            { type: "Mini Chocolate Packs", packSizes: ["Pack of 10"] },
            { type: "Premium Chocolates", packSizes: ["Pack of 1"] }
        ]
    },
    {
        category: "Cookies",
        types: [
            { type: "Chocolate Cookies", packSizes: ["Pack of 1", "Pack of 2"] },
            { type: "Butter Cookies", packSizes: ["Pack of 1"] },
            { type: "Cream Cookies", packSizes: ["Pack of 1"] },
            { type: "Digestive Cookies", packSizes: ["Pack of 2"] },
            { type: "Oat Cookies", packSizes: ["Pack of 1", "Pack of 3"] }
        ]
    },
    {
        category: "Juices",
        types: [
            { type: "Fruit Juices", packSizes: ["Pack of 1"] },
            { type: "Mango Drinks", packSizes: ["Pack of 2", "Pack of 6"] },
            { type: "Mixed Fruit Drinks", packSizes: ["Pack of 1", "Pack of 4"] },
            { type: "Energy Juices", packSizes: ["Pack of 1"] },
            { type: "Tetra Pack Juices", packSizes: ["Pack of 6"] }
        ]
    }
];

const generateProducts = () => {
    const products = [];
    let idCounter = 1;

    for (const group of productGroups) {
        for (const t of group.types) {
            // 4 products per type (20 types * 4 = 80 products)
            for (let i = 0; i < 4; i++) {
                const brand = brands[Math.floor(Math.random() * brands.length)];
                const flavor = flavors[Math.floor(Math.random() * flavors.length)];
                const dietaryType = dietaryTypes[Math.floor(Math.random() * dietaryTypes.length)];
                const packSize = t.packSizes[Math.floor(Math.random() * t.packSizes.length)];
                
                const isDrink = group.category === "Juices";
                const weight = isDrink ? null : weights[Math.floor(Math.random() * weights.length)];
                const volume = isDrink ? volumes[Math.floor(Math.random() * volumes.length)] : null;
                
                const name = `${brand} Premium ${flavor} ${t.type}`;
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
                
                const price = 20 + Math.floor(Math.random() * 480); // 20 to 500
                const originalPrice = Math.floor(price * 1.25); // 25% markup
                const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

                const imageUrl = `https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 8000}`;

                const expiryDate = new Date();
                expiryDate.setMonth(expiryDate.getMonth() + 6); // 6 months from now

                products.push({
                    name,
                    slug,
                    brand,
                    description: `Satisfy your late night cravings with ${brand}'s delicious ${t.type}. A perfect ${flavor} treat for when you need a quick snack or drink. Dietary preference: ${dietaryType}.`,
                    category: "Daily Needs",
                    subcategory: "Grocery & Snacks",
                    section: "Late Night Cravings",
                    type: t.type,
                    flavor,
                    weight,
                    volume,
                    packSize,
                    dietaryType,
                    expiryDate: expiryDate.toISOString().split('T')[0],
                    image: imageUrl,
                    images: [imageUrl, imageUrl],
                    price,
                    originalPrice,
                    discount,
                    stock: 30 + Math.floor(Math.random() * 70),
                    rating: 4.0 + (Math.random() * 1.0),
                    ratingsCount: 100 + Math.floor(Math.random() * 900),
                    featured: i % 4 === 0,
                    trending: i % 3 === 0,
                    highlights: [
                        `Brand: ${brand}`,
                        `Type: ${t.type}`,
                        `Flavor: ${flavor}`,
                        isDrink ? `Volume: ${volume}` : `Weight: ${weight}`,
                        `Dietary: ${dietaryType}`
                    ],
                    createdAt: new Date()
                });
                idCounter++;
            }
        }
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const targetTypes = [];
        productGroups.forEach(g => {
            g.types.forEach(t => targetTypes.push(t.type));
        });

        const deleted = await Product.deleteMany({ 
            category: "Daily Needs", 
            subcategory: "Grocery & Snacks",
            section: "Late Night Cravings",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing late night craving products cleared.`);

        const products = generateProducts();
        await Product.insertMany(products);
        console.log(`🌱 ${products.length} late night craving products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
