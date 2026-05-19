const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const inductionProducts = [];

const brands = ["Prestige", "Pigeon", "Philips", "Havells", "Butterfly", "Bajaj", "Usha", "Lifelong"];
const types = [
    "Single Burner Induction Stoves", "Touch Control Induction Cooktops", 
    "Portable Induction Stoves", "Energy Efficient Induction Stoves", 
    "Digital Display Induction Cooktops", "Smart Induction Cookers", 
    "Compact Hostel Induction Stoves", "Multi-Mode Induction Cooktops", 
    "Auto Shut-Off Induction Stoves", "High Power Induction Stoves"
];

const powerConsumptions = ["1200W", "1400W", "1600W", "1800W", "2000W", "2100W"];
const controlTypes = ["Push Button", "Soft Touch", "Feather Touch", "Digital Controls", "Smart Touch"];
const presetModesOptions = [
    ["Pressure Cook", "Curry", "Deep Fry", "Keep Warm"],
    ["Dosa/Idli", "Milk/Tea", "Sauté", "Manual"],
    ["Roti/Chati", "Boil", "Soup", "Warm"],
    ["Indian Menu", "Auto Timer", "Custom Temp"]
];

for (let i = 1; i <= 28; i++) {
    const brand = brands[i % brands.length];
    const type = types[i % types.length];
    const power = powerConsumptions[i % powerConsumptions.length];
    const control = controlTypes[i % controlTypes.length];
    const presets = presetModesOptions[i % presetModesOptions.length];
    const price = 1500 + Math.floor(Math.random() * 4500);
    const originalPrice = price + Math.floor(Math.random() * 1500);
    const discount = Math.floor(((originalPrice - price) / originalPrice) * 100) + "% OFF";

    inductionProducts.push({
        name: `${brand} ${type} - ${power}`,
        slug: `${brand.toLowerCase()}-${type.toLowerCase().replace(/ /g, '-')}-${i}`,
        brand: brand,
        description: `Premium ${type} from ${brand}. Features ${power} power for efficient cooking. Equipped with ${control} for easy operation and ${presets.length} preset modes. Ideal for hostel rooms and compact kitchens. Includes auto shut-off for safety.`,
        category: "Home",
        subcategory: "Kitchen & Appliances",
        section: "Daily Use Essentials",
        type: type,
        powerConsumption: power,
        controlType: control,
        presetModes: presets,
        warranty: "1 Year Standard Warranty",
        colors: ["Black", "Silver", "Glass Finish"].slice(0, 1 + Math.floor(Math.random() * 2)),
        image: `https://images.unsplash.com/photo-${1556910103 + i}-1c02745a3a80?auto=format&fit=crop&w=800&q=80`,
        price: price,
        originalPrice: originalPrice,
        discount: discount,
        stock: 15 + Math.floor(Math.random() * 60),
        rating: 4.0 + (Math.random() * 0.9),
        featured: Math.random() > 0.8,
        trending: Math.random() > 0.7,
        createdAt: new Date()
    });
}

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Clear existing induction stoves to avoid duplicates
        await Product.deleteMany({ subcategory: "Kitchen & Appliances", type: { $in: types } });

        await Product.insertMany(inductionProducts);
        console.log(`🌱 ${inductionProducts.length} Induction Stove products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
