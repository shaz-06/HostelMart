const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const brands = ["Home Puff", "IKEA", "Solimo", "Storite", "Spaces", "Kuber Industries"];
const materials = ["Cotton", "Polyester", "Mesh", "Canvas", "Nylon", "Oxford Fabric"];
const capacities = ["30L", "45L", "60L", "80L", "100L"];
const sizes = ["Small", "Medium", "Large", "Extra Large"];
const types = [
    "Foldable Laundry Bag",
    "Waterproof Laundry Bag",
    "Mesh Laundry Bag",
    "Laundry Basket Bag",
    "Travel Laundry Bag",
    "Drawstring Laundry Bag",
    "Large Capacity Laundry Bag",
    "Printed Laundry Bag",
    "Rolling Laundry Bag",
    "Multi-Compartment Laundry Bag"
];

const colors = ["Navy Blue", "Charcoal Grey", "Off-White", "Sage Green", "Dusty Rose", "Black", "Beige"];

const initialProducts = [
    {
        name: "IKEA JÄLL Laundry Bag with Stand",
        slug: "ikea-jall-laundry-bag-with-stand",
        brand: "IKEA",
        description: "Lightweight and foldable laundry bag that can be carried to the washing machine. Holds up to 8 kg of laundry. Ideal for small spaces like hostel rooms.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Polyester",
        capacity: "70L",
        size: "Large",
        colors: ["White"],
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"],
        price: 299,
        originalPrice: 399,
        discount: "25% OFF",
        stock: 500,
        rating: 4.7,
        ratingsCount: 1250,
        highlights: ["Foldable design", "Lightweight steel stand", "Easy to clean", "Space-saving"],
        featured: true,
        trending: true,
        createdAt: new Date()
    },
    {
        name: "Home Puff Waterproof Foldable Laundry Basket",
        slug: "home-puff-waterproof-foldable-laundry-basket",
        brand: "Home Puff",
        description: "Premium waterproof laundry basket with aluminum handles. Double-layered 600D Oxford fabric with PE coating for moisture protection. Collapsible design for easy storage.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Oxford Fabric",
        capacity: "80L",
        size: "Extra Large",
        colors: ["Grey", "Black", "Blue"],
        image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80"],
        price: 799,
        originalPrice: 1299,
        discount: "38% OFF",
        stock: 120,
        rating: 4.8,
        ratingsCount: 850,
        highlights: ["Waterproof PE Coating", "Sturdy Aluminum Handles", "Collapsible Design", "Large 80L Capacity"],
        featured: true,
        trending: true,
        createdAt: new Date()
    },
    {
        name: "Solimo Mesh Laundry Bag for Delicates (Set of 3)",
        slug: "solimo-mesh-laundry-bag-set-3",
        brand: "Solimo",
        description: "Set of 3 mesh bags to protect your delicate clothes in the washing machine. Durable zipper with guard. Prevents tangling, snagging, and pilling.",
        category: "Home",
        subcategory: "Laundry",
        section: "Daily Use Essentials",
        material: "Mesh",
        capacity: "Small",
        size: "Small",
        colors: ["White"],
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"],
        price: 199,
        originalPrice: 299,
        discount: "33% OFF",
        stock: 300,
        rating: 4.5,
        ratingsCount: 2100,
        highlights: ["Set of 3 sizes", "High-quality mesh", "Auto-lock zipper", "Protects delicates"],
        featured: false,
        trending: false,
        createdAt: new Date()
    }
];

function generateLaundryBags(count) {
    const products = [];
    for (let i = 0; i < count; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const capacity = capacities[Math.floor(Math.random() * capacities.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const basePrice = capacity === "30L" ? 249 : capacity === "45L" ? 349 : capacity === "60L" ? 499 : capacity === "80L" ? 699 : 899;
        const price = basePrice + Math.floor(Math.random() * 300);
        const originalPrice = price + Math.floor(Math.random() * 500) + 100;
        const discountVal = Math.round(((originalPrice - price) / originalPrice) * 100);

        products.push({
            name: `${brand} ${type} - ${capacity}`,
            slug: `${brand.toLowerCase().replace(/ /g, '-')}-${type.toLowerCase().replace(/ /g, '-')}-${i}-${Math.floor(Math.random()*1000)}`,
            brand: brand,
            description: `High-quality ${type} by ${brand}. Featuring ${material} material with a ${capacity} capacity. This ${size} sized bag is designed for durability and ease of use in hostels and homes. ${color} color adds a touch of style to your laundry routine.`,
            category: "Home",
            subcategory: "Laundry",
            section: "Daily Use Essentials",
            material: material,
            capacity: capacity,
            size: size,
            colors: [color],
            image: `https://images.unsplash.com/photo-${1584622650111 + (i % 100)}-993a426fbf0a?auto=format&fit=crop&w=800&q=80`,
            images: [`https://images.unsplash.com/photo-${1584622650111 + (i % 100)}-993a426fbf0a?auto=format&fit=crop&w=800&q=80`],
            price: price,
            originalPrice: originalPrice,
            discount: `${discountVal}% OFF`,
            stock: 20 + Math.floor(Math.random() * 150),
            rating: 4.0 + (Math.random() * 0.9),
            ratingsCount: 10 + Math.floor(Math.random() * 1000),
            highlights: [`${capacity} Capacity`, `${material} Material`, "Foldable Design", "Sturdy Handles", "Durable Stitching"],
            featured: i % 5 === 0,
            trending: i % 4 === 0,
            createdAt: new Date()
        });
    }
    return products;
}

const allProducts = [...initialProducts, ...generateLaundryBags(30)];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // We clear products with "Laundry Bag" or "Laundry Basket" in name within Laundry subcategory
        // or just clear all Laundry products if that's preferred.
        // Given previous seeds, clearing by subcategory "Laundry" is common but we want to keep Hangers if they exist.
        // Actually, Hangers also have subcategory "Laundry". 
        // Let's delete only those with "Laundry Bag" or "Laundry Basket" or matching the new brands.
        const result = await Product.deleteMany({ 
            subcategory: "Laundry", 
            $or: [
                { name: /Laundry Bag/i },
                { name: /Laundry Basket/i },
                { name: /Laundry Mesh/i }
            ]
        });
        console.log(`🗑️ ${result.deletedCount} existing laundry bag products cleared.`);

        await Product.insertMany(allProducts);
        console.log(`🌱 ${allProducts.length} Laundry Bag products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
