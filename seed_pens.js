const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const Product = require('./models/Product');

const brands = ["Reynolds", "Cello", "Classmate", "Parker", "Flair", "Pentonic", "Hauser", "Linc"];
const types = [
    "Ball Pen", "Gel Pen", "Roller Pen", "Fountain Pen", "Click Pen", 
    "Ink Pen", "Exam Pen", "Multicolor Pen", "Premium Pen", "Refillable Pen"
];
const inkColors = ["Blue", "Black", "Red", "Green", "Multicolor"];
const packSizes = ["Pack of 1", "Pack of 2", "Pack of 5", "Pack of 10", "Set of 20"];
const tipSizes = ["0.5mm", "0.6mm", "0.7mm", "1.0mm"];

const penImages = [
    "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585336139118-b31b32d2077f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511108690759-009324a903df?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1562229125-6d6075419a22?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511871893393-82e9c18b70e3?q=80&w=800&auto=format&fit=crop"
];

const generatePens = () => {
    const products = [];
    for (let i = 1; i <= 55; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const ink = inkColors[Math.floor(Math.random() * inkColors.length)];
        const pack = packSizes[Math.floor(Math.random() * packSizes.length)];
        const tip = tipSizes[Math.floor(Math.random() * tipSizes.length)];
        
        const name = `${brand} ${type} - ${ink} (${pack})`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[()]/g, '') + '-' + i + '-' + Math.random().toString(36).substring(7);
        
        const basePrice = type.includes("Premium") ? 450 : type.includes("Fountain") ? 250 : 20;
        const packMultiplier = pack.includes("20") ? 15 : pack.includes("10") ? 8 : pack.includes("5") ? 4 : pack.includes("2") ? 1.8 : 1;
        
        const price = Math.round((basePrice * packMultiplier) + Math.random() * 50);
        const originalPrice = Math.floor(price * (1.2 + Math.random() * 0.4));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const mainImage = penImages[Math.floor(Math.random() * penImages.length)];
        
        products.push({
            name,
            slug,
            brand,
            description: `Experience smooth writing with the ${name} by ${brand}. This ${type} features a ${tip} tip for precision and a comfortable grip for long study sessions. The ${ink} ink is smudge-proof and water-resistant, making it perfect for exams and note-taking.`,
            category: "Books",
            subcategory: "Study Essentials",
            section: "Student Essentials",
            type,
            inkColor: ink,
            tipSize: tip,
            packSize: pack,
            colors: [ink],
            image: mainImage,
            images: [mainImage, penImages[(penImages.indexOf(mainImage) + 1) % penImages.length]],
            price,
            originalPrice,
            discount,
            stock: 100 + Math.floor(Math.random() * 400),
            rating: 4.0 + (Math.random() * 1.0),
            ratingsCount: 50 + Math.floor(Math.random() * 1000),
            featured: i <= 10, // First 10 are featured
            trending: i % 8 === 0,
            highlights: [
                `${tip} precision tip`,
                `Smudge-proof ${ink} ink`,
                `Comfortable ergonomic grip`,
                `Ideal for ${type === 'Exam Pen' ? 'board exams' : 'daily note-taking'}`,
                `${pack} value set`
            ],
            specifications: {
                "Ink Color": ink,
                "Tip Size": tip,
                "Pack Size": pack,
                "Type": type,
                "Refillable": type.includes("Refillable") || type.includes("Fountain") ? "Yes" : "No"
            },
            createdAt: new Date()
        });
    }
    return products;
};

async function seedDB() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostelmart');
        console.log("✅ MongoDB Connected Successfully");

        // Clear existing pens in this subcategory to avoid duplicates
        // We look for products that have 'Pen' in their name or type field
        const deleted = await Product.deleteMany({ 
            subcategory: "Study Essentials", 
            $or: [
                { name: /Pen/i },
                { type: /Pen/i }
            ]
        });
        console.log(`🗑️ ${deleted.deletedCount} existing pen products cleared.`);

        const pens = generatePens();
        await Product.insertMany(pens);
        console.log(`🌱 ${pens.length} Pen products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
