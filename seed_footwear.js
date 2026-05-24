/**
 * seed_footwear.js
 * Database seeding script for HostelMart to dynamically add 620 Footwear products.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

// High-resolution images map for each group from Unsplash
const imagesMap = {
    "NIKE": [
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"
    ],
    "ADIDAS": [
        "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=800&q=80"
    ],
    "PUMA": [
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80"
    ],
    "REEBOK": [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=800&q=80"
    ],
    "SKECHERS": [
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80"
    ],
    "ASICS": [
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80"
    ],
    "NEW BALANCE": [
        "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
    ],
    "CASUAL & STREETWEAR": [
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80"
    ],
    "SPORTS & TRAINING": [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80"
    ],
    "OUTDOOR & TREKKING": [
        "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80"
    ],
    "LUXURY FOOTWEAR": [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1596702990275-155cd96e48be?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
    ],
    "FORMAL & OFFICE": [
        "https://images.unsplash.com/photo-1486308512493-ae6a1c903673?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486308512493-ae6a1c903673?auto=format&fit=crop&w=800&q=80"
    ],
    "WOMEN'S FOOTWEAR": [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1596702990275-155cd96e48be?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=800&q=80"
    ]
};

const groupsConfig = [
    {
        name: "NIKE",
        count: 55,
        brands: ["Nike"],
        types: ["Air Force", "Air Max", "Air Jordan", "Dunk", "Revolution", "Pegasus", "Metcon", "Phantom Football Boots", "Tiempo Football Boots", "Mercurial Football Boots"],
        genders: ["Men", "Women", "Unisex"],
        materials: ["Leather", "Mesh", "Synthetic", "Knit"],
        soleTypes: ["Rubber", "EVA", "TPU Studs"],
        closureTypes: ["Lace-up", "Slip-on"],
        ankleTypes: ["Low-top", "Mid-top", "High-top"],
        sportTypes: ["Running", "Training", "Football", "Basketball", "None"],
        waterproof: ["No", "Water-resistant"],
        cushioning: ["Responsive", "Plush"],
        basePrice: 5999,
        sections: ["Sports Essentials", "Premium Essentials"]
    },
    {
        name: "ADIDAS",
        count: 55,
        brands: ["Adidas"],
        types: ["Ultraboost", "Superstar", "Stan Smith", "Samba", "Gazelle", "NMD", "Yeezy", "Predator Football Boots", "X Football Boots", "Copa Football Boots"],
        genders: ["Men", "Women", "Unisex"],
        materials: ["Leather", "Mesh", "Suede", "Primeknit"],
        soleTypes: ["Rubber", "EVA", "TPU Studs"],
        closureTypes: ["Lace-up", "Slip-on"],
        ankleTypes: ["Low-top", "Mid-top"],
        sportTypes: ["Running", "Training", "Football", "None"],
        waterproof: ["No", "Water-resistant"],
        cushioning: ["Responsive", "Plush", "Boost"],
        basePrice: 4999,
        sections: ["Sports Essentials", "Premium Essentials"]
    },
    {
        name: "PUMA",
        count: 50,
        brands: ["Puma"],
        types: ["RS Series", "Suede", "Smash", "Future Rider", "Ferrari Series", "Ultra Football Boots", "Future Football Boots", "King Football Boots"],
        genders: ["Men", "Women", "Unisex"],
        materials: ["Leather", "Suede", "Mesh", "Synthetic"],
        soleTypes: ["Rubber", "EVA", "TPU Studs"],
        closureTypes: ["Lace-up", "Slip-on"],
        ankleTypes: ["Low-top", "Mid-top"],
        sportTypes: ["Running", "Football", "None"],
        waterproof: ["No", "Water-resistant"],
        cushioning: ["Responsive", "Plush"],
        basePrice: 3999,
        sections: ["Sports Essentials", "Daily Wear"]
    },
    {
        name: "REEBOK",
        count: 40,
        brands: ["Reebok"],
        types: ["Classic Leather", "Nano", "Zig Kinetica", "Floatride", "Club C"],
        genders: ["Men", "Women", "Unisex"],
        materials: ["Leather", "Mesh", "Nylon"],
        soleTypes: ["Rubber", "EVA"],
        closureTypes: ["Lace-up"],
        ankleTypes: ["Low-top"],
        sportTypes: ["Running", "Training", "None"],
        waterproof: ["No"],
        cushioning: ["Responsive", "Memory Foam"],
        basePrice: 3499,
        sections: ["Sports Essentials", "Daily Wear"]
    },
    {
        name: "SKECHERS",
        count: 45,
        brands: ["Skechers"],
        types: ["GOwalk", "D'Lites", "Arch Fit", "Max Cushioning", "Slip-ins"],
        genders: ["Men", "Women", "Unisex"],
        materials: ["Mesh", "Synthetic", "Knit"],
        soleTypes: ["Rubber", "EVA"],
        closureTypes: ["Slip-on", "Lace-up"],
        ankleTypes: ["Low-top"],
        sportTypes: ["Running", "Walking", "None"],
        waterproof: ["No", "Water-resistant"],
        cushioning: ["Plush", "Memory Foam"],
        basePrice: 4299,
        sections: ["Daily Wear", "Student Essentials"]
    },
    {
        name: "ASICS",
        count: 40,
        brands: ["ASICS"],
        types: ["Gel Kayano", "Gel Nimbus", "Gel Lyte", "Novablast", "GT Series"],
        genders: ["Men", "Women", "Unisex"],
        materials: ["Mesh", "Synthetic"],
        soleTypes: ["Rubber", "EVA"],
        closureTypes: ["Lace-up"],
        ankleTypes: ["Low-top"],
        sportTypes: ["Running", "Training", "None"],
        waterproof: ["No", "Yes"],
        cushioning: ["Responsive", "Plush"],
        basePrice: 7999,
        sections: ["Sports Essentials", "Premium Essentials"]
    },
    {
        name: "NEW BALANCE",
        count: 45,
        brands: ["New Balance"],
        types: ["574 Series", "327 Series", "Fresh Foam", "FuelCell", "990 Series"],
        genders: ["Men", "Women", "Unisex"],
        materials: ["Suede", "Mesh", "Leather"],
        soleTypes: ["Rubber", "EVA"],
        closureTypes: ["Lace-up"],
        ankleTypes: ["Low-top"],
        sportTypes: ["Running", "None"],
        waterproof: ["No", "Water-resistant"],
        cushioning: ["Responsive", "Plush"],
        basePrice: 6999,
        sections: ["Premium Essentials", "Sports Essentials"]
    },
    {
        name: "CASUAL & STREETWEAR",
        count: 50,
        brands: ["Converse", "Vans", "Tommy Hilfiger", "Tommy Hilfiger", "Aldo", "Red Tape"],
        types: ["Chuck Taylor High-Top", "Old Skool Sneakers", "Slip-On Canvas Shoes", "Luxury Sneakers", "Casual Sneakers", "Casual Loafers"],
        genders: ["Men", "Women", "Unisex"],
        materials: ["Canvas", "Suede", "Leather"],
        soleTypes: ["Rubber", "Crepe"],
        closureTypes: ["Lace-up", "Slip-on"],
        ankleTypes: ["Low-top", "High-top"],
        sportTypes: ["None"],
        waterproof: ["No"],
        cushioning: ["None", "Memory Foam"],
        basePrice: 2499,
        sections: ["Student Essentials", "Daily Wear"]
    },
    {
        name: "SPORTS & TRAINING",
        count: 55,
        brands: ["Under Armour", "HRX", "Yonex", "Li-Ning", "Sparx", "Campus"],
        types: ["Curry Basketball Shoes", "Training Shoes", "Badminton Shoes", "Basketball Shoes", "Running Shoes", "Athletic Shoes"],
        genders: ["Men", "Unisex"],
        materials: ["Mesh", "Synthetic", "Knit"],
        soleTypes: ["Rubber", "EVA", "TPU"],
        closureTypes: ["Lace-up"],
        ankleTypes: ["Low-top", "High-top"],
        sportTypes: ["Basketball", "Badminton", "Training", "Running", "None"],
        waterproof: ["No"],
        cushioning: ["Responsive", "Plush"],
        basePrice: 1999,
        sections: ["Sports Essentials", "Student Essentials"]
    },
    {
        name: "OUTDOOR & TREKKING",
        count: 45,
        brands: ["Woodland", "Timberland", "Woodland", "Timberland"],
        types: ["Trekking Boots", "Premium Leather Boots", "Hiking Shoes", "All-Weather Work Boots"],
        genders: ["Men", "Unisex"],
        materials: ["Leather", "Suede", "Nubuck"],
        soleTypes: ["Rubber", "Lug Sole"],
        closureTypes: ["Lace-up"],
        ankleTypes: ["Mid-top", "High-top"],
        sportTypes: ["Hiking", "None"],
        waterproof: ["Yes", "Water-resistant"],
        cushioning: ["Plush", "Memory Foam"],
        basePrice: 3999,
        sections: ["Sports Essentials", "Premium Essentials"]
    },
    {
        name: "LUXURY FOOTWEAR",
        count: 35,
        brands: ["Gucci", "Balenciaga", "Gucci", "Balenciaga", "Aldo"],
        types: ["Luxury Sneakers", "Triple S Chunky Sneakers", "Designer Boots", "Luxury Leather Loafers"],
        genders: ["Men", "Women", "Unisex"],
        materials: ["Genuine Leather", "Premium Suede", "Synthetic Mesh"],
        soleTypes: ["Rubber", "Leather", "Chunky EVA"],
        closureTypes: ["Lace-up", "Slip-on"],
        ankleTypes: ["Low-top", "High-top"],
        sportTypes: ["None"],
        waterproof: ["No", "Water-resistant"],
        cushioning: ["Plush", "Responsive"],
        basePrice: 15999,
        sections: ["Premium Essentials"]
    },
    {
        name: "FORMAL & OFFICE",
        count: 45,
        brands: ["Bata", "Hush Puppies", "Clarks", "Red Tape", "Bata", "Hush Puppies"],
        types: ["Oxford Formal Shoes", "Premium Leather Loafers", "Desert Suede Boots", "Classic Derby Shoes", "Monk Strap formal shoes"],
        genders: ["Men", "Women"],
        materials: ["Leather", "Suede"],
        soleTypes: ["Leather", "Rubber", "Crepe"],
        closureTypes: ["Lace-up", "Slip-on", "Buckle"],
        ankleTypes: ["Low-top", "Mid-top"],
        sportTypes: ["None"],
        waterproof: ["No", "Water-resistant"],
        cushioning: ["Memory Foam", "None"],
        basePrice: 1799,
        sections: ["Daily Wear", "Student Essentials"]
    },
    {
        name: "WOMEN'S FOOTWEAR",
        count: 45,
        brands: ["Aldo", "Bata", "Aldo", "Bata"],
        types: ["High Heels", "Metro Block Sandals", "Steve Madden Ankle Boots", "Wedges", "Traditional Mojaris", "Elegant Juttis", "Ballet Flats"],
        genders: ["Women"],
        materials: ["Faux Leather", "Suede", "Canvas", "Velvet"],
        soleTypes: ["Rubber", "Synthetic", "Leather"],
        closureTypes: ["Slip-on", "Buckle", "Lace-up"],
        ankleTypes: ["Low-top", "Mid-top"],
        sportTypes: ["None"],
        waterproof: ["No"],
        cushioning: ["None", "Memory Foam"],
        basePrice: 1499,
        sections: ["Daily Wear", "Student Essentials"]
    }
];

const sizeOptionsPool = ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"];
const colorsPool = ["Core Black", "Cloud White", "Solar Red", "Royal Blue", "Forest Green", "Amber Gold", "Steel Grey", "Champagne Gold", "Navy Blue", "Dark Tan", "Chocolate Brown", "Crimson Red", "Pastel Pink", "Classic Beige"];

const seriesNames = [
    "Elite", "Active", "Pro", "Ultra", "Classic", "Heritage", "Street", "Comfort", "Glide", "Response",
    "Phantom", "Apex", "Nova", "Pulse", "Quantum", "Volt", "Core", "Legacy", "Velocity", "Ventus"
];

function generateFootwear() {
    const products = [];
    const slugRegistry = new Set();

    for (const group of groupsConfig) {
        const imagePool = imagesMap[group.name] || imagesMap["NIKE"];
        
        for (let i = 0; i < group.count; i++) {
            const brand = group.brands[i % group.brands.length];
            const type = group.types[i % group.types.length];
            const series = seriesNames[i % seriesNames.length];
            const gender = group.genders[i % group.genders.length];
            const material = group.materials[i % group.materials.length];
            const soleType = group.soleTypes[i % group.soleTypes.length];
            const closureType = group.closureTypes[i % group.closureTypes.length];
            const ankleType = group.ankleTypes[i % group.ankleTypes.length];
            const sportType = group.sportTypes[i % group.sportTypes.length];
            const wproof = group.waterproof[i % group.waterproof.length];
            const cushioning = group.cushioning[i % group.cushioning.length];
            const section = group.sections[i % group.sections.length];

            // Size Options
            let sizes = [];
            if (gender === "Women") {
                sizes = ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"];
            } else if (gender === "Kids") {
                sizes = ["UK 1", "UK 2", "UK 3", "UK 4"];
            } else {
                sizes = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"];
            }

            // Colors selection
            const colors = [
                colorsPool[(i) % colorsPool.length],
                colorsPool[(i + 1) % colorsPool.length]
            ];

            // Product Name
            let name = "";
            if (sportType !== "None") {
                name = `${brand} ${series} ${sportType} ${type}`;
            } else {
                name = `${brand} ${series} ${type}`;
            }

            // Price generation
            const priceVariance = (i % 10) * 300;
            const originalPrice = Math.floor(group.basePrice + priceVariance);
            const discountPercent = 10 + (i % 6) * 5; // 10% to 35% off
            const price = Math.floor(originalPrice * (1 - discountPercent / 100));
            const discount = `${discountPercent}% OFF`;

            // Unique Slug
            let baseSlug = name.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            
            let finalSlug = baseSlug;
            let counter = 1;
            while (slugRegistry.has(finalSlug)) {
                finalSlug = `${baseSlug}-${counter}`;
                counter++;
            }
            slugRegistry.add(finalSlug);

            // Images select
            const primaryImage = imagePool[(i) % imagePool.length];
            const secondaryImage = imagePool[(i + 1) % imagePool.length];

            // Specifications Map
            const specs = {
                "Gender": gender,
                "Material": material,
                "Sole Type": soleType,
                "Closure Type": closureType,
                "Ankle Height": ankleType,
                "Sport Type": sportType !== "None" ? sportType : "General / Lifestyle",
                "Cushioning": cushioning,
                "Waterproof": wproof
            };

            const highlights = [
                `Premium ${material} upper construction offering excellent longevity, breathability, and structure.`,
                `Equipped with standard high-traction durable ${soleType} sole engineered to resist slips.`,
                cushioning !== "None" ? `Comfort-oriented ${cushioning} cushioning system designed to minimize shock and foot strain.` : `Ergonomic low-profile fit ensuring close-to-ground natural traction.`,
                wproof === "Yes" ? "100% complete waterproof protection keeping feet bone-dry in all conditions." : wproof === "Water-resistant" ? "Water-resistant exterior shield defending against splashes and light rain." : "Lightweight breathable fabrics perfect for daily wear.",
                `Features highly secure ${closureType} lock-in fit with comfort padding around the ankle.`,
                `Backed by HostelMart official 100% genuine quality verification.`
            ];

            products.push({
                name,
                slug: finalSlug,
                brand,
                description: `Experience exceptional styling and unparalleled daily comfort with the new ${name}. Meticulously designed by ${brand} using high-performance ${material} materials, this premium ${type} features an ergonomic ${ankleType} profile complete with a standard ${soleType} sole. Tailored specifically for ${gender.toLowerCase()} athletes, professionals, and students alike, it boasts a secure ${closureType} system and robust ${cushioning} cushioning to reduce high-impact strain over long walks, gym routines, and class commutes. Backed by HostelMart official validation, this is the ultimate reliable footwear addition to your modern campus lifestyle.`,
                category: "Fashion & Apparel",
                subcategory: "Footwear",
                section: section,
                type,
                gender,
                material,
                soleType,
                closureType,
                ankleType,
                sportType,
                waterproof: wproof,
                cushioning,
                sizeOptions: sizes,
                colors,
                image: primaryImage,
                images: [primaryImage, secondaryImage],
                price,
                originalPrice,
                discount,
                stock: 15 + Math.floor(Math.random() * 85),
                rating: parseFloat((4.0 + (Math.random() * 0.9)).toFixed(1)),
                ratingsCount: 30 + Math.floor(Math.random() * 450),
                highlights,
                specifications: specs,
                featured: i % 12 === 0,
                trending: i % 7 === 0,
                createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) // staggered created dates
            });
        }
    }

    return products;
}

async function seedFootwear() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in the environment variables!");
        }

        console.log("🔌 Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        console.log("🗑️ Clearing existing Footwear products...");
        const deleted = await Product.deleteMany({ subcategory: "Footwear" });
        console.log(`🧹 Cleared ${deleted.deletedCount} existing Footwear products.`);

        console.log("🌱 Generating Footwear products...");
        const footwear = generateFootwear();
        console.log(`🌱 Total generated footwear products: ${footwear.length}`);

        console.log(`🌱 Seeding into MongoDB Atlas...`);
        const inserted = await Product.insertMany(footwear);
        console.log(`🎉 Seeded ${inserted.length} Footwear products successfully!`);

        mongoose.connection.close();
        console.log("🔌 Database connection closed gracefully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedFootwear();
