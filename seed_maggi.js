const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const maggiProducts = [
    { type: "Maggi 2-Minute Noodles", baseFlavor: "Masala", spice: "Medium" },
    { type: "Maggi Masala Noodles", baseFlavor: "Spicy Masala", spice: "High" },
    { type: "Maggi Chicken Noodles", baseFlavor: "Chicken Masala", spice: "Medium" },
    { type: "Maggi Atta Noodles", baseFlavor: "Spinach Masala", spice: "Mild" },
    { type: "Maggi Cup Noodles", baseFlavor: "Cuppa Masala", spice: "High" },
    { type: "Maggi Cheese Noodles", baseFlavor: "Cheesy Masala", spice: "Mild" },
    { type: "Maggi Fusian Noodles", baseFlavor: "Hong Kong Spicy", spice: "Very High" },
    { type: "Maggi Oats Noodles", baseFlavor: "Veggie Masala", spice: "Mild" },
    { type: "Maggi Special Masala", baseFlavor: "Special Secret Masala", spice: "High" }
];

const packVariants = [
    { size: "Single Pack", weight: "70g", mult: 1 },
    { size: "Pack of 4", weight: "280g", mult: 3.8 },
    { size: "Pack of 6", weight: "420g", mult: 5.5 },
    { size: "Family Pack", weight: "840g", mult: 10 },
    { size: "Mini Cup", weight: "40g", mult: 0.8 },
    { size: "Jumbo Pack", weight: "1.2kg", mult: 14 }
];

const maggiImages = [
    "https://images.unsplash.com/photo-1599490659223-eb53957bd35b?q=80&w=800&auto=format&fit=crop", // Noodles
    "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=800&auto=format&fit=crop", // Bowl
    "https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=800&auto=format&fit=crop", // Cooking
    "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop"  // Close up
];

const generateMaggi = () => {
    const products = [];
    let count = 0;
    
    maggiProducts.forEach(base => {
        packVariants.forEach(variant => {
            count++;
            const name = `${base.type} - ${base.baseFlavor} (${variant.size})`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + count;
            
            const basePrice = 14;
            const price = Math.floor(basePrice * variant.mult);
            const originalPrice = Math.floor(price * 1.15);
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
            
            const expiry = new Date();
            expiry.setMonth(expiry.getMonth() + 9);

            products.push({
                name,
                slug,
                brand: "Maggi",
                description: `Experience the classic taste of ${base.type} in ${base.baseFlavor} flavor. This ${variant.size} is perfect for satisfying those late-night hostel cravings. Features a ${base.spice} spice level for the perfect kick.`,
                category: "Food",
                subcategory: "Snacks",
                section: "Late Night Cravings",
                type: base.type,
                flavor: base.baseFlavor,
                weight: variant.weight,
                packSize: variant.size,
                spiceLevel: base.spice,
                dietaryType: base.type.includes("Chicken") ? "Non-Veg" : "Veg",
                expiryDate: expiry.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
                image: maggiImages[Math.floor(Math.random() * maggiImages.length)],
                images: [maggiImages[0], maggiImages[1]],
                price,
                originalPrice,
                discount,
                stock: 100 + Math.floor(Math.random() * 400),
                rating: 4.5 + (Math.random() * 0.5),
                ratingsCount: 500 + Math.floor(Math.random() * 10000),
                featured: count % 10 === 0,
                trending: count % 7 === 0,
                highlights: [
                    "Iconic 2-Minute Recipe",
                    `${base.spice} Spice Level`,
                    "Rich Masala Aroma",
                    "Perfect Midnight Snack",
                    "High Quality Ingredients"
                ],
                specifications: {
                    "Net Weight": variant.weight,
                    "Format": variant.size,
                    "Vegetarian": base.type.includes("Chicken") ? "No" : "Yes",
                    "Prep Time": "2 Minutes",
                    "Shelf Life": "9 Months"
                },
                createdAt: new Date()
            });
        });
    });
    
    return products.slice(0, 30); // Return first 30 variations
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Note: We don't delete everything in Late Night Cravings, just Maggi brand to update it
        const deleted = await Product.deleteMany({ brand: "Maggi", section: "Late Night Cravings" });
        console.log(`🗑️ ${deleted.deletedCount} existing Maggi products cleared.`);

        const maggi = generateMaggi();
        await Product.insertMany(maggi);
        console.log(`🌱 ${maggi.length} Maggi products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
