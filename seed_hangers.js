const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const hangers = [
    {
        name: "IKEA BUMERANG Wooden Hanger (Pack of 8)",
        slug: "ikea-bumerang-wooden-hanger-8",
        brand: "IKEA",
        description: "Solid wood hanger with a sturdy hook. Ideal for coats, jackets, and heavy garments. Natural finish adds a premium look to your wardrobe.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Wooden",
        size: "Standard",
        colors: ["Natural Wood"],
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
        price: 499,
        originalPrice: 599,
        discount: "17% OFF",
        stock: 120,
        rating: 4.8,
        featured: true,
        trending: true
    },
    {
        name: "Amazon Basics Slim Velvet Hangers (Set of 30)",
        slug: "amazon-basics-slim-velvet-hangers-30",
        brand: "Amazon Basics",
        description: "Space-saving velvet hangers that prevent clothes from slipping. Ultra-slim profile to maximize closet space. Swivel hook for easy access.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Velvet",
        size: "Slim",
        colors: ["Black", "Grey", "Beige"],
        image: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&w=800&q=80",
        price: 899,
        originalPrice: 1299,
        discount: "31% OFF",
        stock: 250,
        rating: 4.7,
        featured: true,
        trending: false
    },
    {
        name: "Home Puff Multi-Layer Metal Hanger",
        slug: "home-puff-multi-layer-metal-hanger",
        brand: "Home Puff",
        description: "5-Tier swing arm trousers hanger. Made of high-quality stainless steel with non-slip coating. Saves massive space in your hostel cupboard.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Steel",
        size: "Multi-Layer",
        colors: ["Silver", "Black"],
        image: "https://images.unsplash.com/photo-1594235041071-79942790906d?auto=format&fit=crop&w=800&q=80",
        price: 349,
        originalPrice: 499,
        discount: "30% OFF",
        stock: 85,
        rating: 4.5,
        featured: false,
        trending: true
    },
    {
        name: "Cello Plastic Hangers with Notches (Set of 12)",
        slug: "cello-plastic-hangers-12",
        brand: "Cello",
        description: "Durable plastic hangers with shoulder notches for straps. Lightweight yet strong enough for daily wear. Available in vibrant colors.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Plastic",
        size: "Standard",
        colors: ["Blue", "Green", "Red"],
        image: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=800&q=80",
        price: 199,
        originalPrice: 299,
        discount: "33% OFF",
        stock: 500,
        rating: 4.2,
        featured: false,
        trending: false
    },
    {
        name: "Nayasa Foldable Travel Hangers (Pack of 4)",
        slug: "nayasa-foldable-travel-hangers-4",
        brand: "Nayasa",
        description: "Compact and foldable hangers, perfect for travel and hostel use. Fits easily in luggage. Expandable to full size when needed.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Plastic",
        size: "Foldable",
        colors: ["Yellow", "Pink", "Blue"],
        image: "https://images.unsplash.com/photo-1616627187314-bc81e3586075?auto=format&fit=crop&w=800&q=80",
        price: 149,
        originalPrice: 199,
        discount: "25% OFF",
        stock: 150,
        rating: 4.4,
        featured: true,
        trending: false
    },
    {
        name: "Solimo Stainless Steel Heavy Duty Hangers (Set of 6)",
        slug: "solimo-ss-heavy-duty-hangers-6",
        brand: "Solimo",
        description: "Rust-proof stainless steel hangers. Ultra-strong build for heavy winter coats and jeans. Smooth edges to protect fabric.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Steel",
        size: "Heavy Duty",
        colors: ["Silver"],
        image: "https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?auto=format&fit=crop&w=800&q=80",
        price: 599,
        originalPrice: 799,
        discount: "25% OFF",
        stock: 90,
        rating: 4.6,
        featured: false,
        trending: true
    },
    {
        name: "Amazon Basics Kids Velvet Hangers (Set of 20)",
        slug: "amazon-basics-kids-velvet-hangers-20",
        brand: "Amazon Basics",
        description: "Smaller sized velvet hangers designed for kids' clothing. Non-slip surface and slim design. Great for small-sized hostel clothes.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Velvet",
        size: "Kids",
        colors: ["Pink", "Sky Blue"],
        image: "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&w=800&q=80",
        price: 649,
        originalPrice: 899,
        discount: "28% OFF",
        stock: 110,
        rating: 4.7,
        featured: false,
        trending: false
    },
    {
        name: "Home Puff 360° Rotating Clip Hanger",
        slug: "home-puff-rotating-clip-hanger",
        brand: "Home Puff",
        description: "Rotating hanger with 12 clips for socks, undergarments, and small items. Foldable design for easy storage. Ideal for drying small clothes.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Plastic",
        size: "Rotating",
        colors: ["White", "Blue"],
        image: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=800&q=80",
        price: 279,
        originalPrice: 399,
        discount: "30% OFF",
        stock: 200,
        rating: 4.3,
        featured: true,
        trending: true
    },
    {
        name: "IKEA SPRUTTIG Hangers Black (Pack of 10)",
        slug: "ikea-spruttig-hangers-black-10",
        brand: "IKEA",
        description: "Basic black plastic hangers that take up minimal space. Perfect for shirts, dresses, and trousers. Very affordable for students.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Plastic",
        size: "Standard",
        colors: ["Black"],
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
        price: 129,
        originalPrice: 149,
        discount: "13% OFF",
        stock: 1000,
        rating: 4.1,
        featured: false,
        trending: false
    },
    {
        name: "Cello Rubber Coated Non-Slip Hangers (Set of 10)",
        slug: "cello-rubber-coated-hangers-10",
        brand: "Cello",
        description: "Metal hangers with premium rubber coating. Prevents slipping and maintains garment shape. High weight capacity.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Rubber Coated",
        size: "Standard",
        colors: ["Black", "Blue"],
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
        price: 449,
        originalPrice: 599,
        discount: "25% OFF",
        stock: 180,
        rating: 4.5,
        featured: true,
        trending: false
    }
];

