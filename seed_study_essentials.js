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
    material: { type: String },
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

const brands = ["Classmate", "Camlin", "Faber-Castell", "Casio", "Doms", "Navneet", "Kangaro", "HP", "Portronics"];
const types = [
    "Notebook", "Ball Pen", "Gel Pen", "Highlighter Set", "Sticky Notes", 
    "Scientific Calculator", "Desk Lamp", "Pencil Box", "Geometry Box", 
    "Whiteboard", "Study Timer", "File Folder", "Executive Diary", 
    "Whiteboard Marker", "Laptop Stand"
];
const materials = ["Paper", "Plastic", "Metal", "Aluminum", "LED", "Ink", "Recycled Paper"];
const colorList = ["Classic Black", "Professional Blue", "Vibrant Red", "Neon Yellow", "Pastel Green", "Sleek Silver", "Rose Gold"];

const generateStudyEssentials = () => {
    const products = [];
    for (let i = 1; i <= 65; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const mat = materials[Math.floor(Math.random() * materials.length)];
        const name = `${brand} ${type} - ${i % 2 === 0 ? 'Premium Edition' : 'Classic Series'}`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[&]/g, 'and') + '-' + i;
        
        const basePrice = type.includes("Calculator") ? 800 : type.includes("Lamp") || type.includes("Stand") ? 600 : 50;
        const price = basePrice + Math.floor(Math.random() * 500);
        const originalPrice = Math.floor(price * (1.2 + Math.random() * 0.4));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const selectedColors = colorList.sort(() => 0.5 - Math.random()).slice(0, 2);
        
        products.push({
            name,
            slug,
            brand,
            description: `Boost your productivity with the ${name}. A must-have for every student, this ${type} by ${brand} combines functionality with superior quality. Made from ${mat}, it's designed to withstand heavy daily use. Ideal for college, school, or home office setup.`,
            category: "Hostel & Student Essentials",
            subcategory: "Study Essentials",
            section: "Student Essentials",
            type: type,
            material: mat,
            colors: selectedColors,
            image: `https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=800&auto=format&fit=crop`, // Generic study image
            images: [
                `https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=800&auto=format&fit=crop`,
                `https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop`
            ],
            price,
            originalPrice,
            discount,
            stock: 30 + Math.floor(Math.random() * 120),
            rating: 4.2 + (Math.random() * 0.8),
            featured: i % 8 === 0,
            trending: i % 10 === 0,
            createdAt: new Date()
        });
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const deleted = await Product.deleteMany({ subcategory: "Study Essentials" });
        console.log(`🗑️ ${deleted.deletedCount} existing study essential products cleared.`);

        const essentials = generateStudyEssentials();
        await Product.insertMany(essentials);
        console.log(`🌱 ${essentials.length} Study Essential products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
