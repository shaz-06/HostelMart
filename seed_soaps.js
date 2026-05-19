const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const soapBrands = ["Dove", "Lux", "Lifebuoy", "Pears", "Santoor", "Dettol", "Himalaya", "Medimix"];

const soapTypes = [
    { type: "Bath Soaps", fragrance: "Mild", skinType: "Normal Skin", ingredients: ["Sodium Palmate", "Glycerin"] },
    { type: "Herbal Soaps", fragrance: "Neem", skinType: "All Skin Types", ingredients: ["Neem Extract", "Tulsi"] },
    { type: "Moisturizing Soaps", fragrance: "Honey & Cream", skinType: "Dry Skin", ingredients: ["Moisturizing Cream", "Vitamin E"] },
    { type: "Antibacterial Soaps", fragrance: "Lemon", skinType: "All Skin Types", ingredients: ["Chloroxylenol", "Lemon Oil"] },
    { type: "Charcoal Soaps", fragrance: "Charcoal", skinType: "Oily Skin", ingredients: ["Activated Charcoal", "Peppermint Oil"] },
    { type: "Aloe Vera Soaps", fragrance: "Aloe Vera", skinType: "Sensitive Skin", ingredients: ["Aloe Vera Extract", "Glycerin"] },
    { type: "Ayurvedic Soaps", fragrance: "Sandalwood", skinType: "All Skin Types", ingredients: ["Sandalwood Oil", "Eladi Oil"] },
    { type: "Glycerin Soaps", fragrance: "Lavender", skinType: "Normal Skin", ingredients: ["Pure Glycerin", "Lavender Extract"] },
    { type: "Luxury Soaps", fragrance: "Rose", skinType: "All Skin Types", ingredients: ["French Rose Extract", "Silk Protein"] },
    { type: "Combo Soap Packs", fragrance: "Assorted", skinType: "All Skin Types", ingredients: ["Various Natural Extracts"] }
];

const soapImages = [
    "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=800&auto=format&fit=crop", // Soap bars
    "https://images.unsplash.com/photo-1605266819144-d134304e2a44?q=80&w=800&auto=format&fit=crop", // Natural soap
    "https://images.unsplash.com/photo-1554462411-c4bb76bc3897?q=80&w=800&auto=format&fit=crop"  // Bathroom/Soap
];

const generateSoaps = () => {
    const products = [];
    for (let i = 1; i <= 35; i++) {
        const brand = soapBrands[Math.floor(Math.random() * soapBrands.length)];
        const soapData = soapTypes[Math.floor(Math.random() * soapTypes.length)];
        
        const weight = [75, 100, 125, 150][Math.floor(Math.random() * 4)] + "g";
        const quantity = i % 4 === 0 ? "Pack of 3" : "1 Bar";
        
        const name = `${brand} ${soapData.type} - ${weight}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const price = 35 + Math.floor(Math.random() * 300);
        const originalPrice = Math.floor(price * 1.3);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

        products.push({
            name,
            slug,
            brand,
            description: `Pamper your skin with ${brand} ${soapData.type}. Infused with ${soapData.ingredients.join(', ')} and a refreshing ${soapData.fragrance} fragrance. Specially designed for ${soapData.skinType} to provide a deep, nourishing cleanse.`,
            category: "Beauty & Personal Care",
            subcategory: "Personal Hygiene",
            section: "Daily Essentials",
            type: soapData.type,
            fragrance: soapData.fragrance,
            weight,
            skinType: soapData.skinType,
            quantity,
            ingredients: soapData.ingredients,
            image: soapImages[Math.floor(Math.random() * soapImages.length)],
            images: [soapImages[Math.floor(Math.random() * soapImages.length)], soapImages[0]],
            price,
            originalPrice,
            discount,
            stock: 60 + Math.floor(Math.random() * 300),
            rating: 4.2 + (Math.random() * 0.7),
            ratingsCount: 300 + Math.floor(Math.random() * 6000),
            featured: i % 8 === 0,
            trending: i % 11 === 0,
            highlights: [
                "Nourishing Formula",
                "Long-lasting Fragrance",
                "Deep Cleaning Action",
                "Gentle on Skin",
                "Clinically Tested"
            ],
            specifications: {
                "Fragrance": soapData.fragrance,
                "Weight": weight,
                "Skin Type": soapData.skinType,
                "Package": quantity,
                "Ingredients": soapData.ingredients.slice(0, 2).join(', ')
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

        const deleted = await Product.deleteMany({ subcategory: "Personal Hygiene", section: "Daily Essentials", type: { $regex: /soap/i } });
        console.log(`🗑️ ${deleted.deletedCount} existing soap products cleared.`);

        const soaps = generateSoaps();
        await Product.insertMany(soaps);
        console.log(`🌱 ${soaps.length} Soap products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
