const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const rcBrands = ["Hot Wheels", "Toyshine", "Baybee", "Ralleyz", "FunBlast", "Webby", "LEGO Technic", "Hamleys", "Fisher-Price", "Nerf"];

const rcTypes = [
    { type: "Racing RC Cars", speeds: ["15 km/h", "20 km/h", "25+ km/h"], ages: ["6-8 Years", "9-12 Years", "12+ Years"], batteries: ["Rechargeable included"], charging: ["Type-C", "USB"], ranges: ["20 Meters", "30 Meters"] },
    { type: "Drift RC Cars", speeds: ["10 km/h", "15 km/h", "20 km/h"], ages: ["6-8 Years", "9-12 Years", "12+ Years"], batteries: ["Rechargeable included", "Yes"], charging: ["USB"], ranges: ["15 Meters", "20 Meters"] },
    { type: "Monster Truck RC Cars", speeds: ["10 km/h", "15 km/h"], ages: ["6-8 Years", "9-12 Years"], batteries: ["Rechargeable included"], charging: ["USB", "AC Adapter"], ranges: ["30 Meters", "50 Meters"] },
    { type: "Mini RC Cars", speeds: ["5 km/h", "10 km/h"], ages: ["3-5 Years", "6-8 Years"], batteries: ["Yes", "Rechargeable included"], charging: ["USB", "Battery Box"], ranges: ["10 Meters", "15 Meters"] },
    { type: "Rechargeable RC Cars", speeds: ["10 km/h", "15 km/h"], ages: ["6-8 Years", "9-12 Years"], batteries: ["Rechargeable included"], charging: ["Type-C", "USB"], ranges: ["20 Meters", "30 Meters"] },
    { type: "Off-Road RC Cars", speeds: ["15 km/h", "20 km/h", "25+ km/h"], ages: ["9-12 Years", "12+ Years"], batteries: ["Rechargeable included"], charging: ["AC Adapter", "USB"], ranges: ["30 Meters", "50 Meters"] },
    { type: "LED RC Cars", speeds: ["10 km/h", "15 km/h"], ages: ["3-5 Years", "6-8 Years"], batteries: ["Yes", "Rechargeable included"], charging: ["USB"], ranges: ["15 Meters", "20 Meters"] },
    { type: "Gesture Control RC Cars", speeds: ["10 km/h", "15 km/h"], ages: ["6-8 Years", "9-12 Years"], batteries: ["Rechargeable included"], charging: ["USB"], ranges: ["20 Meters", "30 Meters"] },
    { type: "Stunt RC Cars", speeds: ["10 km/h", "15 km/h", "20 km/h"], ages: ["6-8 Years", "9-12 Years", "12+ Years"], batteries: ["Rechargeable included"], charging: ["USB"], ranges: ["20 Meters", "30 Meters"] },
    { type: "High Speed RC Cars", speeds: ["20 km/h", "25+ km/h"], ages: ["9-12 Years", "12+ Years"], batteries: ["Rechargeable included"], charging: ["AC Adapter", "Type-C"], ranges: ["50 Meters", "100 Meters"] }
];

const availableColors = ["Red", "Blue", "Black", "Yellow", "Green", "Silver"];

const generateRCCars = () => {
    const products = [];
    let idCounter = 1;

    for (const t of rcTypes) {
        // Generate 4 products per type to get 40 total (exceeds min 35)
        for (let i = 0; i < 4; i++) {
            const brand = rcBrands[Math.floor(Math.random() * rcBrands.length)];
            const speed = t.speeds[Math.floor(Math.random() * t.speeds.length)];
            const ageGroup = t.ages[Math.floor(Math.random() * t.ages.length)];
            const batteryRequired = t.batteries[Math.floor(Math.random() * t.batteries.length)];
            const chargingType = t.charging[Math.floor(Math.random() * t.charging.length)];
            const remoteRange = t.ranges[Math.floor(Math.random() * t.ranges.length)];
            const color = availableColors[Math.floor(Math.random() * availableColors.length)];
            
            const name = `${brand} ${t.type} - ${speed} (${color})`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            // Random pricing for RC Cars
            const price = 499 + Math.floor(Math.random() * 3000);
            const originalPrice = Math.floor(price * 1.55); // 55% markup for discount
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `Experience the thrill of racing with the ${brand} ${t.type}. This powerful remote control car hits speeds of up to ${speed} and operates perfectly within a ${remoteRange} radius. Ideal for ages ${ageGroup}. charging is handled via ${chargingType}.`,
                category: "Family Essentials",
                subcategory: "Toys & Kids Essentials",
                section: "Kids Essentials",
                type: t.type,
                speed,
                ageGroup,
                batteryRequired,
                chargingType,
                remoteRange,
                colors: [color],
                image: `https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 5000}`,
                images: [`https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 5000}`],
                price,
                originalPrice,
                discount,
                stock: 15 + Math.floor(Math.random() * 60),
                rating: 4.3 + (Math.random() * 0.6),
                ratingsCount: 75 + Math.floor(Math.random() * 400),
                featured: i % 2 === 0,
                trending: i % 3 === 0,
                highlights: [
                    `Top Speed: ${speed}`,
                    `Remote Range: ${remoteRange}`,
                    `Age: ${ageGroup}`,
                    `Battery: ${batteryRequired}`
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

        const targetTypes = rcTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Family Essentials", 
            subcategory: "Toys & Kids Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing RC Car products cleared.`);

        const rcProducts = generateRCCars();
        await Product.insertMany(rcProducts);
        console.log(`🌱 ${rcProducts.length} RC Car products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
