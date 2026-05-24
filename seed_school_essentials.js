const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const brands = ["Classmate", "Milton", "Cello", "Camlin", "Faber-Castell", "Doms", "Skybags", "Wildcraft", "American Tourister", "Navneet"];

const productGroups = [
    {
        category: "Pencil Boxes",
        types: [
            { type: "Plastic Pencil Boxes", materials: ["Plastic"], capacity: ["Standard"], ageGroups: ["All Ages"], packSizes: ["Pack of 1"] },
            { type: "Metal Pencil Boxes", materials: ["Metal", "Steel"], capacity: ["Standard"], ageGroups: ["All Ages"], packSizes: ["Pack of 1"] },
            { type: "Zipper Pencil Pouches", materials: ["Canvas", "Polyester"], capacity: ["Standard", "Large"], ageGroups: ["11-15 Years", "15+ Years"], packSizes: ["Pack of 1"] },
            { type: "Cartoon Pencil Boxes", materials: ["Plastic", "Metal"], capacity: ["Standard"], ageGroups: ["3-5 Years", "6-10 Years"], packSizes: ["Pack of 1"] },
            { type: "Multi-Layer Pencil Boxes", materials: ["Plastic"], capacity: ["Large"], ageGroups: ["6-10 Years", "11-15 Years"], packSizes: ["Pack of 1"] }
        ]
    },
    {
        category: "Water Bottles",
        types: [
            { type: "Kids Water Bottles", materials: ["Plastic"], capacity: ["500 ml", "750 ml"], ageGroups: ["3-5 Years", "6-10 Years"], packSizes: ["Pack of 1"] },
            { type: "Steel Bottles", materials: ["Stainless Steel"], capacity: ["750 ml", "1 L"], ageGroups: ["All Ages"], packSizes: ["Pack of 1"] },
            { type: "Sipper Bottles", materials: ["Plastic", "Metal"], capacity: ["500 ml", "750 ml"], ageGroups: ["All Ages"], packSizes: ["Pack of 1"] },
            { type: "Leakproof Bottles", materials: ["Stainless Steel", "Tritan"], capacity: ["750 ml", "1 L"], ageGroups: ["11-15 Years", "15+ Years"], packSizes: ["Pack of 1"] },
            { type: "Cartoon Bottles", materials: ["Plastic"], capacity: ["500 ml"], ageGroups: ["3-5 Years", "6-10 Years"], packSizes: ["Pack of 1"] }
        ]
    },
    {
        category: "School Bags",
        types: [
            { type: "Backpack School Bags", materials: ["Polyester", "Nylon"], capacity: ["15 L", "20 L"], ageGroups: ["6-10 Years", "11-15 Years"], packSizes: ["Pack of 1"] },
            { type: "Trolley Bags", materials: ["Polycarbonate", "Polyester"], capacity: ["25 L"], ageGroups: ["6-10 Years", "11-15 Years"], packSizes: ["Pack of 1"] },
            { type: "Cartoon Bags", materials: ["Polyester"], capacity: ["10 L", "15 L"], ageGroups: ["3-5 Years", "6-10 Years"], packSizes: ["Pack of 1"] },
            { type: "Waterproof School Bags", materials: ["Nylon", "PVC"], capacity: ["20 L", "25 L"], ageGroups: ["11-15 Years", "15+ Years"], packSizes: ["Pack of 1"] },
            { type: "Laptop School Bags", materials: ["Polyester", "Nylon"], capacity: ["25 L", "30 L"], ageGroups: ["15+ Years"], packSizes: ["Pack of 1"] }
        ]
    },
    {
        category: "Crayons",
        types: [
            { type: "Wax Crayons", materials: ["Wax"], capacity: ["Standard"], ageGroups: ["3-5 Years", "6-10 Years"], packSizes: ["Pack of 12", "Pack of 24"] },
            { type: "Jumbo Crayons", materials: ["Wax"], capacity: ["Standard"], ageGroups: ["3-5 Years"], packSizes: ["Pack of 12", "Pack of 24"] },
            { type: "Washable Crayons", materials: ["Wax", "Non-toxic"], capacity: ["Standard"], ageGroups: ["3-5 Years", "6-10 Years"], packSizes: ["Pack of 12", "Pack of 24"] },
            { type: "Twistable Crayons", materials: ["Plastic", "Wax"], capacity: ["Standard"], ageGroups: ["6-10 Years", "11-15 Years"], packSizes: ["Pack of 12", "Pack of 24"] },
            { type: "Crayon Art Sets", materials: ["Mixed", "Wax"], capacity: ["Standard"], ageGroups: ["All Ages"], packSizes: ["Pack of 48", "Pack of 64"] }
        ]
    }
];

const availableColors = ["Multicolor", "Black", "Blue", "Red", "Green", "Pink", "Yellow"];
const dimensionsList = ["Standard", "Large", "Mini", "30x20 cm", "25x15 cm"];

const generateProducts = () => {
    const products = [];
    let idCounter = 1;

    for (const group of productGroups) {
        for (const t of group.types) {
            // 4 items per type (20 types total = 80 products)
            for (let i = 0; i < 4; i++) {
                const brand = brands[Math.floor(Math.random() * brands.length)];
                const ageGroup = t.ageGroups[Math.floor(Math.random() * t.ageGroups.length)];
                const material = t.materials[Math.floor(Math.random() * t.materials.length)];
                const capacity = t.capacity[Math.floor(Math.random() * t.capacity.length)];
                const packSize = t.packSizes[Math.floor(Math.random() * t.packSizes.length)];
                const color = availableColors[Math.floor(Math.random() * availableColors.length)];
                const dimensions = dimensionsList[Math.floor(Math.random() * dimensionsList.length)];
                
                const name = `${brand} Premium ${t.type} - ${color}`;
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
                
                const price = 100 + Math.floor(Math.random() * 1900); // 100 to 2000
                const originalPrice = Math.floor(price * 1.40); // 40% markup for discount
                const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

                const imageUrl = `https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 7000}`;

                products.push({
                    name,
                    slug,
                    brand,
                    description: `Experience the finest quality with ${brand}'s ${t.type}. Engineered with premium ${material} for maximum durability. Ideal for ${ageGroup} with a capacity/size of ${capacity}. Upgrade your study essentials today.`,
                    category: "Hostel & Student Essentials",
                    subcategory: "Study Essentials",
                    section: "Student Essentials",
                    type: t.type,
                    material,
                    dimensions,
                    capacity,
                    ageGroup,
                    packSize,
                    colors: [color],
                    image: imageUrl,
                    images: [imageUrl, imageUrl],
                    price,
                    originalPrice,
                    discount,
                    stock: 15 + Math.floor(Math.random() * 85),
                    rating: 3.8 + (Math.random() * 1.2),
                    ratingsCount: 25 + Math.floor(Math.random() * 475),
                    featured: i % 3 === 0,
                    trending: i % 4 === 0,
                    highlights: [
                        `Brand: ${brand}`,
                        `Type: ${t.type}`,
                        `Material: ${material}`,
                        `Capacity/Size: ${capacity}`,
                        `Age Group: ${ageGroup}`
                    ],
                    createdAt: new Date()
                });
                idCounter++;
            }
        }
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const targetTypes = [];
        productGroups.forEach(g => {
            g.types.forEach(t => targetTypes.push(t.type));
        });

        const deleted = await Product.deleteMany({ 
            category: "Hostel & Student Essentials", 
            subcategory: "Study Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing specialized school essential products cleared.`);

        const products = generateProducts();
        await Product.insertMany(products);
        console.log(`🌱 ${products.length} School Essential products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
