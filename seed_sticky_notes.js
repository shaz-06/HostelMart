const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const Product = require('./models/Product');

const brands = ["Post-it", "Classmate", "Deli", "Kangaro", "Oddy", "Faber-Castell"];
const types = [
    "Classic Sticky Notes", "Neon Sticky Notes", "Pastel Sticky Notes", 
    "Transparent Sticky Notes", "Page Marker Sticky Notes", "Mini Sticky Notes", 
    "Large Sticky Notes", "Lined Sticky Notes", "Shape Sticky Notes", 
    "Multi-Color Sticky Note Packs"
];
const sizes = ["3\"x3\"", "2\"x2\"", "3\"x5\"", "1.5\"x2\"", "Standard", "Mini", "Large"];
const pageCounts = ["50 Sheets", "100 Sheets", "200 Sheets", "400 Sheets", "500 Sheets"];
const colorPacks = ["Neon Yellow", "Assorted Neon", "Pastel Pink", "Sky Blue", "Lime Green", "Transparent White", "Vibrant Multi-Color"];

const stickyImages = [
    "https://images.unsplash.com/photo-1593642632767-424228a27d59?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586075010633-de1de0bcbbd1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606146485652-75b340056157?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583321500900-82807e458f3c?q=80&w=800&auto=format&fit=crop"
];

const generateStickyNotes = () => {
    const products = [];
    for (let i = 1; i <= 35; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const pc = pageCounts[Math.floor(Math.random() * pageCounts.length)];
        const color = colorPacks[Math.floor(Math.random() * colorPacks.length)];
        
        const name = `${brand} ${type} - ${color} (${pc})`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[()"]/g, '').replace(/"/g, 'inch') + '-' + i + '-' + Math.random().toString(36).substring(7);
        
        const basePrice = type.includes("Packs") ? 250 : type.includes("Transparent") ? 150 : 45;
        const price = Math.round(basePrice + Math.random() * 100);
        const originalPrice = Math.floor(price * (1.15 + Math.random() * 0.3));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const mainImage = stickyImages[Math.floor(Math.random() * stickyImages.length)];
        
        products.push({
            name,
            slug,
            brand,
            description: `Keep your thoughts organized with the ${name} by ${brand}. These ${type} are perfect for reminders, bookmarks, and creative brainstorming. Featuring high-quality adhesive that sticks securely but removes cleanly. Size: ${size}. Total ${pc}.`,
            category: "Books",
            subcategory: "Study Essentials",
            section: "Student Essentials",
            type,
            size,
            pageCount: pc,
            colors: color.includes("Multi") ? ["Yellow", "Pink", "Blue", "Green"] : [color.split(' ')[0]],
            image: mainImage,
            images: [mainImage, stickyImages[(stickyImages.indexOf(mainImage) + 1) % stickyImages.length]],
            price,
            originalPrice,
            discount,
            stock: 50 + Math.floor(Math.random() * 300),
            rating: 4.3 + (Math.random() * 0.7),
            ratingsCount: 200 + Math.floor(Math.random() * 1500),
            featured: i <= 6,
            trending: i % 7 === 0,
            highlights: [
                "Strong adhesive, yet removes cleanly",
                "Bright, eye-catching colors",
                "Ideal for textbooks and planners",
                "Sustainable and recyclable paper",
                `${pc} value pack`
            ],
            specifications: {
                "Size": size,
                "Sheets": pc,
                "Adhesive Type": "Removable",
                "Type": type,
                "Brand": brand
            },
            createdAt: new Date()
        });
    }
    return products;
};

async function seedDB() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const deleted = await Product.deleteMany({ 
            subcategory: "Study Essentials", 
            $or: [
                { name: /Sticky/i },
                { type: /Sticky/i }
            ]
        });
        console.log(`🗑️ ${deleted.deletedCount} existing sticky note products cleared.`);

        const stickies = generateStickyNotes();
        await Product.insertMany(stickies);
        console.log(`🌱 ${stickies.length} Sticky Note products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
