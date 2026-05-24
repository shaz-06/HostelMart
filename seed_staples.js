const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const brands = ["Aashirvaad", "Fortune", "Tata", "India Gate", "Daawat", "Everest", "MDH", "Catch", "Dhampur", "Organic India"];

const stapleTypes = [
    { type: "Rice", items: ["Basmati Rice", "Sona Masoori Rice", "Brown Rice", "Steam Rice", "Mini Rice Packs"], brands: ["India Gate", "Daawat", "Fortune", "Tata"], weights: ["1kg", "5kg", "10kg", "25kg"] },
    { type: "Cooking Oil", items: ["Sunflower Oil", "Groundnut Oil", "Mustard Oil", "Rice Bran Oil", "Olive Oil"], brands: ["Fortune", "Aashirvaad", "Tata"], weights: ["500ml", "1L", "2L", "5L"] },
    { type: "Spices", items: ["Turmeric Powder", "Chilli Powder", "Garam Masala", "Coriander Powder", "Pepper Powder", "Mixed Spice Packs"], brands: ["Everest", "MDH", "Catch", "Tata"], weights: ["50g", "100g", "200g", "500g"] },
    { type: "Atta", items: ["Whole Wheat Atta", "Multigrain Atta", "Chakki Fresh Atta", "Organic Atta"], brands: ["Aashirvaad", "Fortune", "Organic India", "Tata"], weights: ["1kg", "5kg", "10kg"] },
    { type: "Sugar", items: ["White Sugar", "Brown Sugar", "Organic Sugar", "Sugar Cubes"], brands: ["Dhampur", "Tata", "Organic India"], weights: ["500g", "1kg", "5kg"] }
];

const generateStaples = () => {
    const products = [];
    let idCounter = 1;

    for (const categoryData of stapleTypes) {
        // Generate 15 products per type to get 75 total
        for (let i = 0; i < 15; i++) {
            const item = categoryData.items[Math.floor(Math.random() * categoryData.items.length)];
            const brand = categoryData.brands[Math.floor(Math.random() * categoryData.brands.length)];
            const weight = categoryData.weights[Math.floor(Math.random() * categoryData.weights.length)];
            
            const name = `${brand} ${item} - ${weight}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            const price = 50 + Math.floor(Math.random() * 800);
            const originalPrice = Math.floor(price * 1.25);
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `Premium quality ${item} from ${brand}. Pure, authentic, and carefully packed for freshness. Perfect for your daily cooking needs.`,
                category: "Home",
                subcategory: "Grocery & Snacks",
                section: "Daily Essentials",
                type: categoryData.type,
                weight,
                packSize: i % 4 === 0 ? "Combo Pack" : "Single Pack",
                ingredients: ["100% Natural"],
                expiryDate: "12 Months from Packaging",
                dietaryType: "Vegetarian",
                image: `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 200}`,
                images: [`https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 200}`],
                price,
                originalPrice,
                discount,
                stock: 50 + Math.floor(Math.random() * 200),
                rating: 4.0 + (Math.random() * 1.0),
                ratingsCount: 100 + Math.floor(Math.random() * 1000),
                featured: i % 5 === 0,
                trending: i % 7 === 0,
                highlights: [
                    "High Quality",
                    "Authentic Taste",
                    "Pure & Natural",
                    "Value for Money"
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

        const targetTypes = stapleTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            subcategory: "Grocery & Snacks", 
            section: "Daily Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing staple products cleared.`);

        const staples = generateStaples();
        await Product.insertMany(staples);
        console.log(`🌱 ${staples.length} Staple products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
