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
    type: { type: String },
    pageCount: { type: String },
    size: { type: String },
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

const brands = ["Classmate", "Navneet", "Camlin", "Doms", "Paperkraft", "Sundaram"];
const types = ["Ruled Notebook", "Unruled Notebook", "Spiral Notebook", "Hardcover Notebook", "Softcover Notebook", "Subject Notebook", "Pocket Notebook", "Premium Journal", "Graph Notebook", "Practical Record"];
const pageCounts = ["120 Pages", "160 Pages", "200 Pages", "300 Pages", "400 Pages"];
const sizes = ["A4", "A5", "B5", "Executive", "Pocket"];
const colorList = ["Midnight Blue", "Forest Green", "Royal Black", "Vibrant Orange", "Sunset Yellow", "Pastel Pink", "Tan Brown"];

const generateNotebooks = () => {
    const products = [];
    for (let i = 1; i <= 42; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const pc = pageCounts[Math.floor(Math.random() * pageCounts.length)];
        const sz = sizes[Math.floor(Math.random() * sizes.length)];
        const name = `${brand} ${type} - ${pc} (${sz})`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[()]/g, '') + '-' + i;
        
        const basePrice = type.includes("Premium") ? 350 : type.includes("Hardcover") ? 200 : 60;
        const price = basePrice + Math.floor(Math.random() * 200);
        const originalPrice = Math.floor(price * (1.15 + Math.random() * 0.3));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const selectedColors = colorList.sort(() => 0.5 - Math.random()).slice(0, 2);
        
        products.push({
            name,
            slug,
            brand,
            description: `High-quality ${name} by ${brand}. Featuring premium GSM paper for a smooth writing experience, this ${type} is perfect for college notes, journaling, or office work. Includes a durable cover and secure binding. Size: ${sz}. Pages: ${pc}.`,
            category: "Books",
            subcategory: "Study Essentials",
            section: "Student Essentials",
            type,
            pageCount: pc,
            size: sz,
            colors: selectedColors,
            image: `https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop`, // Generic notebook image
            images: [
                `https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop`,
                `https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop`
            ],
            price,
            originalPrice,
            discount,
            stock: 50 + Math.floor(Math.random() * 150),
            rating: 4.3 + (Math.random() * 0.7),
            featured: i % 7 === 0,
            trending: i % 9 === 0,
            createdAt: new Date()
        });
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Clear existing notebooks in this subcategory + category
        const deleted = await Product.deleteMany({ subcategory: "Study Essentials", category: "Books" });
        console.log(`🗑️ ${deleted.deletedCount} existing notebook products cleared.`);

        const notebooks = generateNotebooks();
        await Product.insertMany(notebooks);
        console.log(`🌱 ${notebooks.length} Notebook products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
