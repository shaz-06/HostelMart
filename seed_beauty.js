const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const beautyBrands = ["Himalaya", "Mamaearth", "Dove", "Nivea", "Garnier", "L'Oréal", "WOW", "Pantene", "Head & Shoulders", "Parachute"];

const beautyTypes = [
    {
        type: "Face Wash",
        subcategory: "Face Care",
        items: ["Neem Face Wash", "Charcoal Face Wash", "Acne Control Face Wash", "Vitamin C Face Wash", "Oil Control Face Wash"],
        brands: ["Himalaya", "Mamaearth", "Garnier", "WOW", "Nivea"],
        skinTypes: ["All Skin Types", "Oily Skin", "Dry Skin", "Sensitive Skin", "Normal Skin"],
        hairTypes: [],
        ingredients: ["Neem Extract", "Charcoal", "Vitamin C", "Aloe Vera", "Salicylic Acid"],
        volumes: ["50ml", "100ml", "150ml"],
        fragrances: ["Mild", "Lemon", "Aloe Vera", "Rose"]
    },
    {
        type: "Creams",
        subcategory: "Face Care",
        items: ["Moisturizing Cream", "Night Cream", "Aloe Vera Cream", "Brightening Cream", "Sunscreen Cream"],
        brands: ["Nivea", "Mamaearth", "Himalaya", "L'Oréal", "Garnier"],
        skinTypes: ["All Skin Types", "Dry Skin", "Sensitive Skin", "Normal Skin"],
        hairTypes: [],
        ingredients: ["Aloe Vera", "Vitamin E", "Hyaluronic Acid", "Sandalwood"],
        volumes: ["50g", "100g", "200g"],
        fragrances: ["Mild", "Rose", "Sandalwood"]
    },
    {
        type: "Hair Oil",
        subcategory: "Hair Care",
        items: ["Coconut Hair Oil", "Almond Hair Oil", "Onion Hair Oil", "Ayurvedic Hair Oil", "Anti Hair Fall Oil"],
        brands: ["Parachute", "Mamaearth", "WOW", "Himalaya"],
        skinTypes: [],
        hairTypes: ["All Hair Types", "Dry Hair", "Damaged Hair", "Frizzy Hair"],
        ingredients: ["Coconut Oil", "Almond Oil", "Onion Extract", "Amla", "Bhringraj"],
        volumes: ["100ml", "200ml", "500ml"],
        fragrances: ["Coconut", "Almond", "Onion", "Herbal"]
    },
    {
        type: "Shampoo",
        subcategory: "Hair Care",
        items: ["Anti-Dandruff Shampoo", "Smoothening Shampoo", "Hair Fall Control Shampoo", "Herbal Shampoo", "Protein Shampoo"],
        brands: ["Head & Shoulders", "Pantene", "Dove", "L'Oréal", "WOW", "Mamaearth"],
        skinTypes: [],
        hairTypes: ["All Hair Types", "Oily Hair", "Damaged Hair", "Frizzy Hair"],
        ingredients: ["ZPTO", "Keratin", "Argan Oil", "Protein", "Aloe Vera"],
        volumes: ["180ml", "340ml", "400ml", "650ml"],
        fragrances: ["Mild", "Apple", "Argan Oil", "Fresh"]
    }
];

const generateBeautyProducts = () => {
    const products = [];
    let idCounter = 1;

    for (const categoryData of beautyTypes) {
        // Generate 18 products per type to get 72 total
        for (let i = 0; i < 18; i++) {
            const item = categoryData.items[Math.floor(Math.random() * categoryData.items.length)];
            const brand = categoryData.brands[Math.floor(Math.random() * categoryData.brands.length)];
            const volume = categoryData.volumes[Math.floor(Math.random() * categoryData.volumes.length)];
            const ingredient = categoryData.ingredients[Math.floor(Math.random() * categoryData.ingredients.length)];
            
            const skinType = categoryData.skinTypes.length > 0 ? categoryData.skinTypes[Math.floor(Math.random() * categoryData.skinTypes.length)] : undefined;
            const hairType = categoryData.hairTypes.length > 0 ? categoryData.hairTypes[Math.floor(Math.random() * categoryData.hairTypes.length)] : undefined;
            const fragrance = categoryData.fragrances.length > 0 ? categoryData.fragrances[Math.floor(Math.random() * categoryData.fragrances.length)] : undefined;
            
            const name = `${brand} ${item} - ${volume}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            const price = 80 + Math.floor(Math.random() * 600);
            const originalPrice = Math.floor(price * 1.3);
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `Premium ${item} from ${brand}, enriched with ${ingredient}. Perfect for your daily beauty and personal care routine. Clinically tested and safe.`,
                category: "Beauty & Personal Care",
                subcategory: categoryData.subcategory,
                section: "Daily Essentials",
                type: categoryData.type,
                skinType,
                hairType,
                ingredients: [ingredient, "Aqua", "Glycerin"],
                volume: volume.includes('ml') || volume.includes('L') ? volume : undefined,
                weight: volume.includes('g') ? volume : undefined,
                fragrance,
                expiryDate: "36 Months from Manufacture",
                image: `https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 400}`,
                images: [`https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 400}`],
                price,
                originalPrice,
                discount,
                stock: 40 + Math.floor(Math.random() * 150),
                rating: 4.2 + (Math.random() * 0.8),
                ratingsCount: 200 + Math.floor(Math.random() * 3000),
                featured: i % 5 === 0,
                trending: i % 7 === 0,
                highlights: [
                    "Dermatologically Tested",
                    "Cruelty Free",
                    "No Harmful Chemicals",
                    "Long Lasting Effect"
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

        const targetTypes = beautyTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Beauty & Personal Care", 
            section: "Daily Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing beauty products cleared.`);

        const beautyProducts = generateBeautyProducts();
        await Product.insertMany(beautyProducts);
        console.log(`🌱 ${beautyProducts.length} Beauty & Personal Care products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
