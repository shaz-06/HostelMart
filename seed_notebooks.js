/**
 * seed_notebooks.js
 * Comprehensive database seeding script for HostelMart to dynamically add
 * at least 250 realistic Notebook, Journal, Office Record, Creative, and Premium Eco products.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const Product = require('./models/Product');
const connectDB = require('./lib/mongodb');

// Target Brands
const brands = [
    "Classmate",
    "Navneet",
    "Camlin",
    "Doms",
    "Paperkraft",
    "Sundaram",
    "Solo",
    "Nightingale",
    "Luxor",
    "Faber-Castell"
];

// Product Groups & Types
const groups = {
    "Notebooks": [
        "Long Notebook", "Short Notebook", "Spiral Notebook", "Hardcover Notebook", "Softcover Notebook",
        "A4 Notebook", "A5 Notebook", "Pocket Notebook", "Ruled Notebook", "Unruled Notebook", "Graph Notebook",
        "Practical Record Notebook", "Lab Record Book", "Drawing Notebook", "Sketchbook", "Composition Notebook",
        "Subject Notebook", "Single Line Notebook", "Double Line Notebook", "Four Line Notebook", "Square Line Notebook",
        "Engineering Notebook", "Project Notebook", "Assignment Book", "Exam Writing Pad", "Writing Pad",
        "Sticky Note Pad", "Memo Pad", "Legal Pad", "Campus Notebook", "Subject Wise Notebook", "Jumbo Notebook",
        "Executive Notebook", "Ring Binder Notebook", "Refillable Notebook", "Smart Reusable Notebook", "Whiteboard Notebook",
        "Handmade Paper Notebook", "Designer Notebook", "Anime Theme Notebook", "Motivational Quote Notebook",
        "Customized Name Notebook", "Cartoon Theme Notebook"
    ],
    "Journals & Planners": [
        "Bullet Journal", "Planner Notebook", "Diary Notebook", "Hardcover Journal", "Travel Journal",
        "Password Book", "Daily Planner Book", "Weekly Planner Book", "Monthly Planner Book",
        "Goal Planner Notebook", "Fitness Journal", "Gratitude Journal", "Recipe Notebook", "Idea Book",
        "Coding Notes Book", "Business Notebook"
    ],
    "Office & Record Books": [
        "Attendance Register", "Ledger Book", "Account Book", "Teacher Record Book", "Student Record Book",
        "Complaint Register", "Visitor Register", "Cash Book", "GST Account Book", "Invoice Book",
        "Carbon Copy Notebook", "Medical Record Notebook"
    ],
    "Creative & Kids": [
        "Scrapbook", "Music Notebook", "Calligraphy Practice Book", "Handwriting Practice Book",
        "Kids Activity Notebook", "Coloring Notebook", "Dotted Notebook", "Grid Notebook", "Plain Paper Notebook"
    ],
    "Premium & Eco": [
        "Premium Leather Notebook", "Eco-Friendly Notebook", "Recycled Paper Notebook", "Mini Pocket Diary"
    ]
};

// Image pools for high visual appeal (matching the themes perfectly)
const groupImages = {
    "Notebooks": [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop"
    ],
    "Journals & Planners": [
        "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop"
    ],
    "Office & Record Books": [
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop"
    ],
    "Creative & Kids": [
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?q=80&w=800&auto=format&fit=crop"
    ],
    "Premium & Eco": [
        "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=800&auto=format&fit=crop"
    ]
};

// Design Specifications Pool
const sizes = ["A4", "A5", "B5", "Executive", "Pocket", "Legal"];
const pageCounts = ["120 Pages", "160 Pages", "200 Pages", "300 Pages", "400 Pages", "500 Pages"];
const rulingTypes = ["Single Line Ruled", "Unruled / Plain", "Grid / Square Ruled", "Dotted", "Double Line Ruled", "Four Line Ruled"];
const bindingTypes = ["Soft Bound", "Hard Bound", "Spiral Bound", "Wiro Bound", "Stitch Bound", "Loose Leaf"];
const paperQualities = ["70 GSM Premium", "80 GSM Ultra-White", "90 GSM Executive", "100 GSM Bullet Journal Grade", "120 GSM Sketching Grade", "60 GSM Recycled"];

const colorsPool = [
    "Midnight Blue", 
    "Forest Green", 
    "Royal Black", 
    "Vibrant Orange", 
    "Sunset Yellow", 
    "Pastel Pink", 
    "Tan Brown",
    "Classic Black",
    "Professional Blue",
    "Vibrant Red",
    "Neon Yellow"
];

// Flat list of all subgroups mapping back to parent groups for simple deterministic indexing
const flatTypes = [];
Object.entries(groups).forEach(([groupName, subtypes]) => {
    subtypes.forEach(type => {
        flatTypes.push({ groupName, type });
    });
});

// Generate 270 beautiful, uniquely-named, SEO-optimized notebook products
const generate270Products = () => {
    const products = [];
    const countToGenerate = 270;

    for (let i = 0; i < countToGenerate; i++) {
        const brand = brands[i % brands.length];
        const flatItem = flatTypes[i % flatTypes.length];
        const parentGroup = flatItem.groupName;
        const type = flatItem.type;

        // Deterministic features to maintain high quality & variety
        const size = sizes[(i + 1) % sizes.length];
        const pageCount = pageCounts[(i + 3) % pageCounts.length];
        const rulingType = rulingTypes[(i + i % 3) % rulingTypes.length];
        const bindingType = bindingTypes[(i + 2) % bindingTypes.length];
        const paperQuality = paperQualities[(i + 4) % paperQualities.length];

        const primaryColor = colorsPool[i % colorsPool.length];
        const secondaryColor = colorsPool[(i + 3) % colorsPool.length];
        const colors = [primaryColor, secondaryColor];

        // Format a professional retail product name
        const name = `${brand} ${type} (${size}, ${pageCount}, ${rulingType})`;

        // SEO-friendly slug generation guaranteeing absolute uniqueness
        const cleanSlug = name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        const slug = `${cleanSlug}-${i + 1}`;

        // Select specific premium images from our curated pool
        const imagePool = groupImages[parentGroup] || groupImages["Notebooks"];
        const image = imagePool[i % imagePool.length];
        const images = [
            image,
            imagePool[(i + 1) % imagePool.length]
        ];

        // Base price variations depending on product group, size, page count, and quality
        let basePrice = 50;
        if (parentGroup === "Premium & Eco") basePrice = 299;
        else if (parentGroup === "Journals & Planners") basePrice = 199;
        else if (parentGroup === "Office & Record Books") basePrice = 149;
        else if (parentGroup === "Creative & Kids") basePrice = 99;

        // Specs modifier
        const sizeMod = size === "Legal" || size === "A4" ? 60 : (size === "A5" ? 20 : 0);
        const pages = parseInt(pageCount) || 120;
        const pagesMod = Math.round(pages * 0.45);
        const paperMod = paperQuality.includes("100 GSM") || paperQuality.includes("120 GSM") ? 40 : 0;

        const price = Math.round(basePrice + sizeMod + pagesMod + paperMod);
        const originalPrice = Math.round(price * 1.35); // Always show discount
        const discountVal = Math.round((1 - price / originalPrice) * 100);

        // Rating, stock, and ratings counts
        const rating = parseFloat((4.1 + ((i % 9) / 10)).toFixed(1));
        const ratingsCount = 15 + (i * 3) % 450;
        const stock = 10 + (i * 7) % 190;

        const description = `${name} by ${brand} offers exceptional design and unmatched writing comfort. Part of the elite ${parentGroup} category, it features premium ${paperQuality} sheets paired with a professional ${bindingType} structure. The ${rulingType} layout is designed to inspire clean, elegant, and organized writing, sketching, or recording. Ideal for college lectures, personal diaries, tracking corporate actions, or kids' creativity.`;

        products.push({
            name,
            slug,
            brand,
            description,
            category: "Hostel & Student Essentials",
            subcategory: "Study Essentials",
            section: "Student Essentials",
            type,
            pageCount,
            size,
            rulingType,
            bindingType,
            paperQuality,
            colors,
            image,
            images,
            price,
            originalPrice,
            discount: `${discountVal}% OFF`,
            stock,
            rating,
            ratingsCount,
            highlights: [
                `${paperQuality} ultra-bright, ink-bleed resistant pages`,
                `Sophisticated and durable ${bindingType} binding`,
                `Convenient ${size} layout ideal for students, office, and travel`,
                `Ergonomic cover in premium ${primaryColor} style`,
                `Eco-friendly and sustainably sourced premium paper material`
            ],
            specifications: {
                "Brand": brand,
                "Product Type": type,
                "Number of Pages": pageCount,
                "Dimensions/Size": size,
                "Ruling Option": rulingType,
                "Binding": bindingType,
                "Paper Quality": paperQuality,
                "Product Group": parentGroup,
                "Cover Options": colors.join(' / ')
            },
            featured: i % 8 === 0,
            trending: i % 6 === 0,
            createdAt: new Date(Date.now() - i * 60 * 60 * 1000) // Stagger creation times
        });
    }

    return products;
};

async function seedNotebooksWithoutExit() {
    try {
        console.log("🧹 Cleaning existing branded notebook and study items from target brands to prevent duplicate collisions...");
        
        // Clean all products under 'Hostel & Student Essentials' -> 'Study Essentials' with the target brands
        const deleted = await Product.deleteMany({
            category: "Hostel & Student Essentials",
            subcategory: "Study Essentials",
            brand: { $in: brands }
        });
        
        console.log(`🗑️ Cleared ${deleted.deletedCount} products from database to ensure fresh seeding.`);

        const notebookProducts = generate270Products();
        console.log(`🌱 Compiling and inserting ${notebookProducts.length} premium notebook, journal, and record products into MongoDB...`);
        
        const inserted = await Product.insertMany(notebookProducts);
        console.log(`🎉 Seeded ${inserted.length} high-quality products successfully into HostelMart database!`);
    } catch (error) {
        console.error("❌ Seeding Error in seedNotebooksWithoutExit:", error);
        throw error;
    }
}

async function seedDB() {
    try {
        console.log("🔌 Connecting to MongoDB Database...");
        await connectDB();
        console.log("✅ MongoDB Connected Successfully!");

        await seedNotebooksWithoutExit();

        mongoose.connection.close();
        console.log("🔌 Database connection closed gracefully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Script Failed:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    seedDB();
} else {
    module.exports = { generateNotebooks: generate270Products, seedNotebooksWithoutExit };
}
