const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const brands = [
    "IKEA", "Home Puff", "Solimo", "Kuber Industries", "Nayasa", 
    "Cello", "Signoraware", "Amazon Basics", "Tidy House", "Storite"
];

const productGroups = {
    "WARDROBE ORGANIZERS": {
        types: [
            "Hanging Wardrobe Organizers",
            "Clothes Shelf Organizers",
            "Drawer Organizers",
            "Saree Organizers",
            "Foldable Closet Organizers"
        ],
        materials: ["Oxford Fabric", "Non-Woven Fabric", "Linen Fabric", "Nylon Mesh"],
        colors: ["Charcoal Grey", "Cozy Beige", "Classic Black", "Ocean Blue", "Soft Pink"],
        capacities: ["30L", "45L", "60L", "80L"],
        foldable: true,
        images: [
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1558882224-dda166733079?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "PLASTIC STORAGE CABINETS": {
        types: [
            "Multi-Drawer Cabinets",
            "Mini Storage Cabinets",
            "Portable Plastic Cabinets",
            "Stackable Cabinets",
            "Utility Storage Cabinets"
        ],
        materials: ["Premium Virgin Plastic", "Heavy-Duty ABS", "Polypropylene (PP)"],
        colors: ["Pastel Blue", "Ivory White", "Slate Grey", "Mint Green", "Multi-Color"],
        capacities: ["60L", "90L", "120L", "150L"],
        foldable: false,
        images: [
            "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1597534454147-36e76cf0e3db?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "CABLE ORGANIZERS": {
        types: [
            "Cable Clips",
            "Cable Management Boxes",
            "Wire Organizers",
            "Desk Cable Holders",
            "Charging Cable Organizers"
        ],
        materials: ["Flexible Silicone", "Durable ABS Plastic", "Flame-Retardant Polymer", "Neoprene"],
        colors: ["Matte Black", "Pure White", "Minimalist Grey", "Nordic Blue"],
        capacities: ["Small", "Medium", "Large", "5-Pack", "10-Pack"],
        foldable: false,
        images: [
            "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "MULTIPURPOSE BASKETS": {
        types: [
            "Laundry Baskets",
            "Storage Baskets",
            "Fruit Baskets",
            "Bathroom Utility Baskets",
            "Toy Storage Baskets"
        ],
        materials: ["Eco-Friendly Bamboo", "Woven Cotton Rope", "Heavy-Duty Plastic Mesh", "Stainless Steel"],
        colors: ["Natural Brown", "Warm Beige", "Classic Grey", "Midnight Blue", "White"],
        capacities: ["15L", "25L", "40L", "60L"],
        foldable: true, // Some laundry baskets are foldable, we'll randomize or keep as true/false dynamically
        images: [
            "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1591123720164-de1348028a82?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "FOLDABLE STORAGE BOXES": {
        types: [
            "Fabric Storage Boxes",
            "Foldable Organizer Boxes",
            "Under Bed Storage Boxes",
            "Stackable Foldable Boxes",
            "Storage Cubes"
        ],
        materials: ["Premium Linen Fabric", "Oxford 600D", "Non-Woven Fabric with Cardboard Board"],
        colors: ["Heather Grey", "Warm Beige", "Navy Blue", "Forest Green", "Classic Charcoal"],
        capacities: ["25L", "40L", "65L", "90L"],
        foldable: true,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80"
        ]
    }
};

const generateProducts = () => {
    const products = [];
    let idCounter = 1;

    // Loop through each product group
    for (const [groupName, groupData] of Object.entries(productGroups)) {
        // Loop through each type in the group
        for (const type of groupData.types) {
            // Generate 3 products per type to guarantee 25 * 3 = 75 products (at least 70!)
            for (let i = 1; i <= 3; i++) {
                // Determine brands sequentially to ensure balanced brand representation
                const brand = brands[(idCounter - 1) % brands.length];
                const material = groupData.materials[i % groupData.materials.length];
                const color = groupData.colors[i % groupData.colors.length];
                const storageCapacity = groupData.capacities[i % groupData.capacities.length];
                const foldable = groupName === "MULTIPURPOSE BASKETS" ? (i % 2 === 0) : groupData.foldable;
                
                // Realistic dimensions depending on group
                let dimensions = "30 x 30 x 30 cm";
                if (groupName === "WARDROBE ORGANIZERS") {
                    dimensions = i === 1 ? "30 x 30 x 80 cm" : (i === 2 ? "45 x 30 x 60 cm" : "15 x 30 x 10 cm");
                } else if (groupName === "PLASTIC STORAGE CABINETS") {
                    dimensions = i === 1 ? "40 x 38 x 90 cm" : (i === 2 ? "30 x 25 x 50 cm" : "55 x 45 x 120 cm");
                } else if (groupName === "CABLE ORGANIZERS") {
                    dimensions = i === 1 ? "8 x 2 x 2 cm" : (i === 2 ? "32 x 13 x 12 cm" : "12 x 8 x 2 cm");
                } else if (groupName === "MULTIPURPOSE BASKETS") {
                    dimensions = i === 1 ? "38 x 38 x 50 cm" : (i === 2 ? "30 x 20 x 15 cm" : "25 x 25 x 10 cm");
                } else if (groupName === "FOLDABLE STORAGE BOXES") {
                    dimensions = i === 1 ? "40 x 30 x 25 cm" : (i === 2 ? "80 x 45 x 15 cm" : "33 x 33 x 33 cm");
                }

                // Realistic pricing and discounts
                let basePrice = 250;
                if (groupName === "PLASTIC STORAGE CABINETS") basePrice = 899;
                else if (groupName === "WARDROBE ORGANIZERS") basePrice = 349;
                else if (groupName === "CABLE ORGANIZERS") basePrice = 149;
                else if (groupName === "MULTIPURPOSE BASKETS") basePrice = 299;
                else if (groupName === "FOLDABLE STORAGE BOXES") basePrice = 399;

                const price = basePrice + (i * 120) + Math.floor(Math.random() * 50);
                const discountPercent = 15 + (idCounter % 4) * 10; // 15%, 25%, 35%, 45%
                const originalPrice = Math.round(price / (1 - discountPercent / 100));
                const discount = `${discountPercent}% OFF`;

                // Distinct name
                const name = `${brand} ${type} - ${color} (${storageCapacity})`;
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;

                // Unique image logic using Unsplash source queries and sigs to make them look distinct
                const imageIndex = (idCounter - 1) % groupData.images.length;
                const primaryImage = `${groupData.images[imageIndex]}&sig=${idCounter}`;
                const hoverImage = `${groupData.images[(imageIndex + 1) % groupData.images.length]}&sig=${idCounter + 200}`;
                const detailImage = `${groupData.images[(imageIndex + 2) % groupData.images.length]}&sig=${idCounter + 400}`;

                // Dynamic, realistic descriptions
                let desc = `Premium ${type} by ${brand}. Crafted from high-grade ${material} that is built to last. `;
                desc += `Perfect for student hostel rooms or apartments where space-saving is essential. `;
                desc += `Features a sleek design in ${color} with a storage capacity of ${storageCapacity}. `;
                desc += foldable 
                    ? `This product is fully foldable, allowing for ultra-convenient storage when not in use.` 
                    : `Engineered with a sturdy, heavy-duty build that offers reliable and long-lasting storage.`;

                // High-quality reviews matching the products
                const productHighlights = [
                    `${foldable ? 'Collapsible & Space-saving' : 'Heavy-duty solid construction'}`,
                    `Made from premium eco-friendly ${material}`,
                    `Generous ${storageCapacity} organizing capacity`,
                    `Aesthetic ${color} finish that fits modern rooms`,
                    `Sturdy seams and ergonomic grip handles`
                ];

                products.push({
                    name,
                    slug,
                    brand,
                    description: desc,
                    category: "Hostel & Student Essentials",
                    subcategory: "Home & Storage Essentials",
                    section: "Daily Use Essentials",
                    type,
                    material,
                    storageCapacity,
                    capacity: storageCapacity, // duplicate for schema/frontend compatibility
                    dimensions,
                    foldable,
                    colors: [color],
                    image: primaryImage,
                    images: [primaryImage, hoverImage, detailImage],
                    price,
                    originalPrice,
                    discount,
                    stock: 12 + Math.floor(Math.random() * 80),
                    rating: parseFloat((4.1 + Math.random() * 0.8).toFixed(1)),
                    ratingsCount: 20 + Math.floor(Math.random() * 300),
                    highlights: productHighlights,
                    specifications: {
                        "Brand": brand,
                        "Type": type,
                        "Material": material,
                        "Capacity": storageCapacity,
                        "Dimensions": dimensions,
                        "Foldable": foldable ? "Yes" : "No",
                        "Color": color,
                        "Warranty": "6 Months Domestic Warranty",
                        "Origin": "Made in India"
                    },
                    seller: {
                        name: `${brand} Authorized Store`,
                        rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
                        isVerified: true
                    },
                    returnPolicy: "7 Days Easy Return & Replacement",
                    deliveryDays: 1 + Math.floor(Math.random() * 3),
                    featured: idCounter % 6 === 0,
                    trending: idCounter % 5 === 0,
                    createdAt: new Date(Date.now() - (idCounter * 24 * 60 * 60 * 1000)) // varied release times
                });

                idCounter++;
            }
        }
    }

    return products;
};

async function seedDBWithoutExit() {
    try {
        // Clear existing items in Home & Storage Essentials to prevent duplicates or clean the database
        console.log("🧹 Clearing existing Home & Storage Essentials products...");
        const deleteResult = await Product.deleteMany({
            category: "Hostel & Student Essentials",
            subcategory: "Home & Storage Essentials"
        });
        console.log(`🗑️ Cleared ${deleteResult.deletedCount} products.`);

        // Generate 75 products
        const productsToSeed = generateProducts();
        console.log(`🌱 Generating ${productsToSeed.length} new premium storage and organization products...`);

        const inserted = await Product.insertMany(productsToSeed);
        console.log(`🎉 Successfully seeded ${inserted.length} products dynamically!`);

        // Log count verification
        const count = await Product.countDocuments({
            category: "Hostel & Student Essentials",
            subcategory: "Home & Storage Essentials"
        });
        console.log(`📊 Verified count in database: ${count} products.`);
    } catch (err) {
        console.error("❌ Seeding failure:", err);
        throw err;
    }
}

async function seedDB() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("❌ Error: MONGODB_URI is not defined in the environment.");
            process.exit(1);
        }

        console.log("⏳ Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected successfully to MongoDB Atlas.");

        await seedDBWithoutExit();

        mongoose.connection.close();
        console.log("🔌 Database connection closed gracefully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Fatal Seeding Error:", err);
        process.exit(1);
    }
}

if (require.main === module) {
    seedDB();
} else {
    module.exports = { generateProducts, seedDBWithoutExit };
}
