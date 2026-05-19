const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["boAt", "JBL", "Sony", "OnePlus", "Realme", "Noise", "Apple", "Samsung", "Oppo", "Nothing"];

const earbudTypes = [
    { type: "Wireless Earbuds", description: "Experience true freedom with these high-fidelity wireless earbuds." },
    { type: "Gaming Earbuds", description: "Ultra-low latency gaming earbuds with 3D spatial audio for a competitive edge." },
    { type: "Noise Cancelling Earbuds", description: "Advanced Active Noise Cancellation (ANC) to block out the world and focus on your music." },
    { type: "Bluetooth Earbuds", description: "Seamless connectivity and long-lasting battery for everyday use." },
    { type: "Sports Earbuds", description: "Secure-fit, sweat-proof earbuds designed for your most intense workouts." },
    { type: "TWS Earbuds", description: "True Wireless Stereo (TWS) technology for a balanced and immersive soundstage." },
    { type: "Premium Earbuds", description: "Audiophile-grade sound quality with premium materials and exquisite design." },
    { type: "Budget Earbuds", description: "Great sound at an unbeatable price. Perfect for students on the go." },
    { type: "Waterproof Earbuds", description: "IPX7 rated waterproof earbuds, perfect for swimming or rainy days." },
    { type: "Low Latency Earbuds", description: "Perfectly synced audio and video for an immersive movie and gaming experience." }
];

const connectivities = ["Bluetooth 5.3", "Bluetooth 5.2", "Bluetooth 5.0", "True Wireless"];
const batteryLives = ["20 Hours", "30 Hours", "40 Hours", "50 Hours", "60 Hours", "8 Hours (Single Charge)"];
const noiseCancellations = ["Active Noise Cancellation (ANC)", "Environmental Noise Cancellation (ENC)", "Hybrid ANC", "Passive Noise Isolation"];
const waterResistances = ["IPX4", "IPX5", "IPX7", "IP55", "Sweatproof"];
const colorList = ["Midnight Black", "Arctic White", "Ocean Blue", "Graphite Grey", "Crimson Red", "Forest Green"];

const earbudsImages = [
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop", // Black earbuds
    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=800&auto=format&fit=crop", // White earbuds
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=800&auto=format&fit=crop", // Blue earbuds
    "https://images.unsplash.com/photo-1598331668826-20cecc596b86?q=80&w=800&auto=format&fit=crop", // Close up
    "https://images.unsplash.com/photo-1627989330241-4e33024092ee?q=80&w=800&auto=format&fit=crop", // In case
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop", // High end
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", // Lifestyle
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop"  // Professional
];

const generateEarbuds = () => {
    const products = [];
    for (let i = 1; i <= 45; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const typeObj = earbudTypes[Math.floor(Math.random() * earbudTypes.length)];
        const type = typeObj.type;
        
        const models = ["Air", "Pro", "Neo", "Elite", "Prime", "Wave", "Flow", "Max", "Sonic", "Buds"];
        const modelName = models[Math.floor(Math.random() * models.length)] + " " + (i + 100);
        const name = `${brand} ${modelName} ${type}`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[&]/g, 'and') + '-' + i;
        
        let basePrice = 1200;
        if (brand === "Apple") basePrice = 18000;
        else if (brand === "Sony" || brand === "Samsung") basePrice = 8000;
        else if (brand === "Nothing") basePrice = 5000;
        else if (brand === "JBL") basePrice = 3500;
        
        if (type.includes("Premium")) basePrice *= 1.5;
        if (type.includes("Noise Cancelling")) basePrice *= 1.3;
        if (type.includes("Budget")) basePrice *= 0.6;

        const price = Math.floor(basePrice + Math.random() * (basePrice * 0.4));
        const originalPrice = Math.floor(price * (1.2 + Math.random() * 0.4));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const selectedColors = colorList.sort(() => 0.5 - Math.random()).slice(0, 2);
        const image = earbudsImages[Math.floor(Math.random() * earbudsImages.length)];
        
        const batteryLife = batteryLives[Math.floor(Math.random() * batteryLives.length)];
        const noiseCancellation = noiseCancellations[Math.floor(Math.random() * noiseCancellations.length)];
        const waterResistance = waterResistances[Math.floor(Math.random() * waterResistances.length)];
        const connectivity = connectivities[Math.floor(Math.random() * connectivities.length)];

        products.push({
            name,
            slug,
            brand,
            description: `${typeObj.description} The ${name} features ${noiseCancellation}, ${batteryLife} of total playback, and ${waterResistance} rating. Designed by ${brand} for the modern listener who demands quality and style.`,
            category: "Electronics & Tech",
            subcategory: "Audio",
            section: "Electronics",
            type,
            connectivity,
            batteryLife,
            noiseCancellation,
            waterResistance,
            battery: batteryLife, // Keeping sync with existing field if any
            colors: selectedColors,
            image: image,
            images: [image, earbudsImages[(Math.floor(Math.random() * earbudsImages.length))]],
            price,
            originalPrice,
            discount,
            stock: 20 + Math.floor(Math.random() * 150),
            rating: 4.0 + (Math.random() * 1.0),
            ratingsCount: 50 + Math.floor(Math.random() * 5000),
            featured: i % 10 === 0,
            trending: i % 7 === 0,
            highlights: [
                `${noiseCancellation} Technology`,
                `Up to ${batteryLife} Battery Life`,
                `${waterResistance} Water Resistance`,
                `${connectivity} Connectivity`,
                "Touch Controls & Voice Assistant Support"
            ],
            specifications: {
                "Model Number": `HM-EB-${i}`,
                "Driver Size": "10mm Dynamic Drivers",
                "Charging Port": "Type-C Fast Charging",
                "Charging Time": "1.5 Hours",
                "Bluetooth Range": "10 Meters",
                "Weight": "4.5g per earbud"
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

        // We only clear existing "Audio" subcategory products to avoid losing other electronics
        const deleted = await Product.deleteMany({ subcategory: "Audio", type: { $regex: /Earbuds/i } });
        console.log(`🗑️ ${deleted.deletedCount} existing earbuds products cleared.`);

        const earbuds = generateEarbuds();
        await Product.insertMany(earbuds);
        console.log(`🌱 ${earbuds.length} Earbuds products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
