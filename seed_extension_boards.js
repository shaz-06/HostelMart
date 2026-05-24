const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const ebBrands = ["Havells", "Anchor", "GM", "Belkin", "Philips", "Portronics", "Syska", "Goldmedal", "Bajaj", "Wipro"];

const ebTypes = [
    { type: "Multi Plug Extension Boards", sockets: ["3 Sockets", "4 Sockets", "6 Sockets"], lengths: ["1.5 Meters", "2 Meters"], usbs: ["No USB"] },
    { type: "USB Extension Boards", sockets: ["4 Sockets", "5 Sockets"], lengths: ["2 Meters", "3 Meters"], usbs: ["2 USB Ports", "3 USB Ports", "4 USB Ports"] },
    { type: "Spike Guard Extension Boards", sockets: ["4 Sockets", "6 Sockets", "8 Sockets"], lengths: ["1.5 Meters", "2 Meters"], usbs: ["No USB", "2 USB Ports"] },
    { type: "Smart Extension Boards", sockets: ["3 Sockets", "4 Sockets"], lengths: ["2 Meters"], usbs: ["2 USB Ports", "3 USB Ports"] },
    { type: "Heavy Duty Extension Boards", sockets: ["4 Sockets", "6 Sockets"], lengths: ["3 Meters", "5 Meters"], usbs: ["No USB"] },
    { type: "Gaming Power Strips", sockets: ["6 Sockets", "8 Sockets", "10 Sockets"], lengths: ["2 Meters", "3 Meters"], usbs: ["3 USB Ports", "4 USB Ports"] },
    { type: "Universal Socket Boards", sockets: ["3 Sockets", "4 Sockets", "5 Sockets"], lengths: ["1 Meter", "1.5 Meters"], usbs: ["No USB", "2 USB Ports"] },
    { type: "Individual Switch Extension Boards", sockets: ["4 Sockets", "6 Sockets"], lengths: ["2 Meters", "3 Meters"], usbs: ["No USB", "2 USB Ports"] },
    { type: "Surge Protector Boards", sockets: ["4 Sockets", "6 Sockets", "8 Sockets"], lengths: ["2 Meters"], usbs: ["No USB"] },
    { type: "Long Cable Extension Boards", sockets: ["4 Sockets"], lengths: ["5 Meters"], usbs: ["No USB"] }
];

const availableColors = ["White", "Black", "Grey", "Red", "Blue"];

const generateExtensionBoards = () => {
    const products = [];
    let idCounter = 1;

    for (const st of ebTypes) {
        // Generate 4 products per type to get 40 total (exceeds min 30)
        for (let i = 0; i < 4; i++) {
            const brand = ebBrands[Math.floor(Math.random() * ebBrands.length)];
            const socketCount = st.sockets[Math.floor(Math.random() * st.sockets.length)];
            const cableLength = st.lengths[Math.floor(Math.random() * st.lengths.length)];
            const usbPorts = st.usbs[Math.floor(Math.random() * st.usbs.length)];
            const color = availableColors[Math.floor(Math.random() * availableColors.length)];
            
            const name = `${brand} ${st.type} - ${socketCount}, ${cableLength}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            const price = 250 + Math.floor(Math.random() * 1500);
            const originalPrice = Math.floor(price * 1.35); // 35% markup for discount
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `High quality ${st.type} by ${brand}. Features ${socketCount} and ${usbPorts}. Comes with a ${cableLength} durable cable. Ensure your devices are powered safely with built-in surge protection.`,
                category: "Hostel & Student Essentials",
                subcategory: "Home Utility",
                section: "Daily Use Essentials",
                type: st.type,
                socketCount,
                cableLength,
                usbPorts,
                powerRating: "2500W", // Standard power rating
                surgeProtection: "Yes",
                colors: [color],
                image: `https://images.unsplash.com/photo-1558231454-bbbb677fc0d4?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 2000}`,
                images: [`https://images.unsplash.com/photo-1558231454-bbbb677fc0d4?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 2000}`],
                price,
                originalPrice,
                discount,
                stock: 20 + Math.floor(Math.random() * 100),
                rating: 4.2 + (Math.random() * 0.7),
                ratingsCount: 80 + Math.floor(Math.random() * 800),
                featured: i % 2 === 0,
                trending: i % 3 === 0,
                highlights: [
                    `${socketCount} Available`,
                    `${cableLength} Durable Cable`,
                    `${usbPorts}`,
                    "Surge Protection Enabled"
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

        const targetTypes = ebTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Hostel & Student Essentials", 
            subcategory: "Home Utility",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing Extension Board products cleared.`);

        const boardProducts = generateExtensionBoards();
        await Product.insertMany(boardProducts);
        console.log(`🌱 ${boardProducts.length} Extension Board products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
