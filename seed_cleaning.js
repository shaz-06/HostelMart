const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const cleaningBrands = ["Lizol", "Harpic", "Surf Excel", "Ariel", "Vim", "Scotch-Brite", "Gala", "Colin", "Domex", "Wheel"];

const cleaningTypes = [
    {
        type: "Floor Cleaners",
        items: ["Phenyl Cleaner", "Disinfectant Floor Cleaner", "Floral Floor Cleaner", "Lemon Floor Cleaner", "Herbal Floor Cleaner"],
        brands: ["Lizol", "Colin", "Domex", "Harpic"],
        usages: ["Floor Cleaning", "Bathroom Cleaning"],
        fragrances: ["Pine", "Floral", "Lemon", "Lavender", "Neem"],
        quantities: ["500ml", "1L", "2L", "5L"],
        materials: []
    },
    {
        type: "Detergents",
        items: ["Washing Powder", "Liquid Detergent", "Detergent Bar", "Fabric Conditioner", "Laundry Liquid"],
        brands: ["Surf Excel", "Ariel", "Wheel", "Vim"],
        usages: ["Laundry"],
        fragrances: ["Fresh", "Lavender", "Rose", "Lemon"],
        quantities: ["500g", "1kg", "2kg", "5kg", "1L", "2L"],
        materials: []
    },
    {
        type: "Brushes",
        items: ["Toilet Brush", "Scrub Brush", "Multi-Purpose Cleaning Brush", "Bottle Cleaning Brush", "Shoe Cleaning Brush"],
        brands: ["Scotch-Brite", "Gala", "Vim"],
        usages: ["Toilet Cleaning", "Multi-Purpose", "Kitchen Cleaning", "Bottle Cleaning", "Shoe Cleaning"],
        fragrances: [],
        quantities: ["1 Pack", "Combo of 2", "Combo of 3"],
        materials: ["Plastic", "Nylon", "Wood"]
    },
    {
        type: "Mops",
        items: ["Spin Mop", "Spray Mop", "Cotton Mop", "Flat Mop", "Bucket Mop Set"],
        brands: ["Gala", "Scotch-Brite"],
        usages: ["Floor Cleaning", "Multi-Purpose"],
        fragrances: [],
        quantities: ["1 Set"],
        materials: ["Cotton", "Microfiber", "Plastic", "Stainless Steel"]
    }
];

const generateCleaningProducts = () => {
    const products = [];
    let idCounter = 1;

    for (const categoryData of cleaningTypes) {
        // Generate 15 products per type to get 60 total
        for (let i = 0; i < 15; i++) {
            const item = categoryData.items[Math.floor(Math.random() * categoryData.items.length)];
            const brand = categoryData.brands[Math.floor(Math.random() * categoryData.brands.length)];
            const usage = categoryData.usages[Math.floor(Math.random() * categoryData.usages.length)];
            const qty = categoryData.quantities[Math.floor(Math.random() * categoryData.quantities.length)];
            const fragrance = categoryData.fragrances.length > 0 ? categoryData.fragrances[Math.floor(Math.random() * categoryData.fragrances.length)] : undefined;
            const material = categoryData.materials.length > 0 ? categoryData.materials[Math.floor(Math.random() * categoryData.materials.length)] : undefined;
            
            const name = `${brand} ${item} - ${fragrance ? fragrance + ' - ' : ''}${qty}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            const price = 50 + Math.floor(Math.random() * 950);
            const originalPrice = Math.floor(price * 1.25);
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `High-quality ${item} from ${brand}. Highly effective for ${usage}. Provides a pristine and hygienic environment. Ideal for your daily cleaning needs.`,
                category: "Home",
                subcategory: "Home & Cleaning Essentials",
                section: "Daily Essentials",
                type: categoryData.type,
                usage,
                quantity: qty,
                volume: qty.includes('ml') || qty.includes('L') ? qty : undefined,
                weight: qty.includes('g') || qty.includes('kg') ? qty : undefined,
                fragrance,
                material,
                expiryDate: "24 Months from Manufacture",
                image: `https://images.unsplash.com/photo-1584820927498-cafe2c1c9b68?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 300}`,
                images: [`https://images.unsplash.com/photo-1584820927498-cafe2c1c9b68?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 300}`],
                price,
                originalPrice,
                discount,
                stock: 30 + Math.floor(Math.random() * 300),
                rating: 4.0 + (Math.random() * 1.0),
                ratingsCount: 50 + Math.floor(Math.random() * 2000),
                featured: i % 4 === 0,
                trending: i % 6 === 0,
                highlights: [
                    "Tough on Stains",
                    "Kills 99.9% Germs",
                    "Trusted Brand",
                    "Long Lasting"
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

        const deleted = await Product.deleteMany({ 
            subcategory: "Home & Cleaning Essentials", 
            section: "Daily Essentials"
        });
        console.log(`🗑️ ${deleted.deletedCount} existing cleaning products cleared.`);

        const cleaningProducts = generateCleaningProducts();
        await Product.insertMany(cleaningProducts);
        console.log(`🌱 ${cleaningProducts.length} Cleaning products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
