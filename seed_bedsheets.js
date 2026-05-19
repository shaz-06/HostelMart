const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const bedsheets = [
    {
        name: "Bombay Dyeing 100% Cotton Double Bedsheet with 2 Pillow Covers",
        slug: "bombay-dyeing-cotton-double-bedsheet-floral",
        brand: "Bombay Dyeing",
        description: "Experience luxury with this premium 100% cotton double bedsheet from Bombay Dyeing. Features a vibrant floral print that adds elegance to your bedroom. Soft, breathable, and skin-friendly fabric ensures a comfortable sleep.",
        category: "Home",
        subcategory: "Bedroom",
        section: "Daily Use Essentials",
        material: "Cotton",
        size: "Double",
        threadCount: "144 TC",
        colors: ["Floral Blue", "Pink"],
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
        ],
        price: 899,
        originalPrice: 1499,
        discount: "40% OFF",
        stock: 50,
        rating: 4.5,
        ratingsCount: 128,
        highlights: ["100% Pure Cotton", "Fade Resistant", "Machine Washable", "Soft & Breathable"],
        featured: true,
        trending: true,
        createdAt: new Date()
    },
    {
        name: "Spaces Premium Elastic Fitted Single Bedsheet",
        slug: "spaces-elastic-fitted-single-bedsheet-solid",
        brand: "Spaces",
        description: "Tired of tucking your bedsheet every morning? This elastic fitted single bedsheet from Spaces stays perfectly in place. Made from high-quality microfiber with a soft finish. Ideal for hostel beds.",
        category: "Home",
        subcategory: "Bedroom",
        section: "Daily Use Essentials",
        material: "Microfiber",
        size: "Single",
        threadCount: "180 TC",
        colors: ["Navy Blue", "Grey", "White"],
        image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80"
        ],
        price: 549,
        originalPrice: 899,
        discount: "39% OFF",
        stock: 120,
        rating: 4.3,
        ratingsCount: 85,
        highlights: ["Elastic Fitted", "Wrinkle Resistant", "Perfect for Hostel Beds", "Easy Care"],
        featured: true,
        trending: false,
        createdAt: new Date()
    },
    {
        name: "Raymond Home Geometric Print King Size Bedsheet",
        slug: "raymond-home-geometric-king-bedsheet",
        brand: "Raymond Home",
        description: "Add a modern touch to your room with this geometric print king size bedsheet from Raymond Home. Crafted from premium polycotton for durability and comfort. Includes two matching pillow covers.",
        category: "Home",
        subcategory: "Bedroom",
        section: "Daily Use Essentials",
        material: "Polycotton",
        size: "King",
        threadCount: "210 TC",
        colors: ["Grey Geometric", "Brown"],
        image: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&w=800&q=80"
        ],
        price: 1299,
        originalPrice: 1999,
        discount: "35% OFF",
        stock: 30,
        rating: 4.7,
        ratingsCount: 42,
        highlights: ["Durable Polycotton", "Modern Design", "Large King Size", "No Shrinkage"],
        featured: false,
        trending: true,
        createdAt: new Date()
    },
    {
        name: "Home Centre Cotton Satin Stripe Double Bedsheet",
        slug: "home-centre-satin-stripe-double-bedsheet",
        brand: "Home Centre",
        description: "Hotel-like luxury at home. This cotton satin stripe bedsheet from Home Centre offers a silky smooth feel and a premium look. High thread count ensures exceptional softness and longevity.",
        category: "Home",
        subcategory: "Bedroom",
        section: "Daily Use Essentials",
        material: "Cotton Satin",
        size: "Double",
        threadCount: "300 TC",
        colors: ["Pure White", "Beige", "Light Blue"],
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
        price: 1599,
        originalPrice: 2499,
        discount: "36% OFF",
        stock: 25,
        rating: 4.8,
        ratingsCount: 56,
        highlights: ["Cotton Satin Finish", "Luxurious Feel", "Hotel Quality", "Breathable"],
        featured: true,
        trending: false,
        createdAt: new Date()
    }
];

// Brands: Bombay Dyeing, Spaces, Raymond Home, Home Centre, Trident, Solimo
const brands = ["Bombay Dyeing", "Spaces", "Raymond Home", "Home Centre", "Trident", "Solimo"];
const materials = ["Cotton", "Microfiber", "Satin", "Polycotton", "Flannel"];
const sizes = ["Single", "Double", "King", "Queen"];
const types = ["Floral", "Geometric", "Solid", "Striped", "Cartoon", "Mandala"];

function generateBedsheets(count) {
    const products = [];
    for (let i = 0; i < count; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const tc = [144, 180, 210, 300, 400][Math.floor(Math.random() * 5)];
        const basePrice = size === "Single" ? 399 : size === "Double" ? 799 : size === "Queen" ? 999 : 1299;
        const priceAdd = (tc / 100) * 100;
        const price = basePrice + priceAdd + Math.floor(Math.random() * 200);
        const originalPrice = price + Math.floor(Math.random() * 500) + 200;
        const discountVal = Math.round(((originalPrice - price) / originalPrice) * 100);

        products.push({
            name: `${brand} ${type} Print ${material} ${size} Bedsheet`,
            slug: `${brand.toLowerCase().replace(/ /g, '-')}-${type.toLowerCase()}-${material.toLowerCase()}-${size.toLowerCase()}-${i}`,
            brand: brand,
            description: `Premium ${material} ${size} bedsheet by ${brand}. Featuring a beautiful ${type} design, this bedsheet is perfect for daily use. With a thread count of ${tc}, it offers superior comfort and durability. Ideal for your hostel or home bedroom.`,
            category: "Home",
            subcategory: "Bedroom",
            section: "Daily Use Essentials",
            material: material,
            size: size,
            threadCount: `${tc} TC`,
            colors: [type, "Multi"],
            image: `https://images.unsplash.com/photo-${1522771739844 + i}-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80`,
            images: [`https://images.unsplash.com/photo-${1522771739844 + i}-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80`],
            price: price,
            originalPrice: originalPrice,
            discount: `${discountVal}% OFF`,
            stock: 20 + Math.floor(Math.random() * 80),
            rating: 3.8 + (Math.random() * 1.1),
            ratingsCount: 10 + Math.floor(Math.random() * 200),
            highlights: [`${material} Material`, `${size} Size`, `${tc} Thread Count`, "Easy to Wash", "Breathable Fabric"],
            featured: i % 5 === 0,
            trending: i % 4 === 0,
            createdAt: new Date()
        });
    }
    return products;
}

const allBedsheets = [...bedsheets, ...generateBedsheets(36)];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Clear existing Bedroom products to avoid duplicates
        const result = await Product.deleteMany({ subcategory: "Bedroom" });
        console.log(`🗑️ ${result.deletedCount} existing bedroom products cleared.`);

        await Product.insertMany(allBedsheets);
        console.log(`🌱 ${allBedsheets.length} Bedsheet products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
