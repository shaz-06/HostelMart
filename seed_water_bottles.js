const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    section: { type: String },
    material: { type: String },
    capacity: { type: String },
    colors: [String],
    images: [String],
    image: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: String },
    stock: { type: Number, default: 50 },
    rating: { type: Number, default: 4.5 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const brands = ["Milton", "Cello", "Borosil", "Signoraware", "Tupperware", "Pigeon"];
const materials = ["Stainless Steel", "BPA-Free Plastic", "Copper", "Borosilicate Glass", "Insulated Steel"];
const capacities = ["500ml", "750ml", "1L", "1.5L", "2L"];
const colorList = ["Midnight Blue", "Rose Gold", "Charcoal Grey", "Ocean Teal", "Matte Black", "Forest Green", "Silver", "Copper Metallic"];
const bottleTypes = [
    "Steel Water Bottle", "Insulated Flask", "Gym Shaker Bottle", "Copper Infusion Bottle", 
    "Borosilicate Glass Bottle", "Thermo Vacuum Flask", "Leakproof Sports Bottle", 
    "Kids Sipper Bottle", "Large Capacity Hydration Jug", "BPA-Free Plastic Bottle"
];

const generateWaterBottles = () => {
    const products = [];
    for (let i = 1; i <= 42; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const type = bottleTypes[Math.floor(Math.random() * bottleTypes.length)];
        const mat = materials[Math.floor(Math.random() * materials.length)];
        const cap = capacities[Math.floor(Math.random() * capacities.length)];
        const name = `${brand} ${type} - ${cap} (${mat})`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[()]/g, '') + '-' + i;
        
        const price = 299 + Math.floor(Math.random() * 1200);
        const originalPrice = Math.floor(price * (1.2 + Math.random() * 0.5));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const selectedColors = colorList.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        products.push({
            name,
            slug,
            brand,
            description: `Experience superior hydration with the ${name}. Crafted from premium ${mat}, this ${type} is designed for durability and style. Perfect for hostel life, gym sessions, or travel. Features a leakproof cap and ergonomic design. Capacity: ${cap}. Material: ${mat}.`,
            category: "Books",
            subcategory: "Hostel Needs",
            section: "Daily Use Essentials",
            material: mat,
            capacity: cap,
            colors: selectedColors,
            image: `https://images.unsplash.com/photo-1602143307185-8a4030a55239?q=80&w=800&auto=format&fit=crop`, // Generic bottle image
            images: [
                `https://images.unsplash.com/photo-1602143307185-8a4030a55239?q=80&w=800&auto=format&fit=crop`,
                `https://images.unsplash.com/photo-1523362628744-4c285810b665?q=80&w=800&auto=format&fit=crop`
            ],
            price,
            originalPrice,
            discount,
            stock: 20 + Math.floor(Math.random() * 80),
            rating: 4 + Math.random(),
            featured: i % 6 === 0,
            trending: i % 8 === 0,
            createdAt: new Date()
        });
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Clear existing water bottles in this subcategory to avoid duplicates
        const deleted = await Product.deleteMany({ subcategory: "Hostel Needs" });
        console.log(`🗑️ ${deleted.deletedCount} existing water bottle products cleared.`);

        const bottles = generateWaterBottles();
        await Product.insertMany(bottles);
        console.log(`🌱 ${bottles.length} Water Bottle products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
