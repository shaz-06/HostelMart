const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const healthDrinkBrands = ["Horlicks", "Boost", "Bournvita", "Complan", "Pediasure", "Ensure", "Protinex", "Glucon-D", "Herbalife", "Fast&Up"];

const healthDrinkTypes = [
    {
        type: "Protein Drinks",
        brands: ["Protinex", "Herbalife", "Fast&Up", "Ensure"],
        flavors: ["Chocolate", "Vanilla", "Strawberry"],
        weights: ["400g", "500g", "1kg"],
        dietaryTypes: ["Vegetarian", "Vegan"]
    },
    {
        type: "Energy Drinks",
        brands: ["Glucon-D", "Fast&Up", "Boost"],
        flavors: ["Orange", "Lemon", "Regular"],
        weights: ["200g", "400g", "1kg"],
        dietaryTypes: ["Vegetarian"]
    },
    {
        type: "Malt-Based Health Drinks",
        brands: ["Horlicks", "Boost", "Bournvita"],
        flavors: ["Classic Malt", "Chocolate", "Elaichi"],
        weights: ["500g", "750g", "1kg"],
        dietaryTypes: ["Vegetarian"]
    },
    {
        type: "Kids Health Drinks",
        brands: ["Pediasure", "Horlicks", "Complan", "Bournvita"],
        flavors: ["Chocolate", "Vanilla", "Kesar Badam"],
        weights: ["400g", "500g"],
        dietaryTypes: ["Vegetarian"]
    },
    {
        type: "Sugar-Free Health Drinks",
        brands: ["Ensure", "Protinex", "Horlicks"],
        flavors: ["Vanilla", "Chocolate"],
        weights: ["400g"],
        dietaryTypes: ["Vegetarian", "Diabetic Friendly"]
    }
];

const generateHealthDrinks = () => {
    const products = [];
    let idCounter = 1;

    for (const categoryData of healthDrinkTypes) {
        // Generate 8 products per type to get 40 total (exceeds min 35)
        for (let i = 0; i < 8; i++) {
            const brand = categoryData.brands[Math.floor(Math.random() * categoryData.brands.length)];
            const flavor = categoryData.flavors[Math.floor(Math.random() * categoryData.flavors.length)];
            const weight = categoryData.weights[Math.floor(Math.random() * categoryData.weights.length)];
            const dietaryType = categoryData.dietaryTypes[Math.floor(Math.random() * categoryData.dietaryTypes.length)];
            
            const name = `${brand} ${categoryData.type} - ${flavor} (${weight})`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            const price = 150 + Math.floor(Math.random() * 850);
            const originalPrice = Math.floor(price * 1.15);
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `Nutritious ${categoryData.type} from ${brand}. Delicious ${flavor} flavor packed with essential vitamins and minerals for your daily health needs.`,
                category: "Daily Needs",
                subcategory: "Grocery & Snacks",
                section: "Daily Essentials",
                type: categoryData.type,
                flavor,
                weight,
                dietaryType,
                ingredients: ["Malt Extract", "Vitamins", "Minerals", "Milk Solids"],
                expiryDate: "18 Months from Manufacture",
                image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 600}`,
                images: [`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 600}`],
                price,
                originalPrice,
                discount,
                stock: 30 + Math.floor(Math.random() * 100),
                rating: 4.1 + (Math.random() * 0.9),
                ratingsCount: 150 + Math.floor(Math.random() * 4000),
                featured: i % 3 === 0,
                trending: i % 4 === 0,
                highlights: [
                    "Rich in Protein",
                    "Added Vitamins & Minerals",
                    "Immunity Booster",
                    "Clinically Proven"
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

        const targetTypes = healthDrinkTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Daily Needs", 
            subcategory: "Grocery & Snacks", 
            section: "Daily Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing health drink products cleared.`);

        const healthDrinks = generateHealthDrinks();
        await Product.insertMany(healthDrinks);
        console.log(`🌱 ${healthDrinks.length} Health Drink products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
