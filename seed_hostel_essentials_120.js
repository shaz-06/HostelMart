/**
 * seed_hostel_essentials_120.js
 * Seeding script for HostelMart to dynamically add 135 premium products across 9 hostel utility and tech groups.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

// Unsplash Images (Real, premium, and specifically targeted)
const imagesMap = {
    "LED STRIP LIGHTS": [
        "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80", // RGB gaming desk
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80", // Cyberpunk room
        "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=800&q=80"  // Cozy bedroom LED
    ],
    "MINI FANS": [
        "https://images.unsplash.com/photo-1618944847828-82e943c3dba7?auto=format&fit=crop&w=800&q=80", // USB fan
        "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80", // Handheld fan
        "https://images.unsplash.com/photo-1591081658714-f576fb7ea3ed?auto=format&fit=crop&w=800&q=80"  // Portable desk cooling
    ],
    "DOOR HOOKS": [
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80", // Hanger hook
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80", // Door mounts
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"  // Organizer coat hanger
    ],
    "STORAGE ORGANIZERS": [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", // Fabric boxes
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80", // Baskets
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80"  // Wardrobe setup
    ],
    "FOLDABLE TABLES": [
        "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80", // Laptop study stand
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80", // Wooden folding desk
        "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=800&q=80"  // Cozy desk nook
    ],
    "IRONING BOARDS": [
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80", // Laundry stand
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80", // Compact ironing table
        "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"  // Smart organizer iron
    ],
    "MINI PROJECTORS": [
        "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=800&q=80", // Projector casting movie
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80", // Wall projection
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"  // Smart pocket projector
    ],
    "ROOM POSTERS": [
        "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80", // Anime/Gaming room
        "https://images.unsplash.com/photo-1500462918020-f16371c57e5f?auto=format&fit=crop&w=800&q=80", // Neon room collage
        "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80"  // Cozy aesthetic collage
    ],
    "SHOE RACKS": [
        "https://images.unsplash.com/photo-1588099768531-a72d4a198538?auto=format&fit=crop&w=800&q=80", // Sneaker rack
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", // Clean shelves shoe rack
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80"  // Wood stand shoe organizer
    ]
};

const productGroups = [
    {
        group: "LED STRIP LIGHTS",
        subcategory: "Electronics & Tech",
        section: "Tech Essentials",
        types: ["RGB LED Strip Lights", "Smart LED Strips", "USB LED Strips", "Music Sync LED Lights", "Waterproof LED Strips"],
        brands: ["Philips", "Wipro", "Syska", "Portronics", "Zebronics", "Amazon Basics"],
        materials: ["PVC", "Silicone", "Plastic"],
        powerSources: ["USB", "Electrical Outlet"],
        connectivityList: ["Bluetooth", "Wi-Fi", "None"],
        colorsList: ["RGB", "Warm White", "Cool White", "Multi-Color"],
        specsGenerator: (type, brand, index) => ({
            "LED Density": `${60 + (index * 30)} LEDs/meter`,
            "Voltage": "5V USB / 12V DC",
            "Lifespan": "50,000 Hours",
            "Waterproof Rating": type.includes("Waterproof") ? "IP65 Waterproof" : "IP20 Non-waterproof",
            "Length": `${3 + (index * 2)} Meters`,
            "Smart Home Sync": type.includes("Smart") ? "Alexa & Google Home Supported" : "Remote Control Included"
        }),
        highlightsGenerator: (type, brand) => [
            "Vibrant RGB Multi-Color Lighting",
            type.includes("Smart") ? "Voice & Smart App Control" : "Handy Remote Included",
            "Self-Adhesive backing for easy room installation",
            type.includes("Music Sync") ? "Syncs with Room Beats & Music" : "Customizable Brightness levels",
            "Perfect for hostel desks, beds, and accent walls"
        ]
    },
    {
        group: "MINI FANS",
        subcategory: "Home Utility",
        section: "Daily Use Essentials",
        types: ["USB Mini Fans", "Rechargeable Fans", "Clip-On Fans", "Table Mini Fans", "Portable Cooling Fans"],
        brands: ["Philips", "Syska", "Portronics", "Zebronics", "Amazon Basics"],
        materials: ["Plastic", "Silicone", "Metal"],
        powerSources: ["USB", "Rechargeable Battery"],
        connectivityList: ["None"],
        colorsList: ["Pure White", "Midnight Black", "Mint Green", "Ocean Blue"],
        specsGenerator: (type, brand, index) => ({
            "Speed Settings": "3 speed levels",
            "Battery Capacity": type.includes("Rechargeable") || type.includes("Portable") ? "2000mAh Lithium-ion" : "N/A (Direct USB)",
            "Battery Backup": type.includes("Rechargeable") || type.includes("Portable") ? "Up to 6 Hours" : "Unlimited (Connected)",
            "Noise Level": "Quiet operation (<35dB)",
            "Charging Port": "USB Type-C"
        }),
        highlightsGenerator: (type, brand) => [
            "Ultra-Quiet Brushless Motor",
            "3-speed adjustable strong wind flow",
            type.includes("Clip-On") ? "Heavy-duty clip to attach to beds or desks" : "Anti-skid stable base for table use",
            type.includes("Rechargeable") ? "Long-lasting battery backup for power cuts" : "Saves energy, powered via USB laptop/charger",
            "360-degree rotation adjustment for targeted breeze"
        ]
    },
    {
        group: "DOOR HOOKS",
        subcategory: "Home & Storage Essentials",
        section: "Daily Use Essentials",
        types: ["Adhesive Door Hooks", "Stainless Steel Hooks", "Multi-Hanger Hooks", "Wall Mounted Hooks", "Foldable Hooks"],
        brands: ["IKEA", "Solimo", "Home Puff", "Amazon Basics"],
        materials: ["Stainless Steel", "Metal", "Plastic", "Wood"],
        powerSources: ["None"],
        connectivityList: ["None"],
        colorsList: ["Classic Silver", "Matte Black", "Pure White", "Chrome"],
        specsGenerator: (type, brand, index) => ({
            "Weight Capacity": `${5 + (index * 3)} kg`,
            "Mounting Type": type.includes("Adhesive") ? "Self-Adhesive (No Drill)" : "Over the Door / Screw Mount",
            "Hook Count": type.includes("Multi") ? "6 Double Hooks" : "Single / Pack of 4",
            "Rustproof": "Yes, high-grade rust resistance"
        }),
        highlightsGenerator: (type, brand) => [
            type.includes("Adhesive") ? "Heavy-duty adhesive, supports weight up to 8kg without drilling" : "Over-the-door fit for standard hostel room doors",
            "Durable rustproof design, perfect for damp environments",
            type.includes("Multi") ? "Multi-hanger hooks to organize up to 10 garments" : "Minimalist layout that fits behind any door or cupboard",
            "Protective pads on backing prevent doors from scratching"
        ]
    },
    {
        group: "STORAGE ORGANIZERS",
        subcategory: "Home & Storage Essentials",
        section: "Daily Use Essentials",
        types: ["Drawer Organizers", "Wardrobe Organizers", "Foldable Storage Boxes", "Hanging Organizers", "Multipurpose Storage Baskets"],
        brands: ["IKEA", "Solimo", "Home Puff", "Amazon Basics"],
        materials: ["Fabric", "Non-Woven", "Canvas", "Plastic", "Mesh"],
        powerSources: ["None"],
        connectivityList: ["None"],
        colorsList: ["Elegant Grey", "Cozy Beige", "Navy Blue", "Pure White"],
        specsGenerator: (type, brand, index) => ({
            "Capacity": `${15 + (index * 15)}L`,
            "Foldable": "Yes, folds completely flat",
            "Closure Type": type.includes("Boxes") ? "Dual Zippers with Clear Window" : "Open access / Velcro strap",
            "Compartments": type.includes("Drawer") ? "16 compartments" : "5 Tier Shelf"
        }),
        highlightsGenerator: (type, brand) => [
            "Folds fully flat to save room when not in use",
            "Durable reinforced handles on sides for easy carrying",
            type.includes("Hanging") ? "Sturdy velcro hanging strap fits any wardrobe rail" : "Reinforced cardboard panel base for structure",
            "Breathable fabric keeps clothes smelling fresh and dust-free",
            "Excellent divider layout to keep underwear, socks, or books organized"
        ]
    },
    {
        group: "FOLDABLE TABLES",
        subcategory: "Home & Storage Essentials",
        section: "Daily Use Essentials",
        types: ["Study Tables", "Laptop Tables", "Bed Tables", "Foldable Dining Tables", "Portable Study Desks"],
        brands: ["IKEA", "Solimo", "Portronics", "Amazon Basics"],
        materials: ["Wood", "Metal", "Plastic"],
        powerSources: ["None"],
        connectivityList: ["None"],
        colorsList: ["Oak Wood", "Walnut Brown", "Carbon Black", "Classic White"],
        specsGenerator: (type, brand, index) => ({
            "Max Weight Load": "35 kg",
            "Adjustable Height": type.includes("Laptop") || type.includes("Bed") ? "4 adjustable levels" : "Fixed Height",
            "Foldable Design": "Yes, dual-leg lock mechanism",
            "Cup Holder": type.includes("Laptop") || type.includes("Bed") ? "Yes, built-in drawer & slot" : "No"
        }),
        highlightsGenerator: (type, brand) => [
            "High-density engineered wood tabletop with sleek finish",
            "Heavy-duty carbon metal legs with non-slip protective caps",
            type.includes("Laptop") || type.includes("Bed") ? "Integrated drawer, dedicated tablet slot, and drink holder" : "Spacious tabletop layout for heavy laptops and books",
            "Ergonomic curved desk front for long hours studying",
            "Lightweight fold-and-go setup, fits under any hostel bed"
        ]
    },
    {
        group: "IRONING BOARDS",
        subcategory: "Home & Storage Essentials",
        section: "Daily Use Essentials",
        types: ["Foldable Ironing Boards", "Mini Ironing Boards", "Portable Iron Stands", "Compact Iron Tables", "Wall Mounted Iron Boards"],
        brands: ["IKEA", "Solimo", "Amazon Basics"],
        materials: ["Metal", "Wood", "Fabric"],
        powerSources: ["None"],
        connectivityList: ["None"],
        colorsList: ["Classic Grey Pattern", "Blue Floral Pattern", "Matte Black Solid", "White Grid"],
        specsGenerator: (type, brand, index) => ({
            "Iron Holder Included": "Yes, heat-resistant metal holder",
            "Height Adjustable": type.includes("Mini") ? "No (Tabletop use)" : "Multi-level adjustable height",
            "Board Cover Material": "100% Cotton cover with extra thick felt underlay",
            "Folded Thickness": "4 cm"
        }),
        highlightsGenerator: (type, brand) => [
            "Heat-resistant metal rest holds the hot iron securely",
            "Multi-layer cotton and felt pad ensures smooth crease-free pressing",
            "Reinforced steel t-leg base with heavy anti-slip rubber pads",
            type.includes("Mini") ? "Perfect desktop size for quick daily hostel outfit pressing" : "Spacious board layout with full adjustable height levels",
            "Saves storage room, locks closed and hangs easily in closets"
        ]
    },
    {
        group: "MINI PROJECTORS",
        subcategory: "Electronics & Tech",
        section: "Tech Essentials",
        types: ["Portable Projectors", "Smart Mini Projectors", "LED Projectors", "WiFi Projectors", "Android Mini Projectors"],
        brands: ["Philips", "Epson", "Everycom", "Egate", "Zebronics"],
        materials: ["Plastic", "Metal"],
        powerSources: ["Electrical Outlet", "Rechargeable Battery"],
        connectivityList: ["Wi-Fi", "Bluetooth", "HDMI", "USB"],
        colorsList: ["Pure White", "Midnight Black", "Space Grey"],
        specsGenerator: (type, brand, index) => ({
            "Native Resolution": index === 0 ? "HD 720p (Supports 1080p)" : "Full HD 1080p Native (Supports 4K)",
            "Brightness": `${1200 + (index * 800)} ANSI Lumens`,
            "Contrast Ratio": `${3000 + (index * 1000)}:1`,
            "Projection Area": "30 to 150 Inches",
            "Speaker Output": "Built-in 5W HiFi Cinema Speaker",
            "Smart Operating System": type.includes("Android") || type.includes("Smart") ? "Android TV 9.0 Built-in (Netflix, YT)" : "Plug & Play Interface"
        }),
        highlightsGenerator: (type, brand) => [
            "Mini pocket cinema setup, lightweight and highly portable",
            type.includes("WiFi") || type.includes("Smart") ? "Wireless screen mirroring from iOS, Android, and laptops" : "Multi-port connectivity (HDMI, USB, AUX, AV)",
            "Long-lasting LED bulb lifespan up to 30,000 screen hours",
            "Cinematic built-in speaker with deep bass profile",
            "Smart Keystone correction ensures perfectly rectangular projection"
        ]
    },
    {
        group: "ROOM POSTERS",
        subcategory: "Home & Storage Essentials",
        section: "Daily Use Essentials",
        types: ["Anime Posters", "Motivational Posters", "Movie Posters", "Gaming Posters", "Aesthetic Wall Posters"],
        brands: ["IKEA", "Amazon Basics"],
        materials: ["Paper", "PVC", "Cardstock"],
        powerSources: ["None"],
        connectivityList: ["None"],
        colorsList: ["Multi-Color Art", "Monochrome Vintage", "Cyberpunk Neon Scheme"],
        specsGenerator: (type, brand, index) => ({
            "Paper Weight": "300 GSM thick premium art paper",
            "Finish Type": index === 1 ? "Matte Finish" : "Glossy Laminate Finish",
            "Mounting Setup": "Strong self-adhesive tape backings included",
            "Aesthetic Theme": type.replace(" Posters", "")
        }),
        highlightsGenerator: (type, brand) => [
            "Printed on 300 GSM ultra-thick non-tearable art cardstock",
            "Vibrant, high-definition digital colors that do not fade over time",
            "Waterproof and smudgeproof glossy protective layer",
            "Double-sided strong mounting tape strips included for instant setup",
            "Curated aesthetic designs perfect for customizing hostel dorm rooms"
        ]
    },
    {
        group: "SHOE RACKS",
        subcategory: "Home & Storage Essentials",
        section: "Daily Use Essentials",
        types: ["Plastic Shoe Racks", "Foldable Shoe Organizers", "Multi-Layer Shoe Stands", "Metal Shoe Racks", "Compact Shoe Cabinets"],
        brands: ["IKEA", "Solimo", "Home Puff", "Amazon Basics"],
        materials: ["Plastic", "Metal", "Wood", "Fabric"],
        powerSources: ["None"],
        connectivityList: ["None"],
        colorsList: ["Matte Black", "Matte Grey", "Pure White", "Walnut Brown"],
        specsGenerator: (type, brand, index) => ({
            "Storage Capacity": `${6 + (index * 4)} Pairs of shoes`,
            "Tier Count": `${3 + index} Tiers`,
            "Dust Cover Included": type.includes("Cabinet") || type.includes("Organizer") ? "Yes, zippered roll-up door" : "No (Open design)",
            "Foldable Frame": type.includes("Foldable") ? "Yes, collapsible metal pipes" : "Snap-lock assembly"
        }),
        highlightsGenerator: (type, brand) => [
            "Compact space-saving frame fits neatly in any doorway or corner",
            "Heavy-duty pipes and thick snap-lock plastic connectors",
            type.includes("Cabinet") ? "Sturdy dustproof zippered cover protects shoes from dust & moisture" : "Open air design allows quick ventilation & dry shoes",
            "Waterproof layers, easy to wash clean from damp mud or rain",
            "Quick snap-lock assembly without requiring extra tools"
        ]
    }
];

const generateProductsList = () => {
    const products = [];
    let idCounter = 1;

    for (const g of productGroups) {
        const imagesList = imagesMap[g.group];
        
        // Loop over the 5 types of this product group
        for (const type of g.types) {
            // Generate 3 unique products per type
            for (let i = 0; i < 3; i++) {
                const brand = g.brands[(idCounter + i) % g.brands.length];
                const material = g.materials[(idCounter + i) % g.materials.length];
                const powerSource = g.powerSources[(idCounter + i) % g.powerSources.length] || "None";
                const connectivity = g.connectivityList[(idCounter + i) % g.connectivityList.length] || "None";
                const color = g.colorsList[(idCounter + i) % g.colorsList.length];
                
                // Determine base pricing tier based on group
                let basePrice = 299;
                if (g.group === "MINI PROJECTORS") basePrice = 4500;
                else if (g.group === "FOLDABLE TABLES") basePrice = 799;
                else if (g.group === "IRONING BOARDS") basePrice = 999;
                else if (g.group === "SHOE RACKS") basePrice = 599;
                else if (g.group === "STORAGE ORGANIZERS") basePrice = 399;
                else if (g.group === "MINI FANS") basePrice = 499;

                const price = Math.floor(basePrice + (Math.random() * basePrice * 0.4));
                const originalPrice = Math.floor(price * (1.3 + Math.random() * 0.3));
                const discountVal = Math.round((1 - price / originalPrice) * 100);
                const discount = `${discountVal}% OFF`;
                
                const sizeRating = i === 0 ? "Small" : i === 1 ? "Medium" : "Large";
                
                // Construct clean name
                const name = `${brand} ${type} - ${color} (${sizeRating})`;
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
                
                // Unsplash Image Selection
                const image = imagesList[i % imagesList.length];
                const hoverImage = imagesList[(i + 1) % imagesList.length];
                
                // Generate Dynamic Descriptions
                const desc = `Premium quality ${type.toLowerCase()} engineered by ${brand}. Crafted from heavy-duty ${material.toLowerCase()} and optimized for typical hostel rooms and student desk storage. Power source: ${powerSource}. Fully portable, space-saving design with a highly durable frame. Standard official ${brand} warranty included.`;

                // Capacity mapping
                let capacity = null;
                if (g.group === "STORAGE ORGANIZERS") {
                    capacity = i === 0 ? "15L" : i === 1 ? "30L" : "50L";
                } else if (g.group === "SHOE RACKS") {
                    capacity = i === 0 ? "6 Pairs" : i === 1 ? "10 Pairs" : "16 Pairs";
                }

                products.push({
                    name,
                    slug,
                    brand,
                    description: desc,
                    category: "Hostel & Student Essentials",
                    subcategory: g.subcategory,
                    section: g.section,
                    type,
                    material,
                    capacity,
                    dimensions: sizeRating, // Keep matching with client-side filter
                    powerSource,
                    connectivity,
                    colors: [color],
                    image,
                    images: [image, hoverImage],
                    price,
                    originalPrice,
                    discount,
                    stock: 25 + Math.floor(Math.random() * 120),
                    rating: 4.0 + (Math.random() * 0.9),
                    ratingsCount: 25 + Math.floor(Math.random() * 400),
                    highlights: g.highlightsGenerator(type, brand),
                    specifications: {
                        ...g.specsGenerator(type, brand, i),
                        "Dimensions": i === 0 ? "Compact" : i === 1 ? "Standard" : "Spacious",
                        "Material": material,
                        "Power Source": powerSource,
                        "Connectivity": connectivity,
                        "Storage Capacity": capacity || "N/A",
                        "Warranty": "1 Year Brand Warranty",
                        "Return Policy": "7 Days Replacement Policy",
                        "Delivery": "Eligible for Next-Day Delivery"
                    },
                    featured: i === 0,
                    trending: i === 1,
                    createdAt: new Date(Date.now() - (idCounter * 3600 * 1000)) // staggered timing
                });
                
                idCounter++;
            }
        }
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully to Atlas");

        // Clear existing product lists for these categories to prevent duplicates
        const categoriesToClear = ["Hostel & Student Essentials"];
        const cleared = await Product.deleteMany({ 
            category: { $in: categoriesToClear }
        });
        console.log(`🗑️ Cleared ${cleared.deletedCount} existing Hostel & Student Essentials products.`);

        const productsToInsert = generateProductsList();
        const inserted = await Product.insertMany(productsToInsert);
        console.log(`🌱 Seeding successful: Added ${inserted.length} premium products to HostelMart!`);

        process.exit(0);
    } catch (e) {
        console.error("❌ Database Seeding Failed:", e);
        process.exit(1);
    }
}

seedDB();
