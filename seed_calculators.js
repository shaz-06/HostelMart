const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const Product = require('./models/Product');

const brands = ["Casio", "Canon", "Texas Instruments", "Orpat", "Citizen", "Sharp"];
const types = [
    "Scientific Calculator", "Basic Calculator", "Financial Calculator", 
    "Graphing Calculator", "Student Calculator", "Pocket Calculator", 
    "Desktop Calculator", "Solar Calculator", "Engineering Calculator", 
    "Exam Approved Calculator"
];
const displayTypes = ["LCD", "Natural V.P.A.M", "Large Desktop Display", "High Resolution LCD", "Dual Line Display"];
const powerSources = ["Solar & Battery", "Battery Powered", "Solar Powered", "Dual Power"];
const functionsList = ["100+ Functions", "252 Functions", "417 Functions", "552 Functions", "Over 1000 Functions", "Basic 12-Digits"];

const calcImages = [
    "https://images.unsplash.com/photo-1574607383476-f517f260d30b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611079830811-865ff4428d17?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543285198-3af15c4592ce?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=800&auto=format&fit=crop"
];

const generateCalculators = () => {
    const products = [];
    for (let i = 1; i <= 30; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const display = displayTypes[Math.floor(Math.random() * displayTypes.length)];
        const power = powerSources[Math.floor(Math.random() * powerSources.length)];
        const functions = functionsList[Math.floor(Math.random() * functionsList.length)];
        
        const name = `${brand} ${type} - ${functions}`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[+]/g, 'plus') + '-' + i + '-' + Math.random().toString(36).substring(7);
        
        const basePrice = type.includes("Graphing") ? 8000 : type.includes("Scientific") ? 1200 : 300;
        const price = Math.round(basePrice + Math.random() * 500);
        const originalPrice = Math.floor(price * (1.1 + Math.random() * 0.3));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const mainImage = calcImages[Math.floor(Math.random() * calcImages.length)];
        
        products.push({
            name,
            slug,
            brand,
            description: `Precision and reliability come together in the ${name} by ${brand}. Perfect for students and professionals alike, this ${type} features a ${display} and is powered via ${power}. With ${functions}, it handles everything from basic arithmetic to complex engineering equations effortlessly.`,
            category: "Books",
            subcategory: "Study Essentials",
            section: "Student Essentials",
            type,
            displayType: display,
            powerSource: power,
            functions: functions,
            colors: ["Silver", "Black", "Navy Blue"],
            image: mainImage,
            images: [mainImage, calcImages[(calcImages.indexOf(mainImage) + 1) % calcImages.length]],
            price,
            originalPrice,
            discount,
            stock: 30 + Math.floor(Math.random() * 100),
            rating: 4.2 + (Math.random() * 0.8),
            ratingsCount: 100 + Math.floor(Math.random() * 2000),
            featured: i <= 6,
            trending: i % 5 === 0,
            highlights: [
                `${display} for clear reading`,
                `${power} ensures continuous use`,
                `${functions} for versatile utility`,
                `High-quality keys and build`,
                `1-Year Manufacturer Warranty`
            ],
            specifications: {
                "Display": display,
                "Power Source": power,
                "Total Functions": functions,
                "Type": type,
                "Digits": "12-Digits / Multi-line"
            },
            createdAt: new Date()
        });
    }
    return products;
};

async function seedDB() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const deleted = await Product.deleteMany({ 
            subcategory: "Study Essentials", 
            $or: [
                { name: /Calculator/i },
                { type: /Calculator/i }
            ]
        });
        console.log(`🗑️ ${deleted.deletedCount} existing calculator products cleared.`);

        const calculators = generateCalculators();
        await Product.insertMany(calculators);
        console.log(`🌱 ${calculators.length} Calculator products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