// Generate 20 more hangers to reach 30+
const extraHangers = [
    { name: "Nayasa Space-Saving Magic Hanger", slug: "nayasa-magic-hanger", material: "Plastic", brand: "Nayasa", size: "Space Saving", price: 199 },
    { name: "Solimo Wooden Suit Hangers (Set of 3)", slug: "solimo-wooden-suit-hangers", material: "Wooden", brand: "Solimo", size: "Large", price: 699 },
    { name: "Amazon Basics Cascading Hanger Hooks", slug: "amazon-basics-cascading-hooks", material: "Plastic", brand: "Amazon Basics", size: "Space Saving", price: 299 },
    { name: "Home Puff Stainless Steel S-Hangers", slug: "home-puff-s-hangers", material: "Steel", brand: "Home Puff", size: "Multi-Layer", price: 249 },
    { name: "IKEA STAJLIG Hangers White", slug: "ikea-stajlig-white", material: "Steel", brand: "IKEA", size: "Standard", price: 399 },
    { name: "Cello Neon Plastic Hangers", slug: "cello-neon-hangers", material: "Plastic", brand: "Cello", size: "Standard", price: 179 },
    { name: "Nayasa Kids Colorful Hangers", slug: "nayasa-kids-hangers", material: "Plastic", brand: "Nayasa", size: "Kids", price: 129 },
    { name: "Solimo Anti-Rust Steel Hangers", slug: "solimo-anti-rust-hangers", material: "Steel", brand: "Solimo", size: "Standard", price: 499 },
    { name: "Amazon Basics Velvet Skirt Hangers", slug: "amazon-basics-skirt-hangers", material: "Velvet", brand: "Amazon Basics", size: "Clip Hangers", price: 799 },
    { name: "Home Puff Foldable Wall Hanger", slug: "home-puff-wall-hanger", material: "Plastic", brand: "Home Puff", size: "Foldable", price: 599 },
    { name: "IKEA BAGIS Kids Hangers", slug: "ikea-bagis-kids", material: "Plastic", brand: "IKEA", size: "Kids", price: 99 },
    { name: "Cello Heavy Duty Coat Hangers", slug: "cello-heavy-duty-coat", material: "Plastic", brand: "Cello", size: "Heavy Duty", price: 349 },
    { name: "Nayasa Deluxe Padded Hangers", slug: "nayasa-padded-hangers", material: "Fabric", brand: "Nayasa", size: "Standard", price: 299 },
    { name: "Solimo Slim Profile Steel Hangers", slug: "solimo-slim-steel", material: "Steel", brand: "Solimo", size: "Slim", price: 449 },
    { name: "Amazon Basics Wide Shoulder Wooden Hangers", slug: "amazon-basics-wide-wooden", material: "Wooden", brand: "Amazon Basics", size: "Large", price: 899 },
    { name: "Home Puff 10-Clip Drying Hanger", slug: "home-puff-10-clip-drying", material: "Steel", brand: "Home Puff", size: "Clip Hangers", price: 399 },
    { name: "IKEA HEDRA Hangers Chrome", slug: "ikea-hedra-chrome", material: "Steel", brand: "IKEA", size: "Standard", price: 499 },
    { name: "Cello Swivel Hook Plastic Hangers", slug: "cello-swivel-hook", material: "Plastic", brand: "Cello", size: "Rotating", price: 229 },
    { name: "Nayasa Retractable Travel Hanger", slug: "nayasa-retractable-travel", material: "Plastic", brand: "Nayasa", size: "Foldable", price: 189 },
    { name: "Solimo Premium Velvet Hangers with Clips", slug: "solimo-velvet-clips", material: "Velvet", brand: "Solimo", size: "Clip Hangers", price: 749 },
    { name: "Amazon Basics Multi-Layer Scarf Hanger", slug: "amazon-basics-scarf-hanger", material: "Steel", brand: "Amazon Basics", size: "Multi-Layer", price: 349 }
];

const fullHangers = [...hangers];
extraHangers.forEach((h, idx) => {
    fullHangers.push({
        ...h,
        description: `Premium ${h.material} hanger by ${h.brand}. Optimized for ${h.size} use. Durable and stylish design for your hostel wardrobe.`,
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        colors: ["Black", "White", "Silver"],
        image: `https://images.unsplash.com/photo-${1584622650111 + idx}-993a426fbf0a?auto=format&fit=crop&w=800&q=80`,
        originalPrice: h.price + 100,
        discount: "₹100 OFF",
        stock: 50 + (idx * 5),
        rating: 4.0 + (Math.random() * 0.9),
        featured: idx % 4 === 0,
        trending: idx % 5 === 0,
        createdAt: new Date()
    });
});

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Remove only hangers from Home > Laundry
        const result = await Product.deleteMany({ subcategory: "Laundry" });
        console.log(`🗑️ ${result.deletedCount} existing hangers cleared.`);

        await Product.insertMany(fullHangers);
        console.log(`🌱 ${fullHangers.length} Hanger products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
