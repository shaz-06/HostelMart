const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const toyBrands = ["Funskool", "LEGO", "Barbie", "Hot Wheels", "Fisher-Price", "Nerf", "Hamleys", "Mee Mee", "Disney", "PlayShifu"];

const toyTypes = [
    { type: "Soft Toys", materials: ["Fabric"], ages: ["0-2 Years", "3-5 Years"], batteries: ["No"], images: [4001, 4002] },
    { type: "Remote Control Cars", materials: ["Plastic", "Metal"], ages: ["6-8 Years", "9-12 Years"], batteries: ["Yes"], images: [4003, 4004] },
    { type: "Building Blocks", materials: ["Plastic", "Wood"], ages: ["3-5 Years", "6-8 Years", "12+ Years"], batteries: ["No"], images: [4005, 4006] },
    { type: "Educational Toys", materials: ["Wood", "Plastic"], ages: ["3-5 Years", "6-8 Years"], batteries: ["Yes", "No"], images: [4007, 4008] },
    { type: "Puzzle Games", materials: ["Wood", "Plastic"], ages: ["6-8 Years", "9-12 Years"], batteries: ["No"], images: [4009, 4010] },
    { type: "Action Figures", materials: ["Plastic"], ages: ["6-8 Years", "9-12 Years", "12+ Years"], batteries: ["No"], images: [4011, 4012] },
    { type: "Toy Kitchen Sets", materials: ["Plastic", "Wood"], ages: ["3-5 Years", "6-8 Years"], batteries: ["No"], images: [4013, 4014] },
    { type: "Baby Toys", materials: ["Silicone", "Plastic", "Fabric"], ages: ["0-2 Years"], batteries: ["Yes", "No"], images: [4015, 4016] },
    { type: "Board Games", materials: ["Plastic"], ages: ["6-8 Years", "9-12 Years", "12+ Years"], batteries: ["No"], images: [4017, 4018] },
    { type: "Outdoor Toys", materials: ["Plastic", "Rubber"], ages: ["6-8 Years", "9-12 Years"], batteries: ["No"], images: [4019, 4020] },
    { type: "Toy Guns", materials: ["Plastic"], ages: ["9-12 Years", "12+ Years"], batteries: ["No", "Yes"], images: [4021, 4022] },
    { type: "Musical Toys", materials: ["Plastic"], ages: ["3-5 Years", "6-8 Years"], batteries: ["Yes"], images: [4023, 4024] },
    { type: "Doll Sets", materials: ["Plastic", "Fabric"], ages: ["3-5 Years", "6-8 Years"], batteries: ["No"], images: [4025, 4026] },
    { type: "Fidget Toys", materials: ["Silicone", "Plastic"], ages: ["3-5 Years", "6-8 Years", "9-12 Years"], batteries: ["No"], images: [4027, 4028] },
    { type: "Mini Racing Cars", materials: ["Metal", "Plastic"], ages: ["3-5 Years", "6-8 Years"], batteries: ["No"], images: [4029, 4030] }
];

const availableColors = ["Multicolor", "Red", "Blue", "Pink", "Yellow", "Green"];

const generateToys = () => {
    const products = [];
    let idCounter = 1;

    for (const t of toyTypes) {
        // Generate 4 products per type to get 60 total (exceeds min 50)
        for (let i = 0; i < 4; i++) {
            const brand = toyBrands[Math.floor(Math.random() * toyBrands.length)];
            const ageGroup = t.ages[Math.floor(Math.random() * t.ages.length)];
            const material = t.materials[Math.floor(Math.random() * t.materials.length)];
            const batteryRequired = t.batteries[Math.floor(Math.random() * t.batteries.length)];
            const color = availableColors[Math.floor(Math.random() * availableColors.length)];
            
            const name = `${brand} ${t.type} - ${ageGroup}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            // Random pricing for toys
            const price = 150 + Math.floor(Math.random() * 2500);
            const originalPrice = Math.floor(price * 1.40); // 40% markup for discount
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `Delight your kids with the ${brand} ${t.type}. Perfect for the ${ageGroup} age group, made of high quality ${material}. ${batteryRequired === 'Yes' ? 'Batteries are required for this toy.' : 'No batteries required.'} Ensure endless hours of fun and learning.`,
                category: "Family Essentials",
                subcategory: "Toys & Kids Essentials",
                section: "Kids Essentials",
                type: t.type,
                ageGroup,
                material,
                batteryRequired,
                colors: [color],
                image: `https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 4000}`,
                images: [`https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 4000}`],
                price,
                originalPrice,
                discount,
                stock: 20 + Math.floor(Math.random() * 80),
                rating: 4.2 + (Math.random() * 0.8),
                ratingsCount: 50 + Math.floor(Math.random() * 500),
                featured: i % 2 === 0,
                trending: i % 3 === 0,
                highlights: [
                    `Age Group: ${ageGroup}`,
                    `Material: ${material}`,
                    `Battery: ${batteryRequired}`,
                    "High Quality Design"
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

        const targetTypes = toyTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Family Essentials", 
            subcategory: "Toys & Kids Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing Toy products cleared.`);

        const toyProducts = generateToys();
        await Product.insertMany(toyProducts);
        console.log(`🌱 ${toyProducts.length} Toy products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
