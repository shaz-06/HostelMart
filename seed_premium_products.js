/**
 * seed_premium_products.js
 * Database seeding script for HostelMart to dynamically add 96 Premium products.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

// High-resolution premium images map
const imagesMap = {
    "TVS": [
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80", // QLED TV in ambient room
        "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?auto=format&fit=crop&w=800&q=80", // Living room smart TV
        "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80", // Flat screen TV wall mount
        "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=800&q=80"  // Premium 4K Smart display
    ],
    "REFRIGERATORS": [
        "https://images.unsplash.com/photo-1571175432267-efb92f4c6831?auto=format&fit=crop&w=800&q=80", // Smart double-door luxury fridge
        "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80", // Sleek black kitchen refrigerator
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80"  // Modern kitchen appliance setup
    ],
    "WASHING MACHINES": [
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80", // High-end front-load washer
        "https://images.unsplash.com/photo-1626806787426-5910811b6325?auto=format&fit=crop&w=800&q=80", // Top-load compact laundry unit
        "https://images.unsplash.com/photo-1610557892470-76d747eed2f1?auto=format&fit=crop&w=800&q=80"  // Sleek intelligent automatic washer
    ],
    "EXPENSIVE SMARTPHONES": [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", // Premium camera phone
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80", // High-end smartphone back
        "https://images.unsplash.com/photo-1565849906660-f96de7c8a080?auto=format&fit=crop&w=800&q=80", // Luxury folding smartphone
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80"  // Modern flagship phone setup
    ],
    "LARGE FURNITURE": [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", // Cozy premium desk/study nook
        "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80", // Luxury ergonomic office chair
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80", // Wooden designer wardrobe
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80", // Premium queen size bed nook
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80"  // Designer living room sofa set
    ],
    "LUXURY DECOR": [
        "https://images.unsplash.com/photo-1507643199731-150950c6096a?auto=format&fit=crop&w=800&q=80", // Cyberpunk LED wall artwork
        "https://images.unsplash.com/photo-1563861826100-9cb868fdba1c?auto=format&fit=crop&w=800&q=80", // Premium wall clock
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80", // High-end decorative lamps
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80", // Beautiful artificial plants
        "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80"  // Modern gold frame vanity mirror
    ]
};

// Target categories & subcategories
const productGroups = [
    {
        group: "TVS",
        category: "Electronics & Tech",
        subcategory: "Home Appliances",
        types: ["Smart TVs", "Android TVs", "4K Ultra HD TVs", "QLED TVs", "Mini LED TVs"],
        brands: ["Sony", "Samsung", "LG", "OnePlus", "Xiaomi"],
        colors: ["Carbon Black", "Space Grey", "Titanium Silver"],
        basePrice: 65000,
        descriptions: [
            "Experience spectacular visuals with our premium series. Powered by the next-gen intelligent AI processor, it delivers true-to-life colors and brilliant 4K HDR depth, perfect for home theater setup.",
            "Elevate your bedroom or living space. Featuring an ultra-slim bezel, custom cinema sound modules, and deep smart home voice integration (Alexa/Google Assistant)."
        ],
        specificationsGen: (type, brand, price) => ({
            "Display Tech": type.includes("QLED") ? "QLED panel" : type.includes("Mini LED") ? "Mini LED technology" : "LED Backlit LCD",
            "Resolution": "4K Ultra HD (3840 x 2160)",
            "Refresh Rate": price > 90000 ? "120Hz Smooth motion" : "60Hz Ultra HD",
            "SmartOS": brand === "Sony" || brand === "Xiaomi" || brand === "OnePlus" ? "Google TV (Android 11)" : "WebOS Smart Platform",
            "Speaker System": "40W Dolby Atmos Acoustic sound",
            "Connectivity": "4x HDMI 2.1 Ports, Dual-band Wi-Fi, Bluetooth 5.2"
        })
    },
    {
        group: "REFRIGERATORS",
        category: "Home Utility",
        subcategory: "Home Appliances",
        types: ["Single Door Refrigerators", "Double Door Refrigerators", "Mini Refrigerators", "Convertible Refrigerators", "Smart Refrigerators"],
        brands: ["Samsung", "LG", "Whirlpool", "Godrej"],
        colors: ["Steel Grey", "Onyx Black", "Wine Red"],
        basePrice: 42000,
        descriptions: [
            "Indulge in smart cooling designed for modern homes. Engineered with advanced convertible technology and a smart digital inverter compressor for maximum energy savings and silent operation.",
            "A premium cooling statement. Features fresh-lock zone sensors, auto-frost protection, and modular shelving units customized for organizing all your food and beverages efficiently."
        ],
        specificationsGen: (type, brand, price) => ({
            "Cooling Type": "Multi Airflow with Frost-Free Sensors",
            "Capacity": type.includes("Mini") ? "95 Liters" : type.includes("Convertible") ? "450 Liters Convertible" : "320 Liters Smart Space",
            "Energy Rating": "5 Star Premium Energy Efficient",
            "Compressor Type": "Digital Inverter Intelligent Compressor",
            "Convertible Modes": type.includes("Convertible") || type.includes("Smart") ? "5-in-1 Smart Modes" : "Standard Auto-Cooling",
            "Tray Material": "Toughened Leak-Proof Glass Shelves"
        })
    },
    {
        group: "WASHING MACHINES",
        category: "Home Utility",
        subcategory: "Home Appliances",
        types: ["Fully Automatic Washing Machines", "Semi Automatic Washing Machines", "Front Load Machines", "Top Load Machines", "Compact Washing Machines"],
        brands: ["LG", "Samsung", "Whirlpool", "IFB"],
        colors: ["Platinum Silver", "Charcoal Black", "Glacier White"],
        basePrice: 35000,
        descriptions: [
            "Deliver professional fabric care straight to your room. Designed with smart steam wash cycles and auto-optimal dosing to preserve cloth textures while offering high hygienic sanitization.",
            "A masterclass in laundry technology. Quiet, efficient, and packed with intelligent sensory systems that weigh laundry and adjust wash cycles automatically."
        ],
        specificationsGen: (type, brand, price) => ({
            "Washing Method": type.includes("Front") ? "Front Load Tumble Motion" : "Top Load Pulsator Smart wash",
            "Spin Speed": "1400 RPM Ultra-dry speed",
            "Load Capacity": "8.0 Kg Intelligent load capacity",
            "Motor Tech": "Direct Drive Inverter Silent Motor",
            "Water Heater": "Built-in Intelligent Heater (up to 60°C)",
            "Special Program": "Steam Wash & Anti-Allergen Sanitizer Cycle"
        })
    },
    {
        group: "EXPENSIVE SMARTPHONES",
        category: "Electronics & Tech",
        subcategory: "Mobiles",
        types: ["Flagship Smartphones", "Foldable Phones", "Gaming Phones", "Premium Camera Phones", "Ultra Smartphones"],
        brands: ["Apple", "Samsung", "OnePlus", "Xiaomi"],
        colors: ["Titanium Grey", "Obsidian Black", "Deep Purple", "Emerald Green"],
        basePrice: 85000,
        descriptions: [
            "Define premium performance. Impeccably engineered with aerospace-grade metal chassis, custom silicon chipsets, and an unmatched triple-lens studio camera system for capturing outstanding moments.",
            "The future in your palm. Offering breathtaking display refresh rates, professional-grade low-light video features, and all-day extreme battery performance."
        ],
        specificationsGen: (type, brand, price) => ({
            "Processor": brand === "Apple" ? "Apple A17 Pro (3nm CPU)" : "Snapdragon 8 Gen 3 flagship octa-core",
            "Display": type.includes("Foldable") ? "7.6-inch Foldable Dynamic AMOLED 2X" : "6.8-inch Quad HD+ AMOLED (120Hz)",
            "Camera Details": "108MP Main + 50MP Periscope Telephoto + 12MP Ultra-wide",
            "RAM / Memory": price > 110000 ? "16GB LPDDR5X" : "12GB High-speed RAM",
            "Battery Charging": "5000mAh with 100W SuperVOOC / MagSafe Fast Wireless",
            "Build Frame": "Grade-5 Titanium frame with Ceramic Shield protector"
        })
    },
    {
        group: "LARGE FURNITURE",
        category: "Home Utility",
        subcategory: "Furniture & Decor",
        types: ["Study Tables", "Office Chairs", "Wardrobes", "Beds", "Sofa Sets", "TV Units"],
        brands: ["IKEA", "Nilkamal", "Pepperfry", "Godrej"],
        colors: ["Walnut Wood", "Teak Finish", "Charcoal Grey", "Ivory Cream"],
        basePrice: 18000,
        descriptions: [
            "Transform your hostel or room workspace with our premium ergonomics. Handcrafted from finest sustainably sourced solid wood, combining modular versatility with timeless structural beauty.",
            "Engineered for supreme comfort and back care. Boasting high density memory cushioning, adaptive mesh structures, and custom adjustments to keep you relaxed through long hours."
        ],
        specificationsGen: (type, brand, price) => ({
            "Frame Material": "Solid Teak Wood & High Tensile Carbon Steel",
            "Upholstery": type.includes("Sofa") || type.includes("Chair") ? "Premium Breathable Linen Fabric" : "Scratch-Resistant Melamine Oak Finish",
            "Adjustability": type.includes("Chair") ? "3D Armrest, Pneumatic Height, Dynamic Lumbar Support" : "Modular Assembly & Space Saving Folding",
            "Storage Cabinets": type.includes("Wardrobe") || type.includes("Bed") ? "Hydraulic Storage Under-lift / Double Drawer Cabinets" : "Built-in Cable Manager Nooks",
            "Assembly Required": "Professional Assembly Provided by HostelMart",
            "Wood Moisture Standard": "Kiln-dried wood below 12% moisture level"
        })
    },
    {
        group: "LUXURY DECOR",
        category: "Home Utility",
        subcategory: "Furniture & Decor",
        types: ["LED Wall Decor", "Premium Wall Clocks", "Decorative Lamps", "Artificial Plants", "Luxury Mirrors", "Room Aesthetic Decor"],
        brands: ["Philips", "IKEA", "Pepperfry", "Nilkamal"],
        colors: ["Warm Gold", "Matte Black", "Emerald Green", "Minimalist White"],
        basePrice: 45000, // Decor is generally lower than heavy appliances, but we scale it beautifully
        descriptions: [
            "Infuse your room with soothing, gorgeous vibes. Meticulously designed with ambient diffuse light guides and highly premium visual materials to establish the perfect peaceful aesthetic.",
            "Create a visual masterpiece on your walls. High precision materials, premium textures, and dynamic structures that complement modern rooms flawlessly."
        ],
        specificationsGen: (type, brand, price) => ({
            "Main Finish": "Anodized Golden Rose & Tempered Glass",
            "Illumination": type.includes("Lamps") || type.includes("LED") ? "Dimmable high CRI LED strip light (3000K-6000K)" : "Ambient reflective mirror finish",
            "Sensor Smart Controls": type.includes("LED") || type.includes("Lamps") ? "Touch control, Smart app, Voice sync compatible" : "Ultra-Silent Quartz Sweeping Movement",
            "Material Grade": "BPA-Free, Rust-Free Electroplated Alloy Elements",
            "Mounting Layout": "Integrated heavy-duty drywall mounting hangers",
            "Power Adapter": type.includes("LED") || type.includes("Lamps") ? "Safe 12V low-voltage adapter included" : "1x AA High-End battery cell powered"
        })
    }
];

const generatePremiumProducts = () => {
    const products = [];
    let idCounter = 1;

    // We generate 16 products for each group to ensure 16 * 6 = 96 high-quality premium products
    for (const pg of productGroups) {
        for (let i = 1; i <= 16; i++) {
            const brand = pg.brands[(i + idCounter) % pg.brands.length];
            const type = pg.types[(i + idCounter) % pg.types.length];
            
            // Craft realistic premium product names
            let name = "";
            let basePriceMultiplier = 1;
            let specsSuffix = "";
            let storageCapacity = undefined;
            let connectivity = undefined;
            let powerConsumption = undefined;
            let dimensions = "Varies by model";
            let warranty = "2 Years Official Brand Warranty";

            if (pg.group === "TVS") {
                const sizes = [55, 65, 75, 85];
                const size = sizes[i % sizes.length];
                name = `${brand} Bravia Ultra ${size}" Smart ${type}`;
                basePriceMultiplier = 1 + (size - 55) / 30 + (i * 0.05);
                specsSuffix = `Size: ${size}-inch`;
                connectivity = "Wi-Fi, Bluetooth, HDMI";
                powerConsumption = `${120 + i * 10}W Active Power`;
                dimensions = `${size * 2.2} x ${size * 1.3} x 5.8 cm`;
            } else if (pg.group === "REFRIGERATORS") {
                const capacities = ["190L", "250L", "340L", "450L", "650L"];
                const cap = capacities[i % capacities.length];
                name = `${brand} Intellishield Double-Zone ${cap} ${type}`;
                basePriceMultiplier = 0.6 + (i * 0.15);
                specsSuffix = `Capacity: ${cap}`;
                storageCapacity = cap;
                powerConsumption = `${150 + i * 8} kWh/Year rating`;
                dimensions = "175 x 68 x 72 cm";
                warranty = "10 Years Inverter Compressor Warranty";
            } else if (pg.group === "WASHING MACHINES") {
                const spins = ["7.0 Kg", "8.0 Kg", "9.5 Kg"];
                const spin = spins[i % spins.length];
                name = `${brand} Inverter Smart Steam ${spin} ${type}`;
                basePriceMultiplier = 0.7 + (i * 0.12);
                specsSuffix = `Load: ${spin}`;
                powerConsumption = "340W Eco Wash mode";
                dimensions = "85 x 60 x 60 cm";
                warranty = "3 Years Comprehensive, 10 Years Motor Warranty";
            } else if (pg.group === "EXPENSIVE SMARTPHONES") {
                const models = ["Pro Max", "Ultra 5G", "Fold V4", "Studio Edition"];
                const mod = models[i % models.length];
                const storages = ["256GB", "512GB", "1TB"];
                const storage = storages[i % storages.length];
                name = `${brand} ${mod} Super-Retina (${storage})`;
                basePriceMultiplier = 0.9 + (i * 0.14) + (storage === "1TB" ? 0.3 : 0);
                specsSuffix = `Storage: ${storage}`;
                storageCapacity = storage;
                connectivity = "5G, Wi-Fi 6E, Bluetooth 5.3, NFC";
                dimensions = "16.1 x 7.8 x 0.8 cm";
                warranty = "1 Year Brand Warranty with AppleCare/SamsungCare options";
            } else if (pg.group === "LARGE FURNITURE") {
                name = `${brand} Studio-Space Premium Modular ${type}`;
                basePriceMultiplier = 0.3 + (i * 0.18);
                specsSuffix = "Premium solid finish";
                dimensions = "120 x 60 x 75 cm";
                warranty = "5 Years Structure Warranty";
            } else if (pg.group === "LUXURY DECOR") {
                name = `${brand} Nordic-Vibe Artisan ${type}`;
                basePriceMultiplier = 0.05 + (i * 0.04); // Keep decor beautiful but lower absolute price
                specsSuffix = "Ambient handcrafted visual aesthetic";
                dimensions = "45 x 45 x 10 cm";
                warranty = "1 Year Philips/IKEA Brand Warranty";
            }

            const calculatedBase = pg.group === "LUXURY DECOR" ? 12000 : pg.basePrice;
            const price = Math.round(calculatedBase * basePriceMultiplier);
            const originalPrice = Math.round(price * (1.15 + (i % 3 === 0 ? 0.2 : 0.1)));
            const discountPercent = Math.round((1 - price / originalPrice) * 100);
            const discount = `${discountPercent}% OFF`;

            const colors = pg.colors.sort(() => 0.5 - Math.random()).slice(0, 2);
            const imagesList = imagesMap[pg.group];
            const primaryImage = imagesList[(i + idCounter) % imagesList.length];
            const secondaryImage = imagesList[(i + idCounter + 1) % imagesList.length];

            const highlights = [
                "Handpicked premium category essential",
                "Crafted using ultra-durable grade materials",
                "Advanced energy/performance efficiency architecture",
                "Delivered and assembled instantly at your room door",
                "Seamless integration with HostelMart ecosystem"
            ];

            const slug = name.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                + '-' + idCounter;

            products.push({
                name,
                slug,
                brand,
                description: pg.descriptions[i % pg.descriptions.length] + ` Built with professional craftsmanship by ${brand}, this premium ${type} combines sleek ergonomics with heavy performance capability. Ideal for hostel rooms or luxury setups seeking best-in-class style and reliability.`,
                category: pg.category,
                subcategory: pg.subcategory,
                section: "Premium Essentials",
                type,
                specifications: pg.specificationsGen(type, brand, price),
                dimensions,
                warranty,
                powerConsumption,
                connectivity,
                storageCapacity,
                colors,
                image: primaryImage,
                images: [primaryImage, secondaryImage],
                price,
                originalPrice,
                discount,
                stock: 5 + Math.floor(Math.random() * 45),
                rating: parseFloat((4.2 + (Math.random() * 0.8)).toFixed(1)),
                ratingsCount: 35 + Math.floor(Math.random() * 750),
                highlights,
                featured: i % 5 === 0,
                trending: i % 4 === 0,
                createdAt: new Date()
            });

            idCounter++;
        }
    }
    return products;
};

async function seedPremiumWithoutExit() {
    try {
        console.log("🗑️ Clearing existing Premium Essentials products...");
        const deleted = await Product.deleteMany({ section: "Premium Essentials" });
        console.log(`🧹 Cleared ${deleted.deletedCount} existing premium products.`);

        console.log("🌱 Generating 96 Premium products...");
        const premiumProducts = generatePremiumProducts();
        
        console.log(`🌱 Seeding ${premiumProducts.length} Premium products into MongoDB...`);
        const inserted = await Product.insertMany(premiumProducts);
        console.log(`🎉 Seeded ${inserted.length} Premium Essentials products successfully!`);
    } catch (error) {
        console.error("❌ Seeding Error in seedPremiumWithoutExit:", error);
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

        await seedPremiumWithoutExit();

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
    module.exports = { generatePremiumProducts, seedPremiumWithoutExit };
}

