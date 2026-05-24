/**
 * seed_bags.js
 * Database seeding script for HostelMart to dynamically add 520 Bag & Travel Accessory products.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

// High-resolution images map for each group from Unsplash
const imagesMap = {
    "SCHOOL & COLLEGE BAGS": [
        "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1546938576-6e6a6a931cf5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
    ],
    "LAPTOP & OFFICE BAGS": [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1605733513597-a8f8d410f286?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524498250077-3a9f0c57839b?auto=format&fit=crop&w=800&q=80"
    ],
    "BACKPACKS": [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80"
    ],
    "TRAVEL BAGS": [
        "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1605733513597-a8f8d410f286?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
    ],
    "SPORTS & FITNESS": [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520116468886-83bc98619399?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&w=800&q=80"
    ],
    "FASHION & DAILY USE": [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566150905458-1bf1fc15aae9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
    ],
    "UTILITY & STORAGE": [
        "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1605733513597-a8f8d410f286?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80"
    ],
    "SPECIALTY BAGS": [
        "https://images.unsplash.com/photo-1500051638674-ff996a0bc29e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    "WALLETS & ACCESSORIES": [
        "https://images.unsplash.com/photo-1627124703855-7a3287c81a42?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1588444839799-eb08ff7779f4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1601924582970-d478cbfd1b4c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    "SMART & PREMIUM": [
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1605733513597-a8f8d410f286?auto=format&fit=crop&w=800&q=80"
    ]
};

const groupsConfig = [
    {
        name: "SCHOOL & COLLEGE BAGS",
        category: "Hostel & Student Essentials",
        subcategory: "Student Essentials",
        sections: ["Student Essentials", "Daily Use Essentials"],
        types: ["School Bags", "College Bags", "Kids School Bags", "Cartoon Bags", "Trolley School Bags", "Student Combo Bags"],
        brands: ["Skybags", "Wildcraft", "Safari", "Arctic Fox", "Fastrack", "Nike", "Adidas", "Puma", "Gear"],
        materials: ["Polyester", "Nylon", "Canvas", "Eco-Polyester"],
        basePrice: 1200,
        capacities: ["22L", "28L", "32L", "35L", "40L"],
        compartments: ["2 compartments", "3 compartments", "4 compartments"],
        waterproof: ["Yes", "Water-resistant", "No"],
        laptopCompatibility: ["No", "Up to 14 inch", "Up to 15.6 inch"],
        usbCharging: ["No"],
        antiTheft: ["No", "Yes"],
        weights: ["0.4 kg", "0.5 kg", "0.6 kg", "0.7 kg"]
    },
    {
        name: "LAPTOP & OFFICE BAGS",
        category: "Hostel & Student Essentials",
        subcategory: "Bags & Backpacks",
        sections: ["Student Essentials", "Premium Essentials"],
        types: ["Laptop Bags", "Laptop Sleeves", "Office Bags", "Business Bags", "Briefcases", "Document Bags", "File Bags", "Messenger Bags", "Tech Organizer Bags", "Cable Organizer Pouches"],
        brands: ["Dell", "HP", "Lenovo", "Targus", "Samsonite", "Tommy Hilfiger", "Mokobara", "Arctic Fox", "Gear"],
        materials: ["Ballistic Nylon", "Premium Faux Leather", "Polyester", "Canvas"],
        basePrice: 1800,
        capacities: ["5L", "12L", "18L", "24L", "30L"],
        compartments: ["1 compartment", "2 compartments", "3 compartments", "Multi-pocket organizer"],
        waterproof: ["Water-resistant", "Yes"],
        laptopCompatibility: ["Up to 13.3 inch", "Up to 14 inch", "Up to 15.6 inch", "Up to 17.3 inch"],
        usbCharging: ["No", "Yes"],
        antiTheft: ["Yes", "No"],
        weights: ["0.3 kg", "0.5 kg", "0.8 kg", "1.1 kg"]
    },
    {
        name: "BACKPACKS",
        category: "Hostel & Student Essentials",
        subcategory: "Bags & Backpacks",
        sections: ["Student Essentials", "Travel Essentials", "Daily Use Essentials"],
        types: ["Backpacks", "Travel Backpacks", "Hiking Backpacks", "Trekking Bags", "Rucksacks", "Mini Backpacks", "Fashion Backpacks", "Military Backpacks", "Gaming Theme Bags", "Anime Theme Bags"],
        brands: ["Wildcraft", "Skybags", "American Tourister", "Decathlon", "Arctic Fox", "Nike", "Adidas", "Puma", "Gear"],
        materials: ["Ripstop Nylon", "Polyester", "Cordura Fabric", "Canvas"],
        basePrice: 1500,
        capacities: ["30L", "40L", "50L", "65L", "80L"],
        compartments: ["2 compartments", "3 compartments", "Multi-tier specialized"],
        waterproof: ["Yes", "Water-resistant"],
        laptopCompatibility: ["Up to 15.6 inch", "Up to 16 inch", "No"],
        usbCharging: ["No", "Yes"],
        antiTheft: ["No", "Yes"],
        weights: ["0.6 kg", "0.9 kg", "1.2 kg", "1.6 kg"]
    },
    {
        name: "TRAVEL BAGS",
        category: "Hostel & Student Essentials",
        subcategory: "Travel Essentials",
        sections: ["Travel Essentials", "Premium Essentials"],
        types: ["Trolley Bags", "Cabin Bags", "Duffel Bags", "Overnight Bags", "Weekender Bags", "Luggage Sets", "Hard Shell Suitcases", "Soft Shell Suitcases", "Garment Bags", "Folding Travel Bags", "Hostel Moving Bags", "Large Storage Travel Bags"],
        brands: ["American Tourister", "Samsonite", "Mokobara", "Safari", "VIP", "Skybags", "Tommy Hilfiger", "Decathlon"],
        materials: ["Polycarbonate", "ABS Hard Plastic", "Polyester Duotone", "Premium Leather"],
        basePrice: 3500,
        capacities: ["45L", "60L", "75L", "100L", "125L"],
        compartments: ["1 large compartment", "2 split compartments", "3 compartments with organizers"],
        waterproof: ["Yes", "Water-resistant"],
        laptopCompatibility: ["No", "Up to 14 inch", "Up to 15.6 inch"],
        usbCharging: ["No", "Yes"],
        antiTheft: ["Yes", "No"],
        weights: ["1.8 kg", "2.5 kg", "3.4 kg", "4.2 kg"]
    },
    {
        name: "SPORTS & FITNESS",
        category: "Fashion & Apparel",
        subcategory: "Bags & Backpacks",
        sections: ["Daily Use Essentials", "Student Essentials"],
        types: ["Gym Bags", "Sports Bags", "Cricket Kit Bags", "Football Bags", "Badminton Kit Bags", "Yoga Mat Bags", "Dance Bags", "Swimming Bags", "Cycling Bags"],
        brands: ["Nike", "Adidas", "Puma", "Decathlon", "Wildcraft", "Fastrack"],
        materials: ["Polyester", "Mesh & TPU", "Ripstop Nylon", "Waterproof PVC"],
        basePrice: 900,
        capacities: ["15L", "25L", "35L", "45L"],
        compartments: ["1 main + shoe pocket", "2 compartments", "Dedicated kit organizer"],
        waterproof: ["Water-resistant", "Yes"],
        laptopCompatibility: ["No"],
        usbCharging: ["No"],
        antiTheft: ["No"],
        weights: ["0.3 kg", "0.4 kg", "0.6 kg", "0.8 kg"]
    },
    {
        name: "FASHION & DAILY USE",
        category: "Fashion & Apparel",
        subcategory: "Bags & Backpacks",
        sections: ["Daily Use Essentials", "Premium Essentials"],
        types: ["Sling Bags", "Crossbody Bags", "Tote Bags", "Handbags", "Shoulder Bags", "Satchels", "Party Clutches", "Evening Bags", "Wedding Potli Bags", "Ethnic Bags", "Beach Bags"],
        brands: ["Lavie", "Tommy Hilfiger", "Fastrack", "Puma", "Nike", "Adidas", "Mokobara"],
        materials: ["Vegan Leather", "Premium Cotton Canvas", "Jacquard Fabric", "Jute-Cotton Blend"],
        basePrice: 1100,
        capacities: ["3L", "6L", "10L", "15L", "20L"],
        compartments: ["1 compartment", "2 compartments", "3 compartments"],
        waterproof: ["No", "Water-resistant"],
        laptopCompatibility: ["No", "Up to 13.3 inch"],
        usbCharging: ["No"],
        antiTheft: ["No", "Yes"],
        weights: ["0.2 kg", "0.3 kg", "0.5 kg", "0.7 kg"]
    },
    {
        name: "UTILITY & STORAGE",
        category: "Hostel & Student Essentials",
        subcategory: "Student Essentials",
        sections: ["Daily Use Essentials", "Student Essentials"],
        types: ["Laundry Bags", "Storage Bags", "Vacuum Storage Bags", "Grocery Bags", "Reusable Shopping Bags", "Cooler Bags", "Picnic Bags", "Utility Tote Bags"],
        brands: ["Decathlon", "IKEA", "Wildcraft", "Safari", "Gear"],
        materials: ["Oxford Fabric", "PEVA Waterproof Liner", "Recycled Mesh", "Canvas"],
        basePrice: 450,
        capacities: ["20L", "40L", "60L", "80L", "100L"],
        compartments: ["1 single space", "2 compartments (wet/dry)"],
        waterproof: ["Yes", "Water-resistant"],
        laptopCompatibility: ["No"],
        usbCharging: ["No"],
        antiTheft: ["No"],
        weights: ["0.15 kg", "0.25 kg", "0.4 kg", "0.6 kg"]
    },
    {
        name: "SPECIALTY BAGS",
        category: "Fashion & Apparel",
        subcategory: "Bags & Backpacks",
        sections: ["Premium Essentials", "Travel Essentials"],
        types: ["Camera Bags", "DSLR Bags", "Drone Bags", "Food Delivery Bags", "Bike Delivery Bags", "Medical Bags", "First Aid Bags", "Tool Bags", "Tactical Bags", "Waterproof Bags", "Dry Bags", "Helmet Bags"],
        brands: ["Targus", "Decathlon", "Wildcraft", "Samsonite", "Arctic Fox", "Gear"],
        materials: ["High-Density EVA shell", "Ripstop Nylon", "Tarpaulin Waterproof", "Cordura Heavy Duty"],
        basePrice: 2200,
        capacities: ["10L", "20L", "30L", "45L"],
        compartments: ["Custom Modular dividers", "Multi-pocket technical panel", "Dry-pack single chamber"],
        waterproof: ["Yes", "IPX6 Waterproof"],
        laptopCompatibility: ["Up to 15.6 inch", "No", "Up to 14 inch"],
        usbCharging: ["No", "Yes"],
        antiTheft: ["Yes", "No"],
        weights: ["0.6 kg", "0.9 kg", "1.3 kg", "1.8 kg"]
    },
    {
        name: "WALLETS & ACCESSORIES",
        category: "Fashion & Apparel",
        subcategory: "Travel Essentials",
        sections: ["Daily Use Essentials", "Travel Essentials"],
        types: ["Wallets", "Card Holders", "Passport Holders", "Travel Organizers", "Coin Pouches", "Mobile Pouches", "Bottle Holders", "RFID Protected Bags"],
        brands: ["Tommy Hilfiger", "Lavie", "Fastrack", "Wildcraft", "Mokobara", "Puma", "Nike", "Adidas"],
        materials: ["Genuine Nappa Leather", "Saffiano Vegan Leather", "Structured Canvas", "Carbon Fiber"],
        basePrice: 600,
        capacities: ["0.5L", "1L", "2L"],
        compartments: ["Card slots + cash folds", "Multi-slot passport sleeve", "Single pocket zip closure"],
        waterproof: ["No", "Water-resistant"],
        laptopCompatibility: ["No"],
        usbCharging: ["No"],
        antiTheft: ["Yes (RFID)", "No"],
        weights: ["0.05 kg", "0.1 kg", "0.2 kg"]
    },
    {
        name: "SMART & PREMIUM",
        category: "Hostel & Student Essentials",
        subcategory: "Bags & Backpacks",
        sections: ["Premium Essentials", "Student Essentials", "Travel Essentials"],
        types: ["Smart Bags with USB Charging", "Anti-Theft Bags", "Premium Leather Bags", "Canvas Bags", "Eco-Friendly Bags", "Jute Bags", "Foldable Bags", "Luxury Designer Bags", "Custom Printed Bags"],
        brands: ["Mokobara", "Samsonite", "Tommy Hilfiger", "Arctic Fox", "Targus", "Wildcraft", "Skybags"],
        materials: ["Vegan Saffiano Leather", "Recycled Ocean Plastics", "Waxed Canvas", "Anodized Carbon Shell"],
        basePrice: 2800,
        capacities: ["25L", "30L", "35L", "42L"],
        compartments: ["3 compartments with organizers", "Hidden security pockets", "Dual modular chambers"],
        waterproof: ["Yes", "Water-resistant"],
        laptopCompatibility: ["Up to 15.6 inch", "Up to 16 inch", "Up to 17.3 inch"],
        usbCharging: ["Yes"],
        antiTheft: ["Yes"],
        weights: ["0.8 kg", "1.1 kg", "1.4 kg"]
    }
];

const colorsList = ["Classic Black", "Navy Blue", "Olive Green", "Charcoal Grey", "Burgundy Red", "Tan Brown", "Forest Green", "Desert Sand"];

function generateBags() {
    const products = [];
    let slugRegistry = new Set();

    // We generate 52 products per group to get 520 products.
    for (const group of groupsConfig) {
        const imagePool = imagesMap[group.name] || imagesMap["BACKPACKS"];
        
        for (let i = 1; i <= 52; i++) {
            const brand = group.brands[(i) % group.brands.length];
            const type = group.types[(i) % group.types.length];
            const material = group.materials[(i) % group.materials.length];
            const capacity = group.capacities[(i) % group.capacities.length];
            const comp = group.compartments[(i) % group.compartments.length];
            const wproof = group.waterproof[(i) % group.waterproof.length];
            const lapComp = group.laptopCompatibility[(i) % group.laptopCompatibility.length];
            const usb = group.usbCharging[(i) % group.usbCharging.length];
            const theft = group.antiTheft[(i) % group.antiTheft.length];
            const weight = group.weights[(i) % group.weights.length];
            const section = group.sections[(i) % group.sections.length];

            // Formulate standard specifications
            const specs = {
                "Material": material,
                "Capacity": capacity,
                "Compartments": comp,
                "Water Resistance": wproof,
                "Laptop Sleeve": lapComp,
                "USB Charging Port": usb,
                "Anti-Theft Locking": theft,
                "Weight": weight,
                "Warranty": i % 3 === 0 ? "2 Years International Warranty" : "1 Year Brand Warranty"
            };

            // Pricing logic
            const base = group.basePrice;
            const sizeScale = parseInt(capacity) ? (parseInt(capacity) * 15) : 50;
            const premiumScale = brand === "Samsonite" || brand === "Tommy Hilfiger" || brand === "Mokobara" ? 1.6 : 1.0;
            const price = Math.round((base + sizeScale + (i * 25)) * premiumScale);
            const discountPercent = 15 + ((i * 3) % 45); // 15% to 60%
            const originalPrice = Math.round(price / (1 - (discountPercent / 100)));
            const discount = `${discountPercent}% OFF`;

            // Dynamic Name
            // Let's create realistic names based on group and attributes
            let name = "";
            const seriesNames = ["Apex", "Vanguard", "Ranger", "Nomad", "Elysian", "Urbanite", "Rover", "Transit", "Pro-Tect", "Neo", "Classic", "Glider", "Stealth", "Pinnacle"];
            const series = seriesNames[(i + group.types.indexOf(type)) % seriesNames.length];
            
            if (group.name === "SCHOOL & COLLEGE BAGS") {
                name = `${brand} ${series} ${capacity} ${type}`;
            } else if (group.name === "LAPTOP & OFFICE BAGS") {
                name = `${brand} ${series} Professional ${type} (${lapComp})`;
            } else if (group.name === "BACKPACKS") {
                name = `${brand} ${series} Outdoor ${capacity} ${type}`;
            } else if (group.name === "TRAVEL BAGS") {
                name = `${brand} ${series} Travel ${capacity} ${type}`;
            } else if (group.name === "WALLETS & ACCESSORIES") {
                name = `${brand} ${series} ${type}`;
                if (type.includes("RFID")) {
                    name = `${brand} ${series} RFID Secure ${type}`;
                }
            } else {
                name = `${brand} ${series} ${capacity} ${type}`;
            }

            // Colors selection
            const colors = [
                colorsList[(i) % colorsList.length],
                colorsList[(i + 1) % colorsList.length]
            ];

            // Slug generation
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

            const highlights = [
                `Ultra-durable ${material} construction engineered for everyday heavy-duty use.`,
                `High comfort design with breathable airflow back mesh and padded shoulder support.`,
                wproof === "Yes" ? "100% complete waterproof protection shielding contents from rainfall." : "Splash-proof exterior finish keeping moisture and dust out.",
                lapComp !== "No" ? `Dedicated padded shockproof sleeve fits up to ${lapComp} laptop.` : "Spacious main compartment tailored with quick-access pockets.",
                theft !== "No" ? "Features hidden zipper pockets and anti-theft security structure." : "Equipped with rugged dual heavy-duty SBS zippers.",
                `Backed by HostelMart official 100% genuine quality verification.`
            ];

            const dims = `${40 + (i % 15)} x ${28 + (i % 10)} x ${18 + (i % 8)} cm`;

            products.push({
                name,
                slug: finalSlug,
                brand,
                description: `Elevate your lifestyle with the ${name}. Beautifully engineered using top-tier ${material} by ${brand}, this premium ${type} features a capacity of ${capacity} and is optimized with ${comp} to store all your essentials efficiently. Boasting a premium ergonomic profile, it provides outstanding balance and back comfort for long commutes, travel layovers, or standard class hours. Fully tested for durability under strict daily-use guidelines, this is the perfect reliable accessory for college students, professionals, and frequent explorers alike.`,
                category: group.category,
                subcategory: group.subcategory,
                section: section,
                type,
                material,
                capacity,
                compartments: comp,
                laptopCompatibility: lapComp,
                waterproof: wproof,
                usbCharging: usb,
                antiTheft: theft,
                dimensions: dims,
                weight: weight,
                colors,
                image: primaryImage,
                images: [primaryImage, secondaryImage],
                price,
                originalPrice,
                discount,
                stock: 12 + Math.floor(Math.random() * 88),
                rating: parseFloat((3.9 + (Math.random() * 1.1)).toFixed(1)),
                ratingsCount: 22 + Math.floor(Math.random() * 480),
                highlights,
                specifications: specs,
                featured: i % 10 === 0,
                trending: i % 8 === 0,
                createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) // staggered created dates
            });
        }
    }

    return products;
}

async function seedBags() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in the environment variables!");
        }

        console.log("🔌 Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        console.log("🗑️ Clearing existing bag and travel accessory products...");
        
        // Remove only bag-specific subcategories to prevent accidental catalog wipes
        const deleted = await Product.deleteMany({
            subcategory: { $in: ["Bags & Backpacks", "Travel Essentials", "Student Essentials"] },
            category: { $in: ["Fashion & Apparel", "Hostel & Student Essentials"] },
            material: { $exists: true } // just as an extra check
        });
        console.log(`🧹 Cleared ${deleted.deletedCount} existing bag/accessory products.`);

        console.log("🌱 Generating 520 realistic Bag & Travel Accessory products...");
        const bags = generateBags();
        
        console.log(`🌱 Seeding ${bags.length} products into MongoDB Atlas...`);
        const inserted = await Product.insertMany(bags);
        console.log(`🎉 Seeded ${inserted.length} Bag and Travel Accessory products successfully!`);

        mongoose.connection.close();
        console.log("🔌 Database connection closed gracefully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedBags();
