/**
 * seed_furniture_products.js
 * Database seeding script for HostelMart to dynamically add 225+ Furniture & Space Saving products.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

// Unsplash high-quality furniture images map
const imagesMap = {
    "STUDY & WORK TABLES": [
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544006659-f0b21f02d1d5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1530018607912-eff2df1f4f23?auto=format&fit=crop&w=800&q=80"
    ],
    "CHAIRS & SEATING": [
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598191381897-402174c5feed?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80"
    ],
    "BEDS & BEDROOM": [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80"
    ],
    "STORAGE & ORGANIZERS": [
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1597072689227-8d56ad51db3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
    ],
    "TABLES & HOME FURNITURE": [
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80"
    ],
    "SHELVES & DECOR": [
        "https://images.unsplash.com/photo-1507643199731-150950c6096a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80"
    ],
    "OUTDOOR & PORTABLE": [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598191381897-402174c5feed?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
    ]
};

const brands = ["IKEA", "Nilkamal", "Home Centre", "Urban Ladder", "Pepperfry", "Wakefit", "Solimo", "Amazon Basics", "Durian", "Godrej Interio"];
const materials = ["Engineered Wood", "Solid Teak Wood", "Powder-Coated Steel", "Premium Polypropylene", "Bamboo", "Fabric & High-Density Foam", "Metal Frame & MDF"];
const colorsList = ["Walnut Wood", "Oak Finish", "Matte Black", "Ivory Cream", "Slate Grey", "Royal Blue", "Warm Beige", "Classic Mahogany", "Teak Finish"];

const groupConfigs = [
    {
        name: "STUDY & WORK TABLES",
        subcategory: "Study Essentials",
        category: "Hostel & Student Essentials",
        types: [
            "Foldable Study Tables", "Laptop Tables", "Computer Desks", "Compact Study Desks", 
            "Study Setup Tables", "Wall Mounted Desks", "Gaming Desks", "Standing Desks", 
            "Adjustable Tables", "Portable Workstations", "Compact Office Tables", 
            "Corner Computer Tables", "Study Carrels"
        ]
    },
    {
        name: "CHAIRS & SEATING",
        subcategory: "Furniture & Decor",
        category: "Hostel & Student Essentials",
        types: [
            "Study Chairs", "Foldable Chairs", "Gaming Chairs", "Office Chairs", 
            "Recliner Chairs", "Balcony Chairs", "Folding Stools", "Wooden Benches", 
            "Bean Bags", "Bar Stools"
        ]
    },
    {
        name: "BEDS & BEDROOM",
        subcategory: "Furniture & Decor",
        category: "Home Utility",
        types: [
            "Foldable Beds", "Single Beds", "Metal Beds", "Portable Beds", 
            "Sofa Cum Beds", "Mini Sofas", "Mattress Bases", "Bunk Beds", 
            "Headboards", "Bedside Storage Units", "Nightstands"
        ]
    },
    {
        name: "STORAGE & ORGANIZERS",
        subcategory: "Home & Storage Essentials",
        category: "Home Utility",
        types: [
            "Storage Shelves", "Bookshelves", "Shoe Racks", "Plastic Storage Cabinets", 
            "Wardrobes", "Foldable Wardrobes", "Drawer Units", "Storage Ottomans", 
            "Book Cabinets", "Filing Cabinets", "Cube Organizers", "Under Bed Storage Drawers", 
            "Wooden Storage Boxes", "Clothes Racks", "Hanging Organizers", "Modular Storage Units", 
            "Compact Cupboards"
        ]
    },
    {
        name: "TABLES & HOME FURNITURE",
        subcategory: "Furniture & Decor",
        category: "Home Utility",
        types: [
            "Multipurpose Tables", "Coffee Tables", "Bedside Tables", "Dining Tables", 
            "Foldable Dining Tables", "TV Units", "Side Tables", "Nesting Tables", 
            "Trolley Carts", "Microwave Stands", "Washing Machine Stands", "Fridge Stands"
        ]
    },
    {
        name: "SHELVES & DECOR",
        subcategory: "Furniture & Decor",
        category: "Hostel & Student Essentials",
        types: [
            "Wall Shelves", "Corner Shelves", "Floating Shelves", "TV Wall Shelves", 
            "Partition Shelves", "Display Cabinets", "Entryway Benches", "Mirror Cabinets", 
            "Dressing Tables"
        ]
    },
    {
        name: "OUTDOOR & PORTABLE",
        subcategory: "Home & Storage Essentials",
        category: "Hostel & Student Essentials",
        types: [
            "Outdoor Folding Chairs", "Picnic Tables", "Portable Furniture Sets"
        ]
    }
];

function generateFurnitureProducts() {
    const products = [];
    let idCounter = 10000;

    groupConfigs.forEach(groupConfig => {
        const groupImages = imagesMap[groupConfig.name];
        
        groupConfig.types.forEach((type, typeIdx) => {
            // Let's generate 3 variations per type to get 75 * 3 = 225 realistic products
            for (let v = 1; v <= 3; v++) {
                const brandIdx = (typeIdx + v * 3) % brands.length;
                const brand = brands[brandIdx];
                
                const materialIdx = (typeIdx + v * 2) % materials.length;
                const material = materials[materialIdx];
                
                const colorIdx1 = (typeIdx + v) % colorsList.length;
                const colorIdx2 = (typeIdx + v + 2) % colorsList.length;
                const colors = [colorsList[colorIdx1], colorsList[colorIdx2]];
                
                const primaryImage = groupImages[(typeIdx + v) % groupImages.length];
                const secondaryImage = groupImages[(typeIdx + v + 1) % groupImages.length];
                const images = [primaryImage, secondaryImage];
                
                // Determine prices based on variation
                let price = 0;
                let originalPrice = 0;
                let section = "";
                let weightCapacity = "";
                let storageCapacity = "None";
                let foldable = false;
                let assemblyRequired = false;
                let dimensions = "";
                
                // High premium items, space-savers, basic daily use
                if (v === 1) { // Budget / Compact
                    section = "Daily Use Essentials";
                    price = 800 + ((typeIdx * 110 + v * 150) % 2500);
                    originalPrice = Math.round(price * 1.35);
                    weightCapacity = "Up to 80 kg";
                    foldable = type.toLowerCase().includes("fold") || type.toLowerCase().includes("portable") || (typeIdx % 2 === 0);
                    assemblyRequired = false;
                    dimensions = `${60 + (typeIdx % 5) * 10} x ${40 + (typeIdx % 3) * 10} x ${50 + (typeIdx % 4) * 5} cm`;
                } else if (v === 2) { // Smart / Space Saver
                    section = "Student Essentials";
                    price = 2800 + ((typeIdx * 350 + v * 450) % 6500);
                    originalPrice = Math.round(price * 1.25);
                    weightCapacity = "Up to 120 kg";
                    foldable = true; // High space-saving Focus
                    assemblyRequired = typeIdx % 2 === 0;
                    storageCapacity = `${15 + (typeIdx % 4) * 10} Liters`;
                    dimensions = `${90 + (typeIdx % 6) * 10} x ${50 + (typeIdx % 4) * 10} x ${70 + (typeIdx % 3) * 5} cm`;
                } else { // Premium Luxury
                    section = "Premium Essentials";
                    price = 8500 + ((typeIdx * 750 + v * 950) % 15000);
                    originalPrice = Math.round(price * 1.2);
                    weightCapacity = "Up to 200 kg";
                    foldable = type.toLowerCase().includes("fold") || type.toLowerCase().includes("portable");
                    assemblyRequired = true;
                    storageCapacity = `${40 + (typeIdx % 5) * 20} Liters`;
                    dimensions = `${120 + (typeIdx % 8) * 15} x ${60 + (typeIdx % 4) * 15} x ${75 + (typeIdx % 3) * 10} cm`;
                }

                // Dynamic name styling
                let modelName = "";
                if (v === 1) modelName = "LiteSpace Compact";
                else if (v === 2) modelName = "ErgoFlex Foldable";
                else modelName = "Nordic Premium Signature";
                
                const name = `${brand} ${modelName} ${type} - ${colors[0]} Finish`;
                const slug = name.toLowerCase()
                    .replace(/[^a-z0-9\s]/g, '')
                    .replace(/\s+/g, '-')
                    + '-' + idCounter;
                
                const discountPercent = Math.round((1 - price / originalPrice) * 100);
                const discount = `${discountPercent}% OFF`;
                
                // Specifications Generation
                const specs = {
                    "Brand": brand,
                    "Material": material,
                    "Dimensions": dimensions,
                    "Weight Capacity": weightCapacity,
                    "Storage Capacity": storageCapacity !== "None" ? storageCapacity : "No Storage",
                    "Foldable Design": foldable ? "Yes, collapsible" : "No",
                    "Assembly Required": assemblyRequired ? "Yes (DIY Manual Included)" : "No (Pre-assembled)",
                    "Primary Color": colors[0],
                    "Warranty": v === 3 ? "3 Years Manufacturer Warranty" : "1 Year Warranty"
                };

                const highlights = [
                    `Perfect space-saving design suitable for modern apartments, PG rooms, and student hostels.`,
                    `Constructed using high-quality durable ${material} which ensures strong stability.`,
                    foldable ? `Extremely easy to fold and store away under beds or behind wardrobes when not in use.` : `Highly ergonomic structure featuring premium high-strength joints and finishes.`,
                    `Sturdy load capacity rating: ${weightCapacity} tested for rigorous daily student activities.`,
                    `Shipped in secure double-wall protective packaging with clear instructions.`
                ];

                products.push({
                    name,
                    slug,
                    brand,
                    description: `Maximize your room space and productivity with the high-quality ${name}. Engineered with professional design insights by ${brand}, this space-efficient ${type} features a sturdy construction of premium ${material} designed to withstand daily student life. It is finished with a stunning ${colors[0]} texture which matches seamlessly with any room style. Highly recommended for students, remote professionals, or hostel setups seeking maximum ergonomics and durability.`,
                    category: groupConfig.category,
                    subcategory: groupConfig.subcategory,
                    section,
                    type,
                    material,
                    dimensions,
                    weightCapacity,
                    foldable,
                    storageCapacity,
                    assemblyRequired,
                    colors,
                    image: primaryImage,
                    images,
                    price,
                    originalPrice,
                    discount,
                    stock: 8 + Math.floor(Math.random() * 42),
                    rating: parseFloat((4.0 + (Math.random() * 0.9)).toFixed(1)),
                    ratingsCount: 15 + Math.floor(Math.random() * 450),
                    highlights,
                    specifications: specs,
                    featured: v === 3 && typeIdx % 3 === 0,
                    trending: v === 2 && typeIdx % 4 === 0,
                    createdAt: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000))
                });
                
                idCounter++;
            }
        });
    });

    return products;
}

async function seedFurnitureWithoutExit() {
    try {
        console.log("🗑️ Clearing existing Furniture and Space Saving products...");
        // Delete items from the 3 subcategories to cleanly overwrite
        const deleted = await Product.deleteMany({
            subcategory: { $in: ["Furniture & Decor", "Home & Storage Essentials", "Study Essentials"] }
        });
        console.log(`🧹 Cleared ${deleted.deletedCount} existing furniture products.`);

        console.log("🌱 Generating 225+ Furniture & Space Saving products...");
        const furnitureProducts = generateFurnitureProducts();
        
        console.log(`🌱 Seeding ${furnitureProducts.length} Furniture products into MongoDB...`);
        const inserted = await Product.insertMany(furnitureProducts);
        console.log(`🎉 Seeded ${inserted.length} Furniture & Space Saving products successfully!`);
    } catch (error) {
        console.error("❌ Seeding Error in seedFurnitureWithoutExit:", error);
        throw error;
    }
}

async function seedDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in the environment variables!");
        }

        console.log("🔌 Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        await seedFurnitureWithoutExit();

        mongoose.connection.close();
        console.log("🔌 Database connection closed gracefully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    seedDB();
} else {
    module.exports = { generateFurnitureProducts, seedFurnitureWithoutExit };
}
