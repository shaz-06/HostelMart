const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const brands = ["Aashirvaad", "Tata", "Fortune", "Surf Excel", "Britannia", "Haldiram’s", "Bru", "Nescafé", "Kellogg’s", "MTR", "Saffola", "Maggi", "Parle-G", "Sunfeast", "Everest", "MDH"];
const groceryTypes = [
    { type: "Rice", brands: ["Tata", "Fortune", "India Gate"], dietary: "Vegetarian", weight: ["1kg", "5kg", "10kg"] },
    { type: "Atta", brands: ["Aashirvaad", "Fortune", "Shakti Bhog"], dietary: "Vegetarian", weight: ["1kg", "5kg", "10kg"] },
    { type: "Cooking Oil", brands: ["Fortune", "Saffola", "Dhara"], dietary: "Vegetarian", weight: ["1L", "2L", "5L"] },
    { type: "Sugar", brands: ["Tata", "Madhur"], dietary: "Vegetarian", weight: ["500g", "1kg"] },
    { type: "Salt", brands: ["Tata", "Aashirvaad"], dietary: "Vegetarian", weight: ["1kg"] },
    { type: "Tea Powder", brands: ["Tata Tea", "Red Label", "Taj Mahal"], dietary: "Vegetarian", weight: ["250g", "500g"] },
    { type: "Coffee Powder", brands: ["Bru", "Nescafé", "Continental"], dietary: "Vegetarian", weight: ["50g", "100g", "200g"] },
    { type: "Spices", brands: ["Everest", "MDH", "Catch"], dietary: "Vegetarian", weight: ["50g", "100g"] },
    { type: "Dal & Pulses", brands: ["Tata Sampann", "Fortune"], dietary: "Vegetarian", weight: ["500g", "1kg"] },
    { type: "Dry Fruits", brands: ["Tata Sampann", "Happilo"], dietary: "Vegetarian", weight: ["200g", "500g"] },
    { type: "Instant Mixes", brands: ["MTR", "Gits"], dietary: "Vegetarian", weight: ["200g", "500g"] },
    { type: "Breakfast Cereals", brands: ["Kellogg’s", "Bagrry's"], dietary: "Vegetarian", weight: ["400g", "1kg"] },
    { type: "Biscuits", brands: ["Britannia", "Parle-G", "Sunfeast"], dietary: "Vegetarian", weight: ["100g", "200g", "500g"] },
    { type: "Snacks", brands: ["Haldiram’s", "Bikaji", "Lay's"], dietary: "Vegetarian", weight: ["150g", "400g"] },
    { type: "Ready-to-Cook Products", brands: ["Maggi", "MTR", "Yippee"], dietary: "Vegetarian", weight: ["70g", "280g"] }
];

const generateGroceries = () => {
    const products = [];
    for (let i = 1; i <= 75; i++) {
        const categoryData = groceryTypes[i % groceryTypes.length];
        const brand = categoryData.brands[Math.floor(Math.random() * categoryData.brands.length)];
        const weight = categoryData.weight[Math.floor(Math.random() * categoryData.weight.length)];
        
        const name = `${brand} ${categoryData.type} - ${weight}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const price = 20 + Math.floor(Math.random() * 1200);
        const originalPrice = Math.floor(price * 1.2);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

        products.push({
            name,
            slug,
            brand,
            description: `High-quality ${categoryData.type} from ${brand}. Pure, fresh, and carefully packed to retain its natural goodness. Ideal for your daily nutritional needs. Trusted by millions of households for superior quality and taste.`,
            category: "Daily Needs",
            subcategory: "Grocery & Snacks",
            section: "Daily Essentials",
            type: categoryData.type,
            weight,
            packSize: i % 5 === 0 ? "Combo Pack" : "Single Unit",
            ingredients: ["Natural Ingredients", "Added Nutrients"],
            expiryDate: "12 Months from Packaging",
            dietaryType: categoryData.dietary,
            image: `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80&sig=${i}`,
            images: [`https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80&sig=${i}`],
            price,
            originalPrice,
            discount,
            stock: 100 + Math.floor(Math.random() * 500),
            rating: 4.2 + (Math.random() * 0.7),
            ratingsCount: 500 + Math.floor(Math.random() * 5000),
            featured: i % 10 === 0,
            trending: i % 15 === 0,
            highlights: [
                "100% Original Product",
                "Fresh & Nutritious",
                "No Artificial Preservatives",
                "Carefully Sourced"
            ],
            createdAt: new Date()
        });
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const deleted = await Product.deleteMany({ subcategory: "Grocery & Snacks", section: "Daily Essentials" });
        console.log(`🗑️ ${deleted.deletedCount} existing grocery products cleared.`);

        const groceries = generateGroceries();
        await Product.insertMany(groceries);
        console.log(`🌱 ${groceries.length} Grocery products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
