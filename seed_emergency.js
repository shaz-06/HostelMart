const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Dettol", "Volini", "Crocin", "Vicks", "Savlon", "Whisper", "Stayfree", "Philips", "Ambrane", "Himalaya"];

const emergencyTypes = [
    { type: "Basic Medicines", usage: "Pain/Fever Relief", brands: ["Crocin", "Vicks", "Himalaya"], quantity: "10 Tablets" },
    { type: "First Aid Kits", usage: "Wound Care", brands: ["Dettol", "Savlon"], quantity: "1 Kit" },
    { type: "Bandages", usage: "Injury Protection", brands: ["Dettol", "Savlon"], quantity: "Pack of 10" },
    { type: "Pain Relief Sprays", usage: "Muscle Pain", brands: ["Volini", "Himalaya"], quantity: "60g" },
    { type: "Thermometers", usage: "Fever Check", brands: ["Philips", "Himalaya"], quantity: "1 Unit" },
    { type: "Face Masks", usage: "Protection", brands: ["Dettol", "Savlon"], quantity: "Pack of 5" },
    { type: "Sanitizers", usage: "Hygiene", brands: ["Dettol", "Savlon", "Himalaya"], quantity: "100ml" },
    { type: "ORS Drinks", usage: "Dehydration", brands: ["Crocin", "Himalaya"], quantity: "200ml" },
    { type: "Instant Energy Drinks", usage: "Fatigue", brands: ["Ambrane", "Dettol"], quantity: "250ml" },
    { type: "Flashlights", usage: "Emergency Light", brands: ["Philips", "Ambrane"], quantity: "1 Unit" },
    { type: "Emergency Chargers", usage: "Power Backup", brands: ["Ambrane", "Philips"], quantity: "10000mAh" },
    { type: "Raincoats", usage: "Weather Protection", brands: ["Himalaya", "Ambrane"], quantity: "1 Unit" },
    { type: "Umbrellas", usage: "Weather Protection", brands: ["Philips", "Ambrane"], quantity: "1 Unit" },
    { type: "Hot Water Bags", usage: "Pain Relief", brands: ["Himalaya", "Philips"], quantity: "1 Unit" },
    { type: "Emergency Toiletries", usage: "Personal Hygiene", brands: ["Whisper", "Stayfree", "Himalaya"], quantity: "Pack of 8" }
];

const emergencyImages = [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop", // Pills
    "https://images.unsplash.com/photo-1603398938378-e54eab446ddd?q=80&w=800&auto=format&fit=crop", // First aid
    "https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=800&auto=format&fit=crop", // Mask
    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800&auto=format&fit=crop"  // Sanitizer
];

const generateEmergency = () => {
    const products = [];
    for (let i = 1; i <= 65; i++) {
        const typeData = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
        const brand = typeData.brands[Math.floor(Math.random() * typeData.brands.length)];
        
        const name = `${brand} ${typeData.type} - ${typeData.usage}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const basePrice = typeData.type.includes("Charger") ? 899 : typeData.type.includes("Flashlight") ? 299 : 45;
        const price = basePrice + Math.floor(Math.random() * 50);
        const originalPrice = Math.floor(price * 1.3);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 2);

        products.push({
            name,
            slug,
            brand,
            description: `Essential ${typeData.type} from ${brand}. Designed for ${typeData.usage} during emergencies or daily hostel needs. This reliable product is a must-have in your first-aid kit or emergency drawer.`,
            category: "Emergency",
            subcategory: "Emergency Essentials",
            section: "Emergency Needs",
            type: typeData.type,
            usage: typeData.usage,
            quantity: typeData.quantity,
            expiryDate: expiry.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            image: emergencyImages[Math.floor(Math.random() * emergencyImages.length)],
            images: [emergencyImages[Math.floor(Math.random() * emergencyImages.length)], emergencyImages[0]],
            price,
            originalPrice,
            discount,
            stock: 50 + Math.floor(Math.random() * 200),
            rating: 4.5 + (Math.random() * 0.5),
            ratingsCount: 100 + Math.floor(Math.random() * 2000),
            featured: i % 10 === 0,
            trending: i % 8 === 0,
            highlights: [
                "Trusted by Professionals",
                "High Quality Standards",
                "Long Expiry Life",
                "Easy to Use",
                "Essential Hostel Gear"
            ],
            specifications: {
                "Package Quantity": typeData.quantity,
                "Recommended Usage": typeData.usage,
                "Brand": brand,
                "Shelf Life": "24 Months",
                "Safety Standard": "ISO Certified"
            },
            createdAt: new Date()
        });
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const deleted = await Product.deleteMany({ category: "Emergency" });
        console.log(`🗑️ ${deleted.deletedCount} existing emergency products cleared.`);

        const emergency = generateEmergency();
        await Product.insertMany(emergency);
        console.log(`🌱 ${emergency.length} Emergency products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
