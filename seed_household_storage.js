const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: '.env.local' });

const storageBrands = ["Home Puff", "IKEA", "Solimo", "Cello", "Nayasa", "Signoraware", "Tupperware", "Kuber Industries"];

const storageTypes = [
    {
        type: "Storage Boxes",
        materials: ["Plastic", "Fabric", "Canvas"],
        capacities: ["10L", "20L", "40L"],
        dimensions: ["Small", "Medium", "Large"],
        colors: ["Transparent", "Blue", "Grey", "Beige"]
    },
    {
        type: "Foldable Storage Bins",
        materials: ["Non-Woven", "Fabric", "Canvas"],
        capacities: ["20L", "40L"],
        dimensions: ["Medium", "Large"],
        colors: ["Grey", "Blue", "Black", "Beige"]
    },
    {
        type: "Clothes Organizers",
        materials: ["Non-Woven", "Mesh", "Fabric"],
        capacities: ["30L", "50L", "80L"],
        dimensions: ["Large", "Extra Large"],
        colors: ["Grey", "White", "Black"]
    },
    {
        type: "Shoe Racks",
        materials: ["Plastic", "Steel", "Bamboo"],
        capacities: ["10 Pairs", "20 Pairs"],
        dimensions: ["Medium", "Large"],
        colors: ["Black", "Grey", "White"]
    },
    {
        type: "Drawer Organizers",
        materials: ["Plastic", "Mesh", "Fabric"],
        capacities: ["N/A"],
        dimensions: ["Small", "Medium"],
        colors: ["White", "Grey", "Transparent"]
    },
    {
        type: "Under Bed Storage",
        materials: ["Canvas", "Plastic", "Non-Woven"],
        capacities: ["40L", "60L"],
        dimensions: ["Large", "Extra Large"],
        colors: ["Grey", "Blue", "Black"]
    },
    {
        type: "Plastic Storage Containers",
        materials: ["Plastic"],
        capacities: ["5L", "10L", "20L"],
        dimensions: ["Small", "Medium", "Large"],
        colors: ["Transparent", "Blue", "Red"]
    },
    {
        type: "Stackable Storage Units",
        materials: ["Plastic", "Steel"],
        capacities: ["20L", "40L"],
        dimensions: ["Medium", "Large"],
        colors: ["Transparent", "White", "Grey"]
    },
    {
        type: "Wardrobe Organizers",
        materials: ["Fabric", "Non-Woven"],
        capacities: ["20L", "40L"],
        dimensions: ["Medium", "Large"],
        colors: ["Grey", "Beige"]
    },
    {
        type: "Multipurpose Storage Baskets",
        materials: ["Plastic", "Bamboo"],
        capacities: ["10L", "20L"],
        dimensions: ["Small", "Medium"],
        colors: ["Blue", "White", "Grey", "Beige"]
    }
];

const generateStorageProducts = () => {
    const products = [];
    let idCounter = 1;

    for (const st of storageTypes) {
        // Generate 5 products per type to get 50 total (exceeds min 45)
        for (let i = 0; i < 5; i++) {
            const brand = storageBrands[Math.floor(Math.random() * storageBrands.length)];
            const material = st.materials[Math.floor(Math.random() * st.materials.length)];
            const capacity = st.capacities[Math.floor(Math.random() * st.capacities.length)];
            const dimensions = st.dimensions[Math.floor(Math.random() * st.dimensions.length)];
            const color = st.colors[Math.floor(Math.random() * st.colors.length)];
            
            const name = `${brand} ${st.type} - ${material} (${dimensions})`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idCounter;
            
            const price = 200 + Math.floor(Math.random() * 2500);
            const originalPrice = Math.floor(price * 1.30);
            const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;

            products.push({
                name,
                slug,
                brand,
                description: `High-quality ${st.type} by ${brand}. Made of durable ${material}. Ideal for organizing your room and saving space. Capacity: ${capacity}. Dimension: ${dimensions}. Color: ${color}.`,
                category: "Hostel & Student Essentials",
                subcategory: "Home & Storage Essentials",
                section: "Daily Use Essentials",
                type: st.type,
                material,
                capacity,
                dimensions,
                colors: [color],
                image: `https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 800}`,
                images: [`https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80&sig=${idCounter + 800}`],
                price,
                originalPrice,
                discount,
                stock: 15 + Math.floor(Math.random() * 100),
                rating: 4.0 + (Math.random() * 0.9),
                ratingsCount: 50 + Math.floor(Math.random() * 800),
                featured: i % 3 === 0,
                trending: i % 4 === 0,
                highlights: [
                    "Space Saving Design",
                    "Durable Material",
                    "Easy to Clean",
                    "Premium Brand Quality"
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

        const targetTypes = storageTypes.map(t => t.type);
        const deleted = await Product.deleteMany({ 
            category: "Hostel & Student Essentials", 
            subcategory: "Home & Storage Essentials",
            type: { $in: targetTypes } 
        });
        console.log(`🗑️ ${deleted.deletedCount} existing storage products cleared.`);

        const storageProducts = generateStorageProducts();
        await Product.insertMany(storageProducts);
        console.log(`🌱 ${storageProducts.length} Household Storage products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
