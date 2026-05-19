const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Logitech", "HP", "Dell", "Zebronics", "Redgear", "Corsair", "Asus", "Lenovo", "Razer", "Portronics"];

const keyboardTypes = [
    { type: "Mechanical Keyboard", description: "Tactile and responsive mechanical switches for ultimate typing and gaming." },
    { type: "Wireless Keyboard", description: "Clutter-free desk with high-performance wireless connectivity." },
    { type: "Bluetooth Keyboard", description: "Multi-device pairing with seamless Bluetooth switching." },
    { type: "RGB Gaming Keyboard", description: "Immersive RGB lighting with customizable patterns and gaming modes." },
    { type: "Compact Keyboard", description: "Space-saving 60% or TKL layout, ideal for small desks and travel." },
    { type: "Ergonomic Keyboard", description: "Split or curved design to reduce wrist strain and improve posture." },
    { type: "Membrane Keyboard", description: "Quiet and comfortable typing with soft-touch membrane keys." },
    { type: "Rechargeable Keyboard", description: "Eco-friendly built-in battery with long-lasting charge via Type-C." },
    { type: "Foldable Keyboard", description: "Pocket-sized foldable design for typing on smartphones and tablets." },
    { type: "Professional Productivity Keyboard", description: "Precision typing with dedicated macro keys and productivity shortcuts." }
];

const connectivities = ["Wireless (2.4GHz)", "Bluetooth 5.0", "Wired (USB)", "Dual Mode (Wired + BT)"];
const switchTypes = ["Blue Switches (Clicky)", "Red Switches (Linear)", "Brown Switches (Tactile)", "Membrane", "Scissor Switches", "Optical Switches"];
const backlights = ["Full RGB (16.8M Colors)", "Static White LED", "Rainbow Backlit", "No Backlight", "Single Color (Blue)"];
const compatibilities = ["Windows & macOS", "Windows Only", "Universal (Android, iOS, PC)", "Gaming Consoles & PC", "Multi-OS Support"];
const colorList = ["Midnight Black", "Arctic White", "Carbon Grey", "Navy Blue", "Slate Silver"];

const keyboardImages = [
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop", // RGB Mechanical
    "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop", // Wireless setup
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop", // Keyboard focus
    "https://images.unsplash.com/photo-1618384881928-df96c32e4ae?q=80&w=800&auto=format&fit=crop", // Desk context
    "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=800&auto=format&fit=crop", // Typing shot
    "https://images.unsplash.com/photo-1541140134513-85a161dc4a00?q=80&w=800&auto=format&fit=crop", // Tech aesthetic
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", // Product detail
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=800&auto=format&fit=crop"  // Minimalist
];

const generateKeyboards = () => {
    const products = [];
    for (let i = 1; i <= 40; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const typeObj = keyboardTypes[Math.floor(Math.random() * keyboardTypes.length)];
        const type = typeObj.type;
        
        const name = `${brand} ${type} ${i % 2 === 0 ? 'Master' : 'Elite'}`;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[&]/g, 'and') + '-' + i;
        
        const basePrice = type.includes("Mechanical") ? 3000 : 
                         type.includes("Gaming") ? 2000 : 
                         type.includes("Wireless") ? 1500 : 600;
        
        const price = Math.floor(basePrice + Math.random() * (basePrice * 0.8));
        const originalPrice = Math.floor(price * (1.3 + Math.random() * 0.4));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const selectedColors = colorList.sort(() => 0.5 - Math.random()).slice(0, 2);
        const image = keyboardImages[Math.floor(Math.random() * keyboardImages.length)];
        
        const connectivity = connectivities[Math.floor(Math.random() * connectivities.length)];
        const switchType = switchTypes[Math.floor(Math.random() * switchTypes.length)];
        const backlight = backlights[Math.floor(Math.random() * backlights.length)];
        const compatibility = compatibilities[Math.floor(Math.random() * compatibilities.length)];

        products.push({
            name,
            slug,
            brand,
            description: `${typeObj.description} The ${name} by ${brand} features ${switchType} and vibrant ${backlight}. Designed for ${compatibility} with a focus on durability and style.`,
            category: "Electronics & Tech",
            subcategory: "Laptops",
            section: "Tech Essentials",
            type,
            connectivity,
            switchType,
            backlight,
            compatibility,
            colors: selectedColors,
            image: image,
            images: [image, keyboardImages[(Math.floor(Math.random() * keyboardImages.length))]],
            price,
            originalPrice,
            discount,
            stock: 10 + Math.floor(Math.random() * 100),
            rating: 4.3 + (Math.random() * 0.7),
            ratingsCount: 50 + Math.floor(Math.random() * 3000),
            featured: i % 8 === 0,
            trending: i % 5 === 0,
            highlights: [
                `${switchType} Technology`,
                `${backlight} Lighting`,
                `${connectivity} Connectivity`,
                "Anti-Ghosting Keys",
                "Spill-Resistant Design"
            ],
            specifications: {
                "Model": `KBD-${brand}-${i}`,
                "Layout": "Full-size / Tenkeyless",
                "Key Lifecycle": "50 Million Clicks",
                "Polling Rate": "1000Hz",
                "Warranty": "1 Year Limited Warranty"
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

        const deleted = await Product.deleteMany({ section: "Tech Essentials", type: { $regex: /Keyboard/i } });
        console.log(`🗑️ ${deleted.deletedCount} existing keyboard products cleared.`);

        const keyboards = generateKeyboards();
        await Product.insertMany(keyboards);
        console.log(`🌱 ${keyboards.length} Keyboard products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
