const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const speakerBrands = ["JBL", "boAt", "Sony", "Zebronics", "Mivi", "Marshall", "Realme", "Portronics", "Logitech", "Mi"];

const speakerTypes = [
    { type: "Portable Bluetooth Speakers", connectivities: ["Bluetooth 5.0", "Bluetooth 5.1", "Bluetooth 5.3"], powers: ["10W", "16W", "20W"], waters: ["IPX4", "IPX5"], batteries: ["10 Hours", "15 Hours"] },
    { type: "Waterproof Speakers", connectivities: ["Bluetooth 5.2", "Bluetooth 5.3"], powers: ["10W", "20W"], waters: ["IPX7", "IP55"], batteries: ["15 Hours", "20 Hours"] },
    { type: "Party Speakers", connectivities: ["Bluetooth 5.0", "Wireless", "Wired"], powers: ["50W", "100W", "120W"], waters: ["IPX4"], batteries: ["10 Hours", "15 Hours"] },
    { type: "Mini Bluetooth Speakers", connectivities: ["Bluetooth 5.0", "Bluetooth 5.1"], powers: ["5W", "10W"], waters: ["IPX4"], batteries: ["10 Hours"] },
    { type: "RGB Speakers", connectivities: ["Bluetooth 5.2", "Wired"], powers: ["16W", "20W"], waters: ["IPX4"], batteries: ["10 Hours", "15 Hours"] },
    { type: "Smart Bluetooth Speakers", connectivities: ["Wi-Fi", "Bluetooth 5.3"], powers: ["20W", "30W"], waters: ["IPX4"], batteries: ["15 Hours"] },
    { type: "Outdoor Speakers", connectivities: ["Bluetooth 5.2", "Bluetooth 5.3"], powers: ["30W", "50W"], waters: ["IPX7", "IP55"], batteries: ["20 Hours", "24 Hours"] },
    { type: "Bass Boost Speakers", connectivities: ["Bluetooth 5.0", "Bluetooth 5.2"], powers: ["20W", "30W", "50W"], waters: ["IPX5"], batteries: ["15 Hours", "20 Hours"] },
    { type: "Soundbar Speakers", connectivities: ["Bluetooth 5.3", "Wired", "Wireless"], powers: ["50W", "100W", "120W"], waters: ["IPX4"], batteries: ["20 Hours"] },
    { type: "Rechargeable Wireless Speakers", connectivities: ["Bluetooth 5.1", "Bluetooth 5.2"], powers: ["10W", "20W"], waters: ["IPX5"], batteries: ["15 Hours", "24 Hours"] }
];

const availableColors = ["Phantom Black", "Midnight Blue", "Ocean Blue", "Crimson Red", "Forest Green", "Arctic White"];

const generateSpeakers = () => {
    const products = [];
    let idCounter = 1;

    for (const st of speakerTypes) {
        // Generate 4 products per type to get 40 total (exceeds min 35)
        for (let i = 0; i < 4; i++) {
            const brand = speakerBrands[Math.floor(Math.random() * speakerBrands.length)];
            const connectivity = st.connectivities[Math.floor(Math.random() * st.connectivities.length)];
            const outputPower = st.powers[Math.floor(Math.random() * st.powers.length)];
            const waterResistance = st.waters[Math.floor(Math.random() * st.waters.length)];
            const batteryLife = st.batteries[Math.floor(Math.random() * st.batteries.length)];
            const color = availableColors[Math.floor(Math.random() * availableColors.length)];
            
            const name = `${brand} ${st.type} - ${outputPower} ${color}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            // Generate a realistic price depending on output power
            const basePrice = parseInt(outputPower) * 100 + 500;
            const price = basePrice + Math.floor(Math.random() * 1000);
            const originalPrice = Math.floor(price * 1.40); // 40% markup for discount
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `Experience immersive audio with the ${brand} ${st.type}. Featuring ${outputPower} output, ${batteryLife} of playtime, and robust ${waterResistance} rating. Connect effortlessly via ${connectivity} and take your music everywhere.`,
                category: "Electronics & Tech",
                subcategory: "Audio",
                section: "Tech Essentials",
                type: st.type,
                connectivity,
                outputPower,
                waterResistance,
                batteryLife,
                colors: [color],
                image: `https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 900}`,
                images: [`https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 900}`],
                price,
                originalPrice,
                discount,
                stock: 20 + Math.floor(Math.random() * 80),
                rating: 4.1 + (Math.random() * 0.8),
                ratingsCount: 150 + Math.floor(Math.random() * 1500),
                featured: i % 2 === 0,
                trending: i % 3 === 0,
                highlights: [
                    `${outputPower} Powerful Audio`,
                    `Up to ${batteryLife} Playtime`,
                    `${waterResistance} Rated`,
                    `Seamless ${connectivity}`
                ],
                createdAt: new Date()
            });
            idCounter++;
        }
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const targetTypes = speakerTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Electronics & Tech", 
            subcategory: "Audio",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing Bluetooth Speaker products cleared.`);

        const speakerProducts = generateSpeakers();
        await Product.insertMany(speakerProducts);
        console.log(`🌱 ${speakerProducts.length} Bluetooth Speaker products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
