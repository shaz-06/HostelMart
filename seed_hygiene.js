const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const hygieneBrands = ["Whisper", "Stayfree", "Sofy", "Nua", "Paree", "Everteen", "Carmesi", "Kotex"];

const padTypes = [
    { type: "Regular Sanitary Pads", absorbency: "Regular", size: "Regular" },
    { type: "XL Sanitary Pads", absorbency: "Super", size: "XL" },
    { type: "Overnight Pads", absorbency: "Overnight", size: "XXL" },
    { type: "Ultra Thin Pads", absorbency: "Regular", size: "Ultra Thin" },
    { type: "Cotton Soft Pads", absorbency: "Regular", size: "L" },
    { type: "Maxi Pads", absorbency: "Super Plus", size: "XL" },
    { type: "Panty Liners", absorbency: "Light", size: "Standard" },
    { type: "Rash-Free Pads", absorbency: "Regular", size: "XL" },
    { type: "Organic Pads", absorbency: "Regular", size: "XL" },
    { type: "Combo Packs", absorbency: "Mixed", size: "Mixed" }
];

const hygieneImages = [
    "https://images.unsplash.com/photo-1583947581924-860bda6a26df?q=80&w=800&auto=format&fit=crop", // Hygiene products
    "https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=800&auto=format&fit=crop", // General health
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop"  // Personal care
];

const generateHygiene = () => {
    const products = [];
    for (let i = 1; i <= 35; i++) {
        const brand = hygieneBrands[Math.floor(Math.random() * hygieneBrands.length)];
        const padData = padTypes[Math.floor(Math.random() * padTypes.length)];
        
        const quantity = [7, 15, 30, 40][Math.floor(Math.random() * 4)];
        const fragrance = i % 3 === 0 ? "Lavender" : i % 5 === 0 ? "Aloe Vera" : "Fragrance-Free";
        
        const name = `${brand} ${padData.type} - Pack of ${quantity}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const price = 99 + Math.floor(Math.random() * 400);
        const originalPrice = Math.floor(price * 1.3);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 3);

        products.push({
            name,
            slug,
            brand,
            description: `High-quality ${padData.type} from ${brand}. Features ${padData.absorbency} absorbency and ${padData.size} size. ${fragrance} variant. Designed for maximum comfort and protection during periods. Essential for personal hygiene and emergency needs.`,
            category: "Beauty & Personal Care",
            subcategory: "Personal Hygiene",
            section: "Emergency Needs",
            type: padData.type,
            size: padData.size,
            absorbency: padData.absorbency,
            quantity: `Pack of ${quantity}`,
            fragrance,
            expiryDate: expiry.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            image: hygieneImages[Math.floor(Math.random() * hygieneImages.length)],
            images: [hygieneImages[Math.floor(Math.random() * hygieneImages.length)], hygieneImages[0]],
            price,
            originalPrice,
            discount,
            stock: 40 + Math.floor(Math.random() * 150),
            rating: 4.4 + (Math.random() * 0.5),
            ratingsCount: 200 + Math.floor(Math.random() * 8000),
            featured: i % 6 === 0,
            trending: i % 9 === 0,
            highlights: [
                "Soft Top Layer for Comfort",
                "Wide Wings for Extra Security",
                "Advanced Leak Protection",
                "Odor Lock Technology",
                "Individually Wrapped"
            ],
            specifications: {
                "Type": padData.type,
                "Size": padData.size,
                "Absorbency": padData.absorbency,
                "Pack Quantity": `${quantity} Pads`,
                "Fragrance": fragrance
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

        const deleted = await Product.deleteMany({ subcategory: "Personal Hygiene", section: "Emergency Needs" });
        console.log(`🗑️ ${deleted.deletedCount} existing hygiene products cleared.`);

        const hygiene = generateHygiene();
        await Product.insertMany(hygiene);
        console.log(`🌱 ${hygiene.length} Hygiene products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
