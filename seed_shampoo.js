const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const shampooBrands = ["Head & Shoulders", "Dove", "Pantene", "Clinic Plus", "Sunsilk", "Tresemmé", "Himalaya", "Mamaearth", "WOW", "L'Oréal"];

const shampooTypes = [
    { type: "Anti-Dandruff Shampoo", hairType: "Oily Hair", fragrance: "Apple", ingredients: ["Zinc Pyrithione", "Menthol"] },
    { type: "Hair Fall Control Shampoo", hairType: "Damaged Hair", fragrance: "Onion", ingredients: ["Onion Seed Oil", "Biotin"] },
    { type: "Herbal Shampoo", hairType: "All Hair Types", fragrance: "Neem", ingredients: ["Neem", "Shikakai", "Reetha"] },
    { type: "Smoothening Shampoo", hairType: "Frizzy Hair", fragrance: "Argan Oil", ingredients: ["Argan Oil", "Keratin"] },
    { type: "Protein Shampoo", hairType: "Normal Hair", fragrance: "Mild", ingredients: ["Milk Protein", "Egg Protein"] },
    { type: "Damage Repair Shampoo", hairType: "Damaged Hair", fragrance: "Rose", ingredients: ["Ceramides", "Vitamin E"] },
    { type: "Ayurvedic Shampoo", hairType: "All Hair Types", fragrance: "Mix Herb", ingredients: ["Bhringraj", "Amla"] },
    { type: "Daily Use Shampoo", hairType: "Normal Hair", fragrance: "Fresh Mint", ingredients: ["Mild Surfactants", "Aloe Vera"] },
    { type: "Shampoo Combo Packs", hairType: "All Hair Types", fragrance: "Assorted", ingredients: ["Various Natural Extracts"] }
];

const shampooImages = [
    "https://images.unsplash.com/photo-1559591937-e6204d10fd49?q=80&w=800&auto=format&fit=crop", // General hair care
    "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop", // Shampoo bottle
    "https://images.unsplash.com/photo-1522338140262-f46f591261c8?q=80&w=800&auto=format&fit=crop"  // Bathroom products
];

const generateShampoos = () => {
    const products = [];
    for (let i = 1; i <= 35; i++) {
        const brand = shampooBrands[Math.floor(Math.random() * shampooBrands.length)];
        const shamData = shampooTypes[Math.floor(Math.random() * shampooTypes.length)];
        
        const volume = ["100ml", "180ml", "340ml", "400ml", "650ml"][Math.floor(Math.random() * 5)];
        const quantity = i % 5 === 0 ? "Pack of 2" : "1 Unit";
        
        const name = `${brand} ${shamData.type} - ${volume}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const price = 80 + Math.floor(Math.random() * 800);
        const originalPrice = Math.floor(price * 1.3);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

        products.push({
            name,
            slug,
            brand,
            description: `Revitalize your hair with ${brand} ${shamData.type}. Expertly crafted with ${shamData.ingredients.join(', ')} for ${shamData.hairType}. Features a refreshing ${shamData.fragrance} fragrance and deep cleansing formula.`,
            category: "Beauty & Personal Care",
            subcategory: "Personal Hygiene",
            section: "Daily Essentials",
            type: shamData.type,
            hairType: shamData.hairType,
            volume,
            quantity,
            fragrance: shamData.fragrance,
            ingredients: shamData.ingredients,
            image: shampooImages[Math.floor(Math.random() * shampooImages.length)],
            images: [shampooImages[Math.floor(Math.random() * shampooImages.length)], shampooImages[0]],
            price,
            originalPrice,
            discount,
            stock: 40 + Math.floor(Math.random() * 200),
            rating: 4.1 + (Math.random() * 0.8),
            ratingsCount: 500 + Math.floor(Math.random() * 12000),
            featured: i % 7 === 0,
            trending: i % 10 === 0,
            highlights: [
                "Advanced Scalp Care",
                "Root to Tip Nourishment",
                "Color Safe Formula",
                "Paraben & Sulphate Free Options",
                "Dermatologically Tested"
            ],
            specifications: {
                "Hair Type": shamData.hairType,
                "Volume": volume,
                "Fragrance": shamData.fragrance,
                "Main Ingredients": shamData.ingredients.slice(0, 2).join(', '),
                "Shelf Life": "36 Months"
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

        const deleted = await Product.deleteMany({ subcategory: "Personal Hygiene", section: "Daily Essentials", type: { $regex: /shampoo/i } });
        console.log(`🗑️ ${deleted.deletedCount} existing shampoo products cleared.`);

        const shampoos = generateShampoos();
        await Product.insertMany(shampoos);
        console.log(`🌱 ${shampoos.length} Shampoo products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
