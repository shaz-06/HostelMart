const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const pillows = [
    {
        name: "Wakefit Hollow Fiber Sleeping Pillow - Set of 2",
        slug: "wakefit-hollow-fiber-sleeping-pillow-set-2",
        brand: "Wakefit",
        description: "Wakefit's Hollow Fiber Pillows are designed to give you a cloud-like sleeping experience. Made with premium fiber filling and a breathable fabric cover. Hypoallergenic and highly durable.",
        category: "Home",
        subcategory: "Bedroom",
        section: "Daily Use Essentials",
        material: "Fiber",
        size: "Standard",
        firmness: "Soft",
        colors: ["White"],
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
        ],
        price: 599,
        originalPrice: 999,
        discount: "40% OFF",
        stock: 150,
        rating: 4.6,
        ratingsCount: 2450,
        highlights: ["Set of 2 Pillows", "Hollow Fiber Filling", "Hypoallergenic", "Breathable Fabric"],
        featured: true,
        trending: true,
        createdAt: new Date()
    },
    {
        name: "SleepyCat Memory Foam Orthopedic Pillow",
        slug: "sleepycat-memory-foam-orthopedic-pillow",
        brand: "SleepyCat",
        description: "Achieve the perfect neck alignment with SleepyCat's Memory Foam Orthopedic Pillow. Contoured design specifically for neck support. Ideal for side and back sleepers.",
        category: "Home",
        subcategory: "Bedroom",
        section: "Daily Use Essentials",
        material: "Memory Foam",
        size: "King",
        firmness: "Medium Firm",
        colors: ["White", "Grey"],
        image: "https://images.unsplash.com/photo-1632102911657-33f78e079738?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1632102911657-33f78e079738?auto=format&fit=crop&w=800&q=80"
        ],
        price: 1499,
        originalPrice: 2499,
        discount: "40% OFF",
        stock: 80,
        rating: 4.8,
        ratingsCount: 890,
        highlights: ["Contoured Memory Foam", "Removable Cover", "Orthopedic Support", "Neck Pain Relief"],
        featured: true,
        trending: true,
        createdAt: new Date()
    }
];

const brands = ["Wakefit", "SleepyCat", "Spaces", "Home Centre", "Solimo", "Kurlon"];
const materials = ["Memory Foam", "Fiber", "Cotton", "Latex", "Microfiber"];
const sizes = ["Standard", "King", "Queen", "Travel"];
const firmnessTypes = ["Soft", "Medium", "Firm", "Medium Firm"];
const types = ["Sleeping", "Memory Foam", "Cotton", "Fiber", "Neck", "Travel", "Orthopedic", "Soft", "Set", "Kids"];

function generatePillows(count) {
    const products = [];
    for (let i = 0; i < count; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const firmness = firmnessTypes[Math.floor(Math.random() * firmnessTypes.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const basePrice = size === "Travel" ? 299 : size === "Standard" ? 499 : size === "Queen" ? 799 : 999;
        const price = basePrice + Math.floor(Math.random() * 500);
        const originalPrice = price + Math.floor(Math.random() * 800) + 200;
        const discountVal = Math.round(((originalPrice - price) / originalPrice) * 100);

        products.push({
            name: `${brand} ${type} ${material} ${size} Pillow`,
            slug: `${brand.toLowerCase().replace(/ /g, '-')}-${type.toLowerCase().replace(/ /g, '-')}-${material.toLowerCase().replace(/ /g, '-')}-${i}`,
            brand: brand,
            description: `Premium ${type} pillow by ${brand}. Made with high-quality ${material} filling for ultimate comfort. This ${size} size pillow offers ${firmness} support, making it perfect for a restful night's sleep. Ideal for students and home users alike.`,
            category: "Home",
            subcategory: "Bedroom",
            section: "Daily Use Essentials",
            material: material,
            size: size,
            firmness: firmness,
            colors: ["White", "Cloud Blue", "Mist Grey"],
            image: `https://images.unsplash.com/photo-${1584132967334 + i}-10e028bd69f7?auto=format&fit=crop&w=800&q=80`,
            images: [`https://images.unsplash.com/photo-${1584132967334 + i}-10e028bd69f7?auto=format&fit=crop&w=800&q=80`],
            price: price,
            originalPrice: originalPrice,
            discount: `${discountVal}% OFF`,
            stock: 30 + Math.floor(Math.random() * 100),
            rating: 3.9 + (Math.random() * 1.1),
            ratingsCount: 50 + Math.floor(Math.random() * 500),
            highlights: [`${material} Filling`, `${firmness} Firmness`, `${size} Size`, "Breathable Material", "Long-lasting Loft"],
            featured: i % 4 === 0,
            trending: i % 3 === 0,
            createdAt: new Date()
        });
    }
    return products;
}

const allPillows = [...pillows, ...generatePillows(33)];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Note: We don't want to clear ALL Bedroom products because Bedsheets are there too.
        // We filter by "Pillow" in the name or we should have used a better subcategory.
        // But since the user wants them in "Bedroom", I'll delete products with "Pillow" in name for this subcategory.
        const result = await Product.deleteMany({ subcategory: "Bedroom", name: /Pillow/i });
        console.log(`🗑️ ${result.deletedCount} existing pillow products cleared.`);

        await Product.insertMany(allPillows);
        console.log(`🌱 ${allPillows.length} Pillow products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
