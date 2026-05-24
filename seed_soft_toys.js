const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const softToyBrands = ["Hamleys", "Fisher-Price", "Disney", "Funskool", "Barbie", "Webby", "Toyshine", "Little Genius", "Mee Mee", "Playgro"];

const softToyTypes = [
    { type: "Teddy Bears", materials: ["Plush", "Cotton"], sizes: ["Small", "Medium", "Large"] },
    { type: "Plush Animals", materials: ["Plush", "Velvet"], sizes: ["Small", "Medium"] },
    { type: "Cartoon Soft Toys", materials: ["Polyester", "Plush"], sizes: ["Medium", "Large"] },
    { type: "Giant Teddy Bears", materials: ["Plush"], sizes: ["Giant"] },
    { type: "Pillow Soft Toys", materials: ["Cotton", "Velvet"], sizes: ["Medium", "Large"] },
    { type: "Musical Soft Toys", materials: ["Plush", "Polyester"], sizes: ["Small", "Medium"] },
    { type: "Hugging Plush Toys", materials: ["Plush", "Velvet", "Cotton"], sizes: ["Large", "Giant"] },
    { type: "Baby Soft Toys", materials: ["Cotton", "Organic Cotton"], sizes: ["Small"] },
    { type: "Character Plush Dolls", materials: ["Plush", "Polyester"], sizes: ["Small", "Medium"] },
    { type: "Mini Soft Toy Sets", materials: ["Plush", "Cotton"], sizes: ["Small"] }
];

const availableColors = ["Multicolor", "Pink", "Blue", "Brown", "White", "Red", "Yellow"];
const availableAges = ["0-2 Years", "3-5 Years", "6-8 Years", "9-12 Years", "All Ages"];
const availableWashable = ["Yes", "No"];
const dimensionsList = ["20x15x10 cm", "30x20x15 cm", "50x30x20 cm", "100x50x40 cm", "40x25x20 cm", "15x10x5 cm"];

const generateSoftToys = () => {
    const products = [];
    let idCounter = 1;

    for (const t of softToyTypes) {
        // Generate 4 products per type to get 40 total
        for (let i = 0; i < 4; i++) {
            const brand = softToyBrands[Math.floor(Math.random() * softToyBrands.length)];
            const ageGroup = availableAges[Math.floor(Math.random() * availableAges.length)];
            const material = t.materials[Math.floor(Math.random() * t.materials.length)];
            const size = t.sizes[Math.floor(Math.random() * t.sizes.length)];
            const color = availableColors[Math.floor(Math.random() * availableColors.length)];
            const washable = availableWashable[Math.floor(Math.random() * availableWashable.length)];
            const dimensions = dimensionsList[Math.floor(Math.random() * dimensionsList.length)];
            
            const name = `${brand} Premium ${color} ${t.type} - ${size}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            const price = 250 + Math.floor(Math.random() * 2000);
            const originalPrice = Math.floor(price * 1.50); // 50% markup for discount
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            // Unsplash placeholder for soft toys
            const imageUrl = `https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 5000}`;

            products.push({
                name,
                slug,
                brand,
                description: `Experience the ultimate comfort with the ${brand} ${t.type}. Perfectly sized (${size}), made from high-quality ${material}. Designed for ages: ${ageGroup}. ${washable === 'Yes' ? 'Machine washable for easy care.' : 'Surface washable only.'} Bring joy to your loved ones!`,
                category: "Family Essentials",
                subcategory: "Toys & Kids Essentials",
                section: "Kids Essentials",
                type: t.type,
                material,
                size,
                ageGroup,
                washable,
                dimensions,
                colors: [color],
                image: imageUrl,
                images: [imageUrl, imageUrl],
                price,
                originalPrice,
                discount,
                stock: 15 + Math.floor(Math.random() * 50),
                rating: 4.0 + (Math.random() * 1.0),
                ratingsCount: 30 + Math.floor(Math.random() * 200),
                featured: i % 2 === 0,
                trending: i % 3 === 0,
                highlights: [
                    `Size: ${size}`,
                    `Material: ${material}`,
                    `Washable: ${washable}`,
                    `Dimensions: ${dimensions}`
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

        const targetTypes = softToyTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Family Essentials", 
            subcategory: "Toys & Kids Essentials",
            section: "Kids Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing Soft Toy products cleared.`);

        const toyProducts = generateSoftToys();
        await Product.insertMany(toyProducts);
        console.log(`🌱 ${toyProducts.length} Soft Toy products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
