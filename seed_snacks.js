const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brands = ["Maggi", "Lay’s", "Kurkure", "Oreo", "Parle", "Britannia", "Coca-Cola", "Pepsi", "Red Bull", "Haldiram’s", "Cadbury", "Sunfeast"];

const productTypes = [
    { type: "Instant Noodles", sub: "Snacks", brands: ["Maggi", "Sunfeast"], flavors: ["Masala", "Tomato", "Atta Masala", "Cheesy"], weights: ["70g", "280g", "420g"] },
    { type: "Chips", sub: "Snacks", brands: ["Lay’s", "Kurkure"], flavors: ["Magic Masala", "Spanish Tomato", "Classic Salted", "Chilli Chatka"], weights: ["30g", "50g", "90g"] },
    { type: "Biscuits", sub: "Snacks", brands: ["Parle", "Britannia", "Sunfeast", "Oreo"], flavors: ["Glucose", "Chocolate", "Cream", "Marie", "Butter"], weights: ["100g", "200g", "400g"] },
    { type: "Chocolates", sub: "Snacks", brands: ["Cadbury"], flavors: ["Milk Chocolate", "Fruit & Nut", "Dark", "Caramel"], weights: ["15g", "40g", "100g"] },
    { type: "Cold Drinks", sub: "Snacks", brands: ["Coca-Cola", "Pepsi"], flavors: ["Classic", "Zero Sugar", "Diet", "Lemon"], weights: ["250ml", "600ml", "1.25L", "2L"] },
    { type: "Energy Drinks", sub: "Snacks", brands: ["Red Bull"], flavors: ["Original", "Sugarfree", "Tropical"], weights: ["250ml"] },
    { type: "Cookies", sub: "Snacks", brands: ["Britannia", "Sunfeast", "Oreo"], flavors: ["Choco Chip", "Butter", "Oatmeal"], weights: ["150g", "250g"] },
    { type: "Namkeen", sub: "Snacks", brands: ["Haldiram’s"], flavors: ["Aloo Bhujia", "Bhel Puri", "Moong Dal", "Khatta Meetha"], weights: ["150g", "400g", "1kg"] },
    { type: "Cup Noodles", sub: "Snacks", brands: ["Maggi"], flavors: ["Cuppa Masala", "Chilli Chow"], weights: ["70g"] },
    { type: "Popcorn", sub: "Snacks", brands: ["Haldiram’s"], flavors: ["Cheese", "Caramel", "Salted"], weights: ["50g", "100g"] },
    { type: "Protein Bars", sub: "Snacks", brands: ["Sunfeast"], flavors: ["Berry", "Chocolate", "Nutty"], weights: ["40g", "60g"] },
    { type: "Juices", sub: "Snacks", brands: ["Britannia"], flavors: ["Mixed Fruit", "Orange", "Apple"], weights: ["200ml", "1L"] },
    { type: "Dry Fruits", sub: "Snacks", brands: ["Haldiram’s"], flavors: ["Roasted Cashew", "Salted Almond", "Raisins"], weights: ["100g", "250g"] },
    { type: "Candy", sub: "Snacks", brands: ["Parle"], flavors: ["Kaccha Mango", "Poppins", "Coffee Bite"], weights: ["50g", "200g"] },
    { type: "Ready-to-Eat Snacks", sub: "Snacks", brands: ["Haldiram’s", "Maggi"], flavors: ["Poha", "Upma", "Dal Makhani"], weights: ["80g", "300g"] }
];

const dietaryTypes = ["Veg", "Non-Veg", "Vegan", "Gluten-Free"];

const snackImages = [
    "https://images.unsplash.com/photo-1599490659223-eb53957bd35b?q=80&w=800&auto=format&fit=crop", // Noodles
    "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=800&auto=format&fit=crop", // Chips
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop", // Biscuits
    "https://images.unsplash.com/photo-1582208993918-28f0ca49aa92?q=80&w=800&auto=format&fit=crop", // Chocolate
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop", // Soda
    "https://images.unsplash.com/photo-1499336315816-097655dcfbda?q=80&w=800&auto=format&fit=crop", // Popcorn
    "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop", // Cookies
    "https://images.unsplash.com/photo-1621939514649-280e2ee9d460?q=80&w=800&auto=format&fit=crop"  // Snack mix
];

const generateSnacks = () => {
    const products = [];
    for (let i = 1; i <= 90; i++) {
        const typeData = productTypes[Math.floor(Math.random() * productTypes.length)];
        const brand = typeData.brands[Math.floor(Math.random() * typeData.brands.length)];
        const flavor = typeData.flavors[Math.floor(Math.random() * typeData.flavors.length)];
        const weight = typeData.weights[Math.floor(Math.random() * typeData.weights.length)];
        
        const name = `${brand} ${flavor} ${typeData.type} ${weight}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const basePrice = typeData.type.includes("Noodles") ? 20 : 
                         typeData.type.includes("Drink") ? 40 : 
                         typeData.type.includes("Chocolate") ? 10 : 30;
                         
        const priceMultiplier = weight.includes("kg") ? 10 : weight.includes("L") ? 5 : weight.includes("400g") ? 3 : 1;
        const price = Math.floor((basePrice * priceMultiplier) + Math.random() * 20);
        const originalPrice = Math.floor(price * (1.1 + Math.random() * 0.3));
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const image = snackImages[Math.floor(Math.random() * snackImages.length)];
        const dietary = (typeData.type.includes("Noodles") && flavor.includes("Atta")) ? "Veg" : dietaryTypes[0]; // Mostly Veg for Indian snacks
        
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 6 + Math.floor(Math.random() * 6));

        products.push({
            name,
            slug,
            brand,
            description: `Crunch into the delightful ${flavor} flavor of ${brand} ${typeData.type}. Perfect for those late-night hostel cravings or a quick break. Made with high-quality ingredients to satisfy your hunger instantly.`,
            category: "Food",
            subcategory: "Snacks",
            section: "Late Night Cravings",
            type: typeData.type,
            flavor,
            weight,
            packSize: i % 5 === 0 ? "Pack of 12" : "Single Pack",
            dietaryType: dietary,
            expiryDate: expiry.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            image: image,
            images: [image, snackImages[(Math.floor(Math.random() * snackImages.length))]],
            price,
            originalPrice,
            discount,
            stock: 50 + Math.floor(Math.random() * 500),
            rating: 4.2 + (Math.random() * 0.8),
            ratingsCount: 100 + Math.floor(Math.random() * 5000),
            featured: i % 10 === 0,
            trending: i % 7 === 0,
            highlights: [
                `Authentic ${flavor} Taste`,
                `${dietary} Friendly`,
                "Ready in Minutes",
                "Value Pack",
                "Travel Friendly Packaging"
            ],
            specifications: {
                "Net Weight": weight,
                "Shelf Life": "9 Months",
                "Storage": "Store in a cool and dry place",
                "Ingredients": "Refined wheat flour, Palm oil, Spices and Condiments"
            },
            createdAt: new Date()
        });
    }
    return products;
};

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const deleted = await Product.deleteMany({ section: "Late Night Cravings" });
        console.log(`🗑️ ${deleted.deletedCount} existing late night craving products cleared.`);

        const snacks = generateSnacks();
        await Product.insertMany(snacks);
        console.log(`🌱 ${snacks.length} Food & Snack products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
