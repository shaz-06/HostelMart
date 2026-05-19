const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Review = require('./models/Review');

dotenv.config({ path: '.env.local' });

async function seedRichData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");

        const products = await Product.find({});
        console.log(`Found ${products.length} products to update.`);

        for (let p of products) {
            // Update with rich data if not already present
            const updates = {
                images: [
                    p.image,
                    "https://images.unsplash.com/photo-1594235041071-79942790906d?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=800&q=80"
                ],
                highlights: [
                    "Premium Quality Material",
                    "Durable & Long Lasting",
                    "Specially Designed for Hostel Rooms",
                    "Space Saving Foldable Design",
                    "Rust Proof & Easy to Clean"
                ],
                specifications: {
                    "Brand": p.brand || "HostelMart",
                    "Model Name": p.name.split(' ')[0],
                    "Material": p.material || "High Grade Plastic",
                    "Weight": "450g",
                    "Dimensions": "40 x 20 x 10 cm",
                    "Warranty": "6 Months Domestic Warranty"
                },
                ratingsCount: Math.floor(Math.random() * 5000) + 100,
                deliveryDays: Math.floor(Math.random() * 3) + 1,
                returnPolicy: "10 Days Easy Return Policy",
                seller: {
                    name: "HostelMart Retail Pvt Ltd",
                    rating: 4.8,
                    isVerified: true
                }
            };

            await Product.findByIdAndUpdate(p._id, updates);
            
            // Seed some reviews for each product
            const reviewCount = Math.floor(Math.random() * 5) + 2;
            const reviewData = [];
            const comments = [
                "Absolutely amazing product! Fits perfectly in my small hostel cupboard.",
                "Very sturdy and high quality. Worth every penny.",
                "Fast delivery. The material is better than expected.",
                "Good product, but the color was slightly different than the picture.",
                "Life saver for hostelites! Highly recommended.",
                "Great value for money. Using it daily now."
            ];
            const users = ["Rahul Sharma", "Sneha Kapoor", "Amit Patel", "Priya Singh", "Anjali Verma", "Vikram Rathore"];

            for (let i = 0; i < reviewCount; i++) {
                reviewData.push({
                    productId: p._id,
                    userName: users[Math.floor(Math.random() * users.length)],
                    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
                    comment: comments[Math.floor(Math.random() * comments.length)],
                    verifiedPurchase: true,
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
                });
            }
            
            // Clear old reviews and insert new ones
            await Review.deleteMany({ productId: p._id });
            await Review.insertMany(reviewData);
        }

        console.log("✅ Rich data and reviews seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedRichData();
