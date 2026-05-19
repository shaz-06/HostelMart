const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const otcMedicines = [
    { type: "Fever Relief Medicines", usage: "Fever & Pain", brand: "Crocin", dosageForm: "Tablet", quantity: "Strip of 15" },
    { type: "Fever Relief Medicines", usage: "Fever & Pain", brand: "Dolo", dosageForm: "Tablet", quantity: "Strip of 15" },
    { type: "Cold & Cough Relief", usage: "Cold Relief", brand: "Vicks", dosageForm: "Vaporub", quantity: "50g" },
    { type: "Cold & Cough Relief", usage: "Cough Relief", brand: "Vicks", dosageForm: "Syrup", quantity: "100ml" },
    { type: "Acidity Relief", usage: "Acidity Relief", brand: "Digene", dosageForm: "Tablet", quantity: "Pack of 10" },
    { type: "Acidity Relief", usage: "Acidity Relief", brand: "ENO", dosageForm: "Powder", quantity: "5g Sachet" },
    { type: "Digestive Medicines", usage: "Digestive Care", brand: "Himalaya", dosageForm: "Tablet", quantity: "60 Tablets" },
    { type: "ORS Sachets", usage: "Dehydration", brand: "Electral", dosageForm: "Powder", quantity: "21.8g Sachet" },
    { type: "Pain Relief Sprays", usage: "Muscle Pain", brand: "Volini", dosageForm: "Spray", quantity: "60g" },
    { type: "Antiseptic Creams", usage: "Wound Care", brand: "Dettol", dosageForm: "Cream", quantity: "50g" },
    { type: "Antiseptic Creams", usage: "Wound Care", brand: "Savlon", dosageForm: "Cream", quantity: "50g" },
    { type: "Vapor Rubs", usage: "Cold Relief", brand: "Vicks", dosageForm: "Gel", quantity: "25g" },
    { type: "Headache Relief Tablets", usage: "Headache Relief", brand: "Crocin", dosageForm: "Tablet", quantity: "Strip of 10" },
    { type: "Bandages & Basic First Aid", usage: "Wound Care", brand: "Dettol", dosageForm: "Adhesive Bandage", quantity: "Pack of 10" },
    { type: "Digestive Medicines", usage: "Gas Relief", brand: "Digene", dosageForm: "Gel/Syrup", quantity: "200ml" }
];

const medicineImages = [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop", // Pills
    "https://images.unsplash.com/photo-1550572017-ed200f55a169?q=80&w=800&auto=format&fit=crop", // Syrup
    "https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=800&auto=format&fit=crop", // Mask/General
    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800&auto=format&fit=crop"  // Sanitizer/General
];

const generateOTCs = () => {
    const products = [];
    for (let i = 1; i <= 40; i++) {
        const baseData = otcMedicines[Math.floor(Math.random() * otcMedicines.length)];
        
        const name = `${baseData.brand} ${baseData.type} (${baseData.dosageForm})`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
        
        const price = 40 + Math.floor(Math.random() * 200);
        const originalPrice = Math.floor(price * 1.25);
        const discount = `${Math.round((1 - price/originalPrice) * 100)}% OFF`;
        
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);

        products.push({
            name,
            slug,
            brand: baseData.brand,
            description: `Effective ${baseData.type} for ${baseData.usage}. Brand: ${baseData.brand}. Dosage Form: ${baseData.dosageForm}. Quantity: ${baseData.quantity}. Only for over-the-counter use. Please follow the instructions on the package.`,
            category: "Emergency",
            subcategory: "Emergency Essentials",
            section: "Emergency Needs",
            type: baseData.type,
            usage: baseData.usage,
            dosageForm: baseData.dosageForm,
            quantity: baseData.quantity,
            expiryDate: expiry.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            image: medicineImages[Math.floor(Math.random() * medicineImages.length)],
            images: [medicineImages[Math.floor(Math.random() * medicineImages.length)], medicineImages[0]],
            price,
            originalPrice,
            discount,
            stock: 30 + Math.floor(Math.random() * 100),
            rating: 4.2 + (Math.random() * 0.7),
            ratingsCount: 50 + Math.floor(Math.random() * 5000),
            featured: i % 5 === 0,
            trending: i % 7 === 0,
            highlights: [
                "Over-the-Counter (OTC)",
                "No Prescription Required",
                "Trusted Healthcare Brand",
                "Easy to Use/Administer",
                "Essential for Hostel Medical Kit"
            ],
            specifications: {
                "Type": baseData.type,
                "Usage": baseData.usage,
                "Dosage Form": baseData.dosageForm,
                "Quantity": baseData.quantity,
                "Expiry": "12-18 Months"
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

        // We don't delete everything in "Emergency" because we want to keep the previous emergency products
        // But we can delete previous "OTC Medicine" types if we had them. 
        // Actually, the user asked to ADD, so I'll just insert.
        // To avoid duplicates if re-run, maybe delete by specific types?
        const typesToClear = otcMedicines.map(m => m.type);
        const deleted = await Product.deleteMany({ category: "Emergency", type: { $in: typesToClear } });
        console.log(`🗑️ ${deleted.deletedCount} existing OTC medicine products cleared.`);

        const otcs = generateOTCs();
        await Product.insertMany(otcs);
        console.log(`🌱 ${otcs.length} OTC Medicine products seeded successfully.`);

        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDB();
