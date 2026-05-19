const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const toothpasteBrands = ["Colgate", "Pepsodent", "Sensodyne", "Dabur Red", "Patanjali", "Closeup", "Himalaya", "Oral-B"];

const toothpasteTypes = [
    { type: "Whitening Toothpaste", flavor: "Sparkling Mint", ingredients: ["Silica", "Fluoride", "Baking Soda"] },
    { type: "Herbal Toothpaste", flavor: "Neem & Clove", ingredients: ["Neem", "Clove Oil", "Calcium Carbonate"] },
    { type: "Sensitive Teeth Toothpaste", flavor: "Fresh Mint", ingredients: ["Potassium Nitrate", "Fluoride"] },
    { type: "Charcoal Toothpaste", flavor: "Cool Mint", ingredients: ["Activated Charcoal", "Peppermint Oil"] },
    { type: "Gel Toothpaste", flavor: "Icy Cool", ingredients: ["Sorbitol", "Silica", "Mint Extract"] },
    { type: "Kids Toothpaste", flavor: "Bubblegum", ingredients: ["Mild Abrasives", "Low Fluoride"] },
    { type: "Ayurvedic Toothpaste", flavor: "Mix Herb", ingredients: ["Babool", "Meswak", "Vajradanti"] },
    { type: "Cavity Protection Toothpaste", flavor: "Strong Mint", ingredients: ["Fluoride", "Calcium"] },
    { type: "Fresh Mint Toothpaste", flavor: "Peppermint", ingredients: ["Menthol", "Fluoride"] },
    { type: "Combo Toothpaste Packs", flavor: "Classic Mint", ingredients: ["Standard Formulas"] }
];

const toothpasteImages = [
    "https://images.unsplash.com/photo-1559591937-e6204d10fd49?q=80&w=800&auto=format&fit=crop", // Mouthwash/Paste
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop", // General hygiene
    "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=800&auto=format&fit=crop"  // Toothbrush/Paste
];

const generateToothpaste = () => {
    const products = [];
    for (let i = 1; i <= 30; i++) {
        const brand = toothpasteBrands[Math.floor(Math.random() * toothpasteBrands.length)];
        const pasteData = toothpasteTypes[Math.floor(Math.random() * toothpasteTypes.length)];
        
        const weight = [50, 100, 150, 200][Math.floor(Math.random() * 4)] + "g";
        const quantity = i % 5 === 0 ? "Pack of 2" : "1 Unit";
        
        const name = `${brand} ${pasteData.type} - ${weight}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const price = 45 + Math.floor(Math.random() * 200);
        const originalPrice = Math.floor(price * 1.2);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

        products.push({
            name,
            slug,
            brand,
            description: `Experience superior oral hygiene with ${brand} ${pasteData.type}. Formulated with ${pasteData.ingredients.join(', ')} to provide the best care for your teeth and gums. ${pasteData.flavor} flavor for long-lasting freshness.`,
            category: "Beauty & Personal Care",
            subcategory: "Personal Hygiene",
            section: "Daily Essentials",
            type: pasteData.type,
            flavor: pasteData.flavor,
            weight,
            quantity,
            ingredients: pasteData.ingredients,
            image: toothpasteImages[Math.floor(Math.random() * toothpasteImages.length)],
            images: [toothpasteImages[Math.floor(Math.random() * toothpasteImages.length)], toothpasteImages[0]],
            price,
            originalPrice,
            discount,
            stock: 50 + Math.floor(Math.random() * 200),
            rating: 4.3 + (Math.random() * 0.6),
            ratingsCount: 150 + Math.floor(Math.random() * 4000),
            featured: i % 7 === 0,
            trending: i % 10 === 0,
            highlights: [
                "Advanced Cavity Protection",
                "Long-lasting Fresh Breath",
                "Deep Cleaning Action",
                "Enamel Protection",
                "Trusted by Dentists"
            ],
            specifications: {
                "Flavor": pasteData.flavor,
                "Weight": weight,
                "Package": quantity,
                "Shelf Life": "24 Months",
                "Main Ingredients": pasteData.ingredients.slice(0, 2).join(', ')
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

        const deleted = await Product.deleteMany({ subcategory: "Personal Hygiene", section: "Daily Essentials", type: { $regex: /toothpaste/i } });
        console.log(`🗑️ ${deleted.deletedCount} existing toothpaste products cleared.`);

        const toothpaste = generateToothpaste();
        await Product.insertMany(toothpaste);
        console.log(`🌱 ${toothpaste.length} Toothpaste products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
