const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const productGroups = [
    {
        typeGroup: "Soap",
        subcategory: "Personal Hygiene",
        types: ["Bath Soaps", "Herbal Soaps", "Moisturizing Soaps", "Antibacterial Soaps", "Charcoal Soaps"],
        brands: ["Dove", "Lux", "Lifebuoy", "Himalaya", "Mamaearth"],
        weights: ["75g", "100g", "125g", "150g"],
        fragrances: ["Mild", "Lemon", "Rose", "Sandalwood", "Neem", "Charcoal"],
        skinTypes: ["All Skin Types", "Dry Skin", "Oily Skin"]
    },
    {
        typeGroup: "Shampoo",
        subcategory: "Hair Care",
        types: ["Anti-Dandruff Shampoo", "Hair Fall Control Shampoo", "Herbal Shampoo", "Smoothening Shampoo", "Protein Shampoo"],
        brands: ["Head & Shoulders", "Pantene", "Sunsilk", "Himalaya", "Dove", "Mamaearth"],
        volumes: ["180ml", "340ml", "400ml", "650ml"],
        fragrances: ["Mild", "Apple", "Fresh", "Unscented"],
        hairTypes: ["All Hair Types", "Dry Hair", "Oily Hair", "Damaged Hair", "Frizzy Hair"]
    },
    {
        typeGroup: "Toothpaste",
        subcategory: "Personal Hygiene",
        types: ["Whitening Toothpaste", "Herbal Toothpaste", "Sensitive Toothpaste", "Gel Toothpaste", "Charcoal Toothpaste"],
        brands: ["Colgate", "Sensodyne", "Himalaya"],
        weights: ["50g", "100g", "150g", "200g"],
        fragrances: ["Fresh Mint", "Cool Mint", "Peppermint", "Clove", "Charcoal Mint"]
    },
    {
        typeGroup: "Face Wash",
        subcategory: "Face Care",
        types: ["Neem Face Wash", "Charcoal Face Wash", "Acne Control Face Wash", "Vitamin C Face Wash", "Oil Control Face Wash"],
        brands: ["Himalaya", "Mamaearth", "Dove"],
        volumes: ["50ml", "100ml", "150ml"],
        fragrances: ["Mild", "Lemon", "Neem", "Charcoal"],
        skinTypes: ["All Skin Types", "Oily Skin", "Dry Skin", "Sensitive Skin", "Normal Skin"]
    },
    {
        typeGroup: "Hair Oil",
        subcategory: "Hair Care",
        types: ["Coconut Hair Oil", "Almond Hair Oil", "Onion Hair Oil", "Ayurvedic Hair Oil", "Anti Hair Fall Oil"],
        brands: ["Parachute", "Indulekha", "Mamaearth", "Himalaya"],
        volumes: ["100ml", "200ml", "250ml", "500ml"],
        fragrances: ["Mild", "Coconut", "Almond", "Onion", "Herbal"],
        hairTypes: ["All Hair Types", "Dry Hair", "Damaged Hair"]
    },
    {
        typeGroup: "Sanitary Pads",
        subcategory: "Personal Hygiene",
        types: ["Regular Pads", "XL Pads", "Overnight Pads", "Ultra Thin Pads", "Panty Liners"],
        brands: ["Whisper", "Stayfree", "Sofy"],
        quantities: ["Pack of 6", "Pack of 15", "Pack of 30", "XL Pack", "Pack of 40"],
        fragrances: ["Unscented", "Mild", "Fresh"]
    }
];

const generateProducts = () => {
    const products = [];
    let idCounter = 1;

    for (const group of productGroups) {
        // Generating 17 items per group to reach >100 total (17 * 6 = 102)
        for (let i = 0; i < 17; i++) {
            const type = group.types[Math.floor(Math.random() * group.types.length)];
            const brand = group.brands[Math.floor(Math.random() * group.brands.length)];
            const fragrance = group.fragrances[Math.floor(Math.random() * group.fragrances.length)];
            
            const weight = group.weights ? group.weights[Math.floor(Math.random() * group.weights.length)] : null;
            const volume = group.volumes ? group.volumes[Math.floor(Math.random() * group.volumes.length)] : null;
            const quantity = group.quantities ? group.quantities[Math.floor(Math.random() * group.quantities.length)] : null;
            const skinType = group.skinTypes ? group.skinTypes[Math.floor(Math.random() * group.skinTypes.length)] : null;
            const hairType = group.hairTypes ? group.hairTypes[Math.floor(Math.random() * group.hairTypes.length)] : null;
            
            const name = `${brand} Premium ${type} - ${fragrance}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            const price = 50 + Math.floor(Math.random() * 450); // 50 to 500
            const originalPrice = Math.floor(price * 1.3); // 30% markup
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            const imageUrl = `https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 20000}`;

            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 2); // 2 years from now

            products.push({
                name,
                slug,
                brand,
                description: `Experience the best of ${group.subcategory.toLowerCase()} with ${brand}'s new ${type}. Infused with ${fragrance} essence, it offers premium care. Perfect for your daily routine.`,
                category: "Beauty & Personal Care",
                subcategory: group.subcategory,
                section: "Daily Essentials",
                type,
                skinType,
                hairType,
                fragrance,
                weight,
                volume,
                quantity,
                expiryDate: expiryDate.toISOString().split('T')[0],
                image: imageUrl,
                images: [imageUrl, imageUrl],
                price,
                originalPrice,
                discount,
                stock: 40 + Math.floor(Math.random() * 60),
                rating: 4.1 + (Math.random() * 0.8),
                ratingsCount: 150 + Math.floor(Math.random() * 850),
                featured: i % 5 === 0,
                trending: i % 4 === 0,
                highlights: [
                    `Brand: ${brand}`,
                    `Type: ${type}`,
                    skinType ? `Skin Type: ${skinType}` : null,
                    hairType ? `Hair Type: ${hairType}` : null,
                    `Fragrance: ${fragrance}`,
                    weight ? `Weight: ${weight}` : null,
                    volume ? `Volume: ${volume}` : null,
                    quantity ? `Quantity: ${quantity}` : null,
                ].filter(Boolean),
                createdAt: new Date()
            });
            idCounter++;
        }
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000
        });
        console.log("✅ MongoDB Connected Successfully");

        const targetTypes = [];
        productGroups.forEach(g => {
            targetTypes.push(...g.types);
        });

        const deleted = await Product.deleteMany({ 
            category: "Beauty & Personal Care", 
            section: "Daily Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing beauty & personal care products cleared.`);

        const products = generateProducts();
        await Product.insertMany(products);
        console.log(`🌱 ${products.length} beauty & personal care products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
