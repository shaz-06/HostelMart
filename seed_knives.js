const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const knifeProducts = [];

const brands = ["Pigeon", "Prestige", "Solimo", "Victorinox", "Borosil", "Home Puff", "Cello", "Butterfly"];
const types = [
    "Chef Knives", "Utility Knives", "Paring Knives", "Bread Knives", 
    "Fruit Knives", "Vegetable Choppers", "Stainless Steel Knives", 
    "Knife Sets", "Folding Kitchen Knives", "Multipurpose Kitchen Cutters"
];
const bladeMaterials = ["Stainless Steel", "High-Carbon Stainless Steel", "Ceramic", "Titanium Coated Steel", "Forged Steel"];
const handleMaterials = ["Ergonomic Plastic", "Wooden (Rosewood)", "Stainless Steel", "Soft-Grip Rubber", "ABS Polymer"];
const bladeLengths = ["3 inch", "4 inch", "5 inch", "6 inch", "7 inch", "8 inch", "Set of 3", "Set of 6"];
const colors = ["Silver", "Black", "Red", "Blue", "Green", "White"];

const knifeImages = [
    "https://images.unsplash.com/photo-1593611664162-dd06cc57b3d7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1614362985822-e7286245458e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520981757710-356b3a327451?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544965850-6f8a66788f9b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1605881528191-68f38c78e3d3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1599672660122-3083e404092b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592090407040-302377484d23?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=800&q=80"
];

for (let i = 1; i <= 35; i++) {
    const brand = brands[i % brands.length];
    const type = types[i % types.length];
    const bladeMaterial = bladeMaterials[i % bladeMaterials.length];
    const handleMaterial = handleMaterials[i % handleMaterials.length];
    const bladeLength = bladeLengths[i % bladeLengths.length];
    const color = colors[i % colors.length];
    
    const price = 199 + Math.floor(Math.random() * 2500);
    const originalPrice = price + Math.floor(Math.random() * 800);
    const discount = Math.floor(((originalPrice - price) / originalPrice) * 100) + "% OFF";

    knifeProducts.push({
        name: `${brand} ${type} - ${bladeLength}`,
        slug: `${brand.toLowerCase()}-${type.toLowerCase().replace(/ /g, '-')}-${bladeLength.toLowerCase().replace(/ /g, '-')}-${i}`,
        brand: brand,
        description: `Premium ${type} from ${brand}. Features a high-quality ${bladeMaterial} blade and ${handleMaterial} handle for maximum comfort and precision. Perfect for daily kitchen use, this ${bladeLength} knife is a must-have for every hostel student.`,
        category: "Home",
        subcategory: "Kitchen & Appliances",
        section: "Daily Use Essentials",
        type: type,
        bladeMaterial: bladeMaterial,
        handleMaterial: handleMaterial,
        bladeLength: bladeLength,
        colors: [color],
        image: knifeImages[i % knifeImages.length],
        images: [
            knifeImages[(i + 1) % knifeImages.length],
            knifeImages[(i + 2) % knifeImages.length]
        ],
        price: price,
        originalPrice: originalPrice,
        discount: discount,
        stock: 50 + Math.floor(Math.random() * 100),
        rating: 4.0 + (Math.random() * 1.0),
        featured: i % 5 === 0,
        trending: i % 7 === 0,
        highlights: [
            "Ultra-sharp edge for precision cutting",
            "Ergonomic handle for comfortable grip",
            "Rust-resistant material for long-lasting use",
            "Lightweight and easy to handle",
            "Dishwasher safe"
        ],
        createdAt: new Date()
    });
}

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Clear existing knife products to avoid duplicates if re-running
        // Using types to identify knife products
        await Product.deleteMany({ subcategory: "Kitchen & Appliances", type: { $in: types } });

        await Product.insertMany(knifeProducts);
        console.log(`🌱 ${knifeProducts.length} Kitchen Knife products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
