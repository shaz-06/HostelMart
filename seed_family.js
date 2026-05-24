const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const familyBrands = ["Johnson’s Baby", "Pampers", "Huggies", "Dove", "Colgate", "Dettol", "Harpic", "Vim", "Lizol", "Whisper", "Surf Excel", "Ariel", "Mamaearth", "Himalaya"];

const familyTypes = [
    {
        type: "Baby Care",
        items: ["Baby Diapers", "Baby Wipes", "Baby Powder", "Baby Lotion", "Baby Shampoo"],
        brands: ["Johnson’s Baby", "Pampers", "Huggies", "Mamaearth", "Himalaya"],
        usages: ["Baby Hygiene", "Baby Skin Care", "Daily Care"],
        quantities: ["1 Pack", "2 Pack Combo", "50 Wipes", "100 Wipes", "200ml", "400g"],
        fragrances: ["Mild", "Lavender", "Aloe Vera", "Unscented"]
    },
    {
        type: "Personal Care",
        items: ["Toothbrushes", "Toothpaste", "Soaps", "Shampoo", "Sanitary Pads"],
        brands: ["Colgate", "Dove", "Dettol", "Whisper", "Himalaya"],
        usages: ["Oral Care", "Body Wash", "Hair Care", "Feminine Hygiene"],
        quantities: ["1 Unit", "Pack of 3", "Pack of 6", "150g", "400ml", "XL Pack"],
        fragrances: ["Fresh", "Rose", "Sandalwood", "Mint"]
    },
    {
        type: "Household Essentials",
        items: ["Tissue Papers", "Garbage Bags", "Air Fresheners", "Mosquito Repellents", "Hand Wash"],
        brands: ["Dettol", "Lizol", "Harpic", "Colin"],
        usages: ["Cleaning", "Waste Management", "Home Hygiene", "Insect Repellent"],
        quantities: ["1 Pack", "Box of 100", "Roll of 30", "200ml", "Refill Pack"],
        fragrances: ["Lemon", "Lavender", "Jasmine", "Pine"]
    },
    {
        type: "Kitchen Daily Use",
        items: ["Aluminum Foil", "Cling Wrap", "Tissue Rolls", "Dish Wash Liquids", "Sponge Scrubbers"],
        brands: ["Vim", "Scotch-Brite", "Gala"],
        usages: ["Food Storage", "Kitchen Cleaning", "Dish Washing"],
        quantities: ["9 Meters", "25 Meters", "Pack of 2", "500ml", "1L"],
        fragrances: ["Lemon", "Aloe Vera", "Unscented"]
    }
];

const generateFamilyProducts = () => {
    const products = [];
    let idCounter = 1;

    for (const categoryData of familyTypes) {
        // Generate 20 products per type to get 80 total
        for (let i = 0; i < 20; i++) {
            const item = categoryData.items[Math.floor(Math.random() * categoryData.items.length)];
            const brand = categoryData.brands[Math.floor(Math.random() * categoryData.brands.length)];
            const usage = categoryData.usages[Math.floor(Math.random() * categoryData.usages.length)];
            const quantity = categoryData.quantities[Math.floor(Math.random() * categoryData.quantities.length)];
            const fragrance = categoryData.fragrances[Math.floor(Math.random() * categoryData.fragrances.length)];
            
            const name = `${brand} ${item} - ${quantity}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            const price = 50 + Math.floor(Math.random() * 800);
            const originalPrice = Math.floor(price * 1.25);
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `Essential ${item} from ${brand}. Highly effective for ${usage}. Provides hygiene and convenience for your entire family.`,
                category: "Daily Needs",
                subcategory: "Family Essentials",
                section: "Daily Essentials",
                type: categoryData.type,
                usage,
                quantity,
                fragrance,
                ingredients: ["Safe Ingredients", "Clinically Tested", "Hypoallergenic"],
                expiryDate: "24 Months from Manufacture",
                image: `https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 500}`,
                images: [`https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 500}`],
                price,
                originalPrice,
                discount,
                stock: 50 + Math.floor(Math.random() * 250),
                rating: 4.0 + (Math.random() * 1.0),
                ratingsCount: 100 + Math.floor(Math.random() * 3000),
                featured: i % 4 === 0,
                trending: i % 6 === 0,
                highlights: [
                    "Dermatologically Tested",
                    "Daily Essential",
                    "Trusted Brand",
                    "Family Pack"
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

        const targetTypes = familyTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Daily Needs", 
            subcategory: "Family Essentials", 
            section: "Daily Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing family essential products cleared.`);

        const familyProducts = generateFamilyProducts();
        await Product.insertMany(familyProducts);
        console.log(`🌱 ${familyProducts.length} Family Essential products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
