const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const schoolItemBrands = ["Classmate", "Camlin", "Faber-Castell", "Doms", "Navneet", "Cello", "Milton", "Kangaro", "Nataraj", "Maped"];

const schoolItemTypes = [
    { type: "School Bags", materials: ["Polyester", "Nylon", "Canvas"], packSizes: ["Pack of 1"], ageGroups: ["6-10 Years", "11-15 Years", "15+ Years"] },
    { type: "Pencil Boxes", materials: ["Plastic", "Metal"], packSizes: ["Pack of 1", "Pack of 2"], ageGroups: ["All Ages"] },
    { type: "Geometry Boxes", materials: ["Metal"], packSizes: ["Pack of 1"], ageGroups: ["11-15 Years", "15+ Years"] },
    { type: "Water Bottles", materials: ["Stainless Steel", "Plastic", "Copper"], packSizes: ["Pack of 1"], ageGroups: ["All Ages"] },
    { type: "Lunch Boxes", materials: ["Stainless Steel", "Plastic", "Glass"], packSizes: ["Pack of 1", "Set of 2"], ageGroups: ["All Ages"] },
    { type: "Crayons", materials: ["Wax"], packSizes: ["Pack of 12", "Pack of 24", "Pack of 48"], ageGroups: ["3-5 Years", "6-10 Years"] },
    { type: "Color Pencils", materials: ["Wood"], packSizes: ["Pack of 12", "Pack of 24"], ageGroups: ["All Ages"] },
    { type: "Erasers", materials: ["Rubber"], packSizes: ["Pack of 5", "Pack of 10", "Pack of 20"], ageGroups: ["All Ages"] },
    { type: "Sharpeners", materials: ["Plastic", "Metal"], packSizes: ["Pack of 5", "Pack of 10"], ageGroups: ["All Ages"] },
    { type: "Scale Sets", materials: ["Plastic", "Steel"], packSizes: ["Pack of 1", "Pack of 2"], ageGroups: ["6-10 Years", "11-15 Years", "15+ Years"] },
    { type: "Glue Sticks", materials: ["Adhesive"], packSizes: ["Pack of 2", "Pack of 5"], ageGroups: ["All Ages"] },
    { type: "Craft Kits", materials: ["Mixed", "Paper"], packSizes: ["Pack of 1"], ageGroups: ["6-10 Years", "11-15 Years"] },
    { type: "Drawing Books", materials: ["Paper"], packSizes: ["Pack of 1", "Pack of 3", "Pack of 5"], ageGroups: ["All Ages"] },
    { type: "Whiteboards", materials: ["Wood", "Plastic"], packSizes: ["Pack of 1"], ageGroups: ["All Ages"] },
    { type: "Exam Pads", materials: ["Wood", "Plastic", "Cardboard"], packSizes: ["Pack of 1", "Pack of 2"], ageGroups: ["All Ages"] }
];

const availableColors = ["Multicolor", "Black", "Blue", "Red", "Green", "Pink", "Yellow"];
const dimensionsList = ["Standard", "Large", "Mini", "30x20 cm", "25x15 cm"];

const generateSchoolItems = () => {
    const products = [];
    let idCounter = 1;

    for (const t of schoolItemTypes) {
        // Generate 4 products per type to get 60 total
        for (let i = 0; i < 4; i++) {
            const brand = schoolItemBrands[Math.floor(Math.random() * schoolItemBrands.length)];
            const ageGroup = t.ageGroups[Math.floor(Math.random() * t.ageGroups.length)];
            const material = t.materials[Math.floor(Math.random() * t.materials.length)];
            const packSize = t.packSizes[Math.floor(Math.random() * t.packSizes.length)];
            const color = availableColors[Math.floor(Math.random() * availableColors.length)];
            const dimensions = dimensionsList[Math.floor(Math.random() * dimensionsList.length)];
            
            const name = `${brand} Premium ${t.type} - ${color} (${packSize})`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            const price = 50 + Math.floor(Math.random() * 950);
            const originalPrice = Math.floor(price * 1.30); // 30% markup for discount
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            // Unsplash placeholder for school items
            const imageUrl = `https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 6000}`;

            products.push({
                name,
                slug,
                brand,
                description: `Equip yourself with the best in class ${brand} ${t.type}. Made from high-quality ${material}, designed specifically for ${ageGroup}. Comes in a convenient ${packSize}. Essential for every student's daily routine!`,
                category: "Hostel & Student Essentials",
                subcategory: "Study Essentials",
                section: "Student Essentials",
                type: t.type,
                material,
                ageGroup,
                packSize,
                dimensions,
                colors: [color],
                image: imageUrl,
                images: [imageUrl, imageUrl],
                price,
                originalPrice,
                discount,
                stock: 20 + Math.floor(Math.random() * 80),
                rating: 4.0 + (Math.random() * 1.0),
                ratingsCount: 50 + Math.floor(Math.random() * 300),
                featured: i % 2 === 0,
                trending: i % 3 === 0,
                highlights: [
                    `Brand: ${brand}`,
                    `Type: ${t.type}`,
                    `Material: ${material}`,
                    `Age Group: ${ageGroup}`,
                    `Pack Size: ${packSize}`
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

        const targetTypes = schoolItemTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Hostel & Student Essentials", 
            subcategory: "Study Essentials",
            section: "Student Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing School Item products cleared.`);

        const products = generateSchoolItems();
        await Product.insertMany(products);
        console.log(`🌱 ${products.length} School Item products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
