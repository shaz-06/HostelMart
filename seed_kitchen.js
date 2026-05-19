const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const kitchenProducts = [
    {
        name: "Prestige Electric Kettle PKOSS 1.5L",
        slug: "prestige-electric-kettle-pkoss-1-5l",
        brand: "Prestige",
        description: "Prepare hot water, instant tea etc., in a matter of minutes with Prestige electric kettles. With smart features like automatic cut-off, single touch lid locking, beautifully designed ergonomic handle, elegant body etc.",
        category: "Home",
        subcategory: "Kitchen & Appliances",
        section: "Daily Use Essentials",
        type: "Electric Kettles",
        material: "Stainless Steel",
        capacity: "1.5L",
        powerUsage: "1500W",
        colors: ["Silver", "Black"],
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80",
        price: 749,
        originalPrice: 1195,
        discount: "37% OFF",
        stock: 150,
        rating: 4.4,
        featured: true,
        trending: true,
        createdAt: new Date()
    },
    {
        name: "Philips Daily Collection HD4928/01 Induction Cooktop",
        slug: "philips-induction-cooktop-hd4928-01",
        brand: "Philips",
        description: "Electromagnetic induction technology ensures high heating efficiency, cooks food faster than a gas stove. Seals nutrition into the food and prevents vitamin loss.",
        category: "Home",
        subcategory: "Kitchen & Appliances",
        section: "Daily Use Essentials",
        type: "Induction Stoves",
        material: "Glass",
        capacity: "N/A",
        powerUsage: "2100W",
        colors: ["Black"],
        image: "https://images.unsplash.com/photo-1574007557239-acd6873bc24a?auto=format&fit=crop&w=800&q=80",
        price: 2899,
        originalPrice: 3995,
        discount: "27% OFF",
        stock: 80,
        rating: 4.5,
        featured: true,
        trending: false,
        createdAt: new Date()
    },
    {
        name: "Milton New Executive Lunch Box",
        slug: "milton-new-executive-lunch-box",
        brand: "Milton",
        description: "Insulated lunch box with 3 stainless steel containers. Keeps food hot for hours. Ideal for office and hostel students.",
        category: "Home",
        subcategory: "Kitchen & Appliances",
        section: "Daily Use Essentials",
        type: "Lunch Boxes",
        material: "Stainless Steel",
        capacity: "3 Containers",
        powerUsage: "N/A",
        colors: ["Blue", "Red", "Black"],
        image: "https://images.unsplash.com/photo-1590424744299-f23858079549?auto=format&fit=crop&w=800&q=80",
        price: 549,
        originalPrice: 720,
        discount: "24% OFF",
        stock: 200,
        rating: 4.3,
        featured: false,
        trending: true,
        createdAt: new Date()
    },
    {
        name: "Borosil Klip-N-Store Glass Storage Container Set",
        slug: "borosil-glass-storage-container-set",
        brand: "Borosil",
        description: "100% Borosilicate glass, microwave safe, oven safe, dishwasher safe. Airtight and leak-proof lids.",
        category: "Home",
        subcategory: "Kitchen & Appliances",
        section: "Daily Use Essentials",
        type: "Storage Containers",
        material: "Glass",
        capacity: "400ml x 3",
        powerUsage: "N/A",
        colors: ["Clear"],
        image: "https://images.unsplash.com/photo-1584263347416-85a696b4eda7?auto=format&fit=crop&w=800&q=80",
        price: 899,
        originalPrice: 1250,
        discount: "28% OFF",
        stock: 120,
        rating: 4.7,
        featured: true,
        trending: false,
        createdAt: new Date()
    },
    {
        name: "Pigeon Handy Vegetable Chopper",
        slug: "pigeon-handy-vegetable-chopper",
        brand: "Pigeon",
        description: "Unique string function to chop vegetables and fruits with ease. Sturdy 3-blade design made from Stainless Steel.",
        category: "Home",
        subcategory: "Kitchen & Appliances",
        section: "Daily Use Essentials",
        type: "Choppers",
        material: "Plastic",
        capacity: "350ml",
        powerUsage: "Manual",
        colors: ["Green", "White"],
        image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80",
        price: 249,
        originalPrice: 495,
        discount: "50% OFF",
        stock: 500,
        rating: 4.2,
        featured: false,
        trending: true,
        createdAt: new Date()
    }
];

const brands = ["Prestige", "Pigeon", "Milton", "Cello", "Borosil", "Philips", "Butterfly", "Hawkins", "Solimo", "Home Puff"];
const types = [
    "Electric Kettles", "Induction Stoves", "Water Boilers", "Lunch Boxes", 
    "Storage Containers", "Choppers", "Cutting Boards", "Steel Plates", 
    "Spoons & Fork Sets", "Mini Rice Cookers", "Coffee Mugs", "Water Jugs", 
    "Portable Blenders", "Dish Drying Racks", "Kitchen Tool Sets"
];
const materials = ["Stainless Steel", "Plastic", "Wood", "Glass", "Ceramic", "Aluminium"];
const capacities = ["500ml", "1L", "1.5L", "2L", "500g", "1kg", "Set of 6", "Set of 12"];

// Generate 45 more products
for (let i = 6; i <= 55; i++) {
    const type = types[i % types.length];
    const brand = brands[i % brands.length];
    const material = materials[i % materials.length];
    const capacity = capacities[i % capacities.length];
    const price = 100 + Math.floor(Math.random() * 2000);
    const originalPrice = price + Math.floor(Math.random() * 500);
    const discount = Math.floor(((originalPrice - price) / originalPrice) * 100) + "% OFF";

    kitchenProducts.push({
        name: `${brand} ${type} - ${material} Series`,
        slug: `${brand.toLowerCase()}-${type.toLowerCase().replace(/ /g, '-')}-${material.toLowerCase()}-${i}`,
        brand: brand,
        description: `High-quality ${type} from ${brand}. Made of durable ${material}. Perfect for daily kitchen use in your hostel or home. Easy to clean and maintain.`,
        category: "Home",
        subcategory: "Kitchen & Appliances",
        section: "Daily Use Essentials",
        type: type,
        material: material,
        capacity: capacity,
        powerUsage: type.includes("Electric") || type.includes("Induction") || type.includes("Blender") ? "500W-1500W" : "N/A",
        colors: ["Silver", "Black", "Red", "White", "Blue"].slice(0, 1 + Math.floor(Math.random() * 3)),
        image: `https://images.unsplash.com/photo-${1594212699903 + i}-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80`,
        price: price,
        originalPrice: originalPrice,
        discount: discount,
        stock: 50 + Math.floor(Math.random() * 200),
        rating: 3.5 + (Math.random() * 1.5),
        featured: Math.random() > 0.8,
        trending: Math.random() > 0.7,
        createdAt: new Date()
    });
}

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Clear existing kitchen products
        const result = await Product.deleteMany({ subcategory: "Kitchen & Appliances" });
        console.log(`🗑️ ${result.deletedCount} existing kitchen products cleared.`);

        await Product.insertMany(kitchenProducts);
        console.log(`🌱 ${kitchenProducts.length} Kitchen Essential products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
