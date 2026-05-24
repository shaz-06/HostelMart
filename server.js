const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });
const { verifyToken, verifyAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection & Models
const connectDB = require('./lib/mongodb');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');
const Review = require('./models/Review');

// Connect to Database and Auto-Seed if In-Memory Fallback is Active
connectDB().then(async () => {
    // Unconditionally seed premium boxers so they are guaranteed to exist in the database!
    console.log("🌱 Seeding Premium Men's Boxer collection unconditionally...");
    try {
        const { seedBoxersWithoutExit } = require('./seed_boxers');
        await seedBoxersWithoutExit();
    } catch (err) {
        console.error("❌ Men's Boxer seeding failed:", err.message);
    }

    if (global.isMockDB) {
        console.log("🌱 Local Mock Database Active! Automatically seeding 75 storage & organization products...");
        try {
            const { seedDBWithoutExit } = require('./seed_storage_and_organizers');
            await seedDBWithoutExit();
            console.log("✅ Dynamic storage & organization products auto-seeding completed successfully.");
        } catch (err) {
            console.error("❌ Storage auto-seeding failed:", err.message);
        }

        console.log("🌱 Seeding Premium Essentials products dynamically in Mock DB...");
        try {
            const { seedPremiumWithoutExit } = require('./seed_premium_products');
            await seedPremiumWithoutExit();
            console.log("✅ Premium Essentials auto-seeding completed successfully.");
        } catch (err) {
            console.error("❌ Premium auto-seeding failed:", err.message);
        }

        console.log("🌱 Seeding Furniture & Space Saving products dynamically in Mock DB...");
        try {
            const { seedFurnitureWithoutExit } = require('./seed_furniture_products');
            await seedFurnitureWithoutExit();
            console.log("✅ Furniture & Space Saving auto-seeding completed successfully.");
        } catch (err) {
            console.error("❌ Furniture auto-seeding failed:", err.message);
        }

        console.log("🌱 Seeding Classmate Notebook products dynamically in Mock DB...");
        try {
            const { seedNotebooksWithoutExit } = require('./seed_notebooks');
            await seedNotebooksWithoutExit();
            console.log("✅ Classmate Notebook products auto-seeding completed successfully.");
        } catch (err) {
            console.error("❌ Classmate Notebook auto-seeding failed:", err.message);
        }
    }
}).catch((err) => {
    console.error("❌ Critical database connection error:", err.message);
});

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const { db } = require('./firebase-admin-config');

// Middleware is now imported from ./middleware/auth.js

// --- AUTH APIs ---

app.post('/api/auth/login', async (req, res) => {
    console.log("Login Request Received:", req.body);
    const { name, phone } = req.body;
    if (!phone) {
        console.error("Login Error: Phone missing");
        return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    try {
        const userRef = db.collection('users').doc(phone);
        const doc = await userRef.get();

        let userData;
        const isAdmin = (phone === '6363849864' && (name === 'Admin' || !doc.exists));

        if (!doc.exists) {
            // Signup
            userData = {
                name: isAdmin ? 'Admin' : (name || 'Guest'),
                phone: phone,
                address: '',
                hostel: '',
                room: '',
                createdAt: new Date(),
                lastLogin: new Date(),
                role: isAdmin ? 'admin' : 'user'
            };
            await userRef.set(userData);
        } else {
            // Login
            userData = doc.data();
            // If it's our special admin phone, ensure they have the admin role
            if (isAdmin && userData.role !== 'admin') {
                userData.role = 'admin';
                await userRef.update({ role: 'admin' });
            }
            await userRef.update({ lastLogin: new Date() });
        }

        // Sync with MongoDB
        try {
            await connectDB();
            let mongoUser = await User.findOne({ phone });
            if (!mongoUser) {
                mongoUser = new User({
                    name: userData.name,
                    phone: userData.phone,
                    hostel: userData.hostel || '',
                    room: userData.room || '',
                    address: userData.address || ''
                });
                await mongoUser.save();
            } else {
                // Update MongoDB with latest Firestore data if needed
                mongoUser.name = userData.name;
                mongoUser.hostel = userData.hostel || mongoUser.hostel;
                mongoUser.room = userData.room || mongoUser.room;
                mongoUser.address = userData.address || mongoUser.address;
                await mongoUser.save();
            }
        } catch (mongoErr) {
            console.error("MongoDB Sync Error during login:", mongoErr);
        }

        let token;
        try {
            token = jwt.sign({ phone: userData.phone, name: userData.name, role: userData.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        } catch (jwtErr) {
            console.error("JWT Signing Error:", jwtErr);
            return res.status(500).json({ success: false, message: 'Token generation failed' });
        }

        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true, token, user: userData, redirect: isAdmin ? 'hostelmart-control-room.html' : null });
    } catch (error) {
        console.error("Login Server Error:", error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
    try {
        await connectDB();
        // Priority to MongoDB for profile details
        const mongoUser = await User.findOne({ phone: req.userPhone });
        
        // Fallback/Sync with Firestore
        const doc = await db.collection('users').doc(req.userPhone).get();
        const firestoreData = doc.exists ? doc.data() : {};

        if (!mongoUser && !doc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Return merged data, MongoDB taking precedence for profile
        const finalUser = {
            ...firestoreData,
            ...(mongoUser ? mongoUser.toObject() : {})
        };

        res.json({ success: true, user: finalUser });
    } catch (error) {
        console.error("Auth Me Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.patch('/api/auth/profile', verifyToken, async (req, res) => {
    const { name, address, hostel, room, addressType } = req.body;
    try {
        await connectDB();
        const updateData = {};
        if (name) updateData.name = name;
        if (address) updateData.address = address;
        if (hostel) updateData.hostel = hostel;
        if (room) updateData.room = room;
        if (addressType) updateData.addressType = addressType;

        // Update MongoDB
        const mongoUser = await User.findOneAndUpdate(
            { phone: req.userPhone },
            { $set: updateData },
            { new: true, upsert: true }
        );

        // Sync with Firestore
        await db.collection('users').doc(req.userPhone).update(updateData);

        res.json({ success: true, message: 'Profile updated successfully', user: mongoUser });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out' });
});

// --- ADMIN APIs ---

app.post('/api/admin/login', (req, res) => {
    const { userId, password } = req.body;
    if (userId === process.env.ADMIN_USER_ID && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ phone: 'admin', name: 'Admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ success: true, token, user: { name: 'Admin', role: 'admin' } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/api/admin/orders', verifyAdmin, async (req, res) => {
    try {
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Admin Orders Fetch Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.patch('/api/admin/orders/:id', verifyAdmin, async (req, res) => {
    const { status, deliveryStage } = req.body;
    try {
        await db.collection('orders').doc(req.params.id).update({
            trackingStatus: status,
            updatedAt: new Date()
        });
        res.json({ success: true, message: 'Order updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// --- USER ORDER APIs ---

app.get('/api/orders/track', async (req, res) => {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });
    try {
        await connectDB();
        let orders;
        if (phone === 'all') {
            orders = await Order.find({}).sort({ createdAt: -1 });
        } else {
            orders = await Order.find({ userId: phone }).sort({ createdAt: -1 });
        }
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Order Track Error:", error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    const orderData = req.body;
    if (!orderData.phone || !orderData.items) {
        return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    try {
        await connectDB();
        const newOrder = new Order({
            userId: orderData.phone,
            customerName: orderData.customerName,
            hostel: orderData.hostel,
            room: orderData.room,
            address: orderData.address,
            products: orderData.items.map(item => ({
                productId: item.slug || item.id || null,
                quantity: item.qty || 1,
                price: item.price,
                name: item.title || item.name,
                image: item.img || item.image,
                size: item.size || 'Free Size'
            })),
            totalAmount: orderData.totalAmount,
            paymentMethod: orderData.paymentMethod || 'COD',
            paymentStatus: orderData.paymentStatus || 'Pending',
            orderStatus: 'Processing',
            orderId: orderData.orderId // Optional, if you want to store the client-generated ID
        });

        await newOrder.save();
        res.json({ success: true, message: 'Order placed successfully', orderId: orderData.orderId });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ success: false, message: 'Failed to place order: ' + error.message });
    }
});

// Data helper functions
const getProducts = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8'));
const getCategories = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'categories.json'), 'utf8'));
const getBanners = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'banners.json'), 'utf8'));
const saveSubscription = (email) => {
    const subsPath = path.join(__dirname, 'data', 'subscriptions.json');
    const subs = JSON.parse(fs.readFileSync(subsPath, 'utf8'));
    if (!subs.includes(email)) {
        subs.push(email);
        fs.writeFileSync(subsPath, JSON.stringify(subs, null, 2));
        return true;
    }
    return false;
};

// API Routes
app.get('/api/products', async (req, res) => {
    try {
        await connectDB();
        const { category, subcategory, brand, sort, search } = req.query;
        let query = {};
        if (category) query.category = category;
        if (subcategory) {
            if (subcategory.includes(',')) {
                query.subcategory = { $in: subcategory.split(',') };
            } else {
                query.subcategory = subcategory;
            }
        }
        if (brand) query.brand = brand;
        if (req.query.section) {
            if (req.query.section.includes(',')) {
                query.section = { $in: req.query.section.split(',') };
            } else {
                query.section = req.query.section;
            }
        }
        if (req.query.slug) query.slug = req.query.slug;
        if (req.query.slugs) query.slug = { $in: req.query.slugs.split(',') };
        const searchVal = search || req.query.q;
        if (searchVal) {
            query.$or = [
                { name: { $regex: searchVal, $options: "i" } },
                { brand: { $regex: searchVal, $options: "i" } },
                { category: { $regex: searchVal, $options: "i" } },
                { subcategory: { $regex: searchVal, $options: "i" } }
            ];
        }

        let productQuery = Product.find(query);

        if (sort) {
            if (sort === 'price-low') productQuery = productQuery.sort({ price: 1 });
            else if (sort === 'price-high') productQuery = productQuery.sort({ price: -1 });
            else if (sort === 'newest') productQuery = productQuery.sort({ createdAt: -1 });
            else if (sort === 'popularity') productQuery = productQuery.sort({ rating: -1 });
        }

        const products = await productQuery;
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching products' });
    }
});

app.get('/api/products/search', async (req, res) => {
    try {
        await connectDB();
        const search = req.query.search || req.query.q;
        if (!search) return res.json([]);

        const products = await Product.find({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { subcategory: { $regex: search, $options: "i" } }
            ]
        }).limit(10); // Limit results for suggestions

        res.json(products);
    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).json({ success: false, message: 'Search failed' });
    }
});

app.get('/api/products/slug/:slug', async (req, res) => {
    try {
        await connectDB();
        const escapedSlug = req.params.slug.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const product = await Product.findOne({ slug: { $regex: new RegExp("^" + escapedSlug + "$", "i") } });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching product' });
    }
});

// Clean Product URL Route
app.get('/product/:slug', (req, res) => {
    // We serve the ProductDetail.html file which will handle fetching data based on the URL
    res.sendFile(path.join(__dirname, 'ProductDetail.html'));
});

app.get('/api/products/similar/:slug', async (req, res) => {
    try {
        await connectDB();
        const escapedSlug = req.params.slug.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const product = await Product.findOne({ slug: { $regex: new RegExp("^" + escapedSlug + "$", "i") } });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        const similarProducts = await Product.find({
            _id: { $ne: product._id },
            $or: [
                { category: product.category },
                { subcategory: product.subcategory },
                { brand: product.brand }
            ]
        }).limit(10);

        res.json(similarProducts);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching similar products' });
    }
});

app.get('/api/reviews/:productId', async (req, res) => {
    try {
        await connectDB();
        const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching reviews' });
    }
});

app.post('/api/reviews', async (req, res) => {
    try {
        await connectDB();
        const review = new Review(req.body);
        await review.save();
        
        // Update product rating (simple average logic or just increment count)
        const product = await Product.findById(req.body.productId);
        if (product) {
            const reviews = await Review.find({ productId: product._id });
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            product.rating = parseFloat(avgRating.toFixed(1));
            product.ratingsCount = reviews.length;
            await product.save();
        }

        res.status(201).json({ success: true, review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.get('/api/products/trending', async (req, res) => {
    try {
        await connectDB();
        const products = await Product.find({ trending: true }).limit(10);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching trending products' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        await connectDB();
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await connectDB();
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        await connectDB();
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        await connectDB();
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.get('/api/admin/stats', async (req, res) => {
    try {
        await connectDB();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        res.json({
            success: true,
            stats: {
                products: productCount,
                orders: orderCount,
                revenue: totalRevenue.toFixed(2)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;
    if (email) {
        saveSubscription(email);
        res.json({ success: true, message: 'Subscribed successfully!' });
    } else {
        res.status(400).json({ success: false, message: 'Email is required.' });
    }
});

// Server-Side Injection for index.html
app.get(['/', '/index.html'], async (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(html);

    // 1. Inject Products from MongoDB
    try {
        await connectDB();
        const products = await Product.find({}).limit(20); // Fetch top 20 for homepage
        const $productGrid = $('.product-grid');
        if ($productGrid.length > 0) {
            $productGrid.empty();
            products.forEach(product => {
                const ratingHtml = Array(5).fill(0).map((_, i) =>
                    `<ion-icon name="${i < (product.rating || 4) ? 'star' : 'star-outline'}"></ion-icon>`
                ).join('');

                const badgeHtml = product.discount ? `<span class="absolute top-4 left-4 bg-[#5D4037] text-[#F5F5DC] text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg">${product.discount}</span>` : '';
                const delHtml = product.originalPrice ? `<del class="text-xs text-gray-300 font-normal">₹${product.originalPrice.toLocaleString('en-IN')}</del>` : '';

                const productImage = product.image;
                const hoverImage = product.images?.[0] || product.image;

                const productHtml = `
              <div class="product-card bg-[#F5F5DC] border border-[#D7CCC8] rounded-3xl overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer" onclick="navigateToProduct('${product.slug}')">
                  <div class="relative aspect-[4/5] overflow-hidden">
                      <img src="${productImage}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                      <img src="${hoverImage}" alt="${product.name}" class="absolute inset-0 w-full h-full object-cover hover-img opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      ${badgeHtml}
                      <div class="absolute -right-16 top-4 group-hover:right-4 transition-all duration-300 flex flex-col gap-2">
                          <button class="bg-[#F5F5DC]/90 backdrop-blur p-2.5 rounded-xl shadow-lg hover:bg-[#5D4037] hover:text-[#F5F5DC] transition-all transform hover:scale-110 active:scale-90" 
                                  onclick="event.stopPropagation()"
                                  data-cart-action="add"
                                  data-mini="true"
                                  data-product-slug="${product.slug}"
                                  data-product-name="${product.name}"
                                  data-product-price="₹${product.price.toLocaleString('en-IN')}"
                                  data-product-image="${product.image}"
                                  data-product-brand="${product.brand || 'HostelMart'}">
                              <ion-icon name="cart-outline"></ion-icon>
                          </button>
                          <button class="bg-[#F5F5DC]/90 backdrop-blur p-2.5 rounded-xl shadow-lg hover:bg-[#5D4037] hover:text-[#F5F5DC] transition-all transform hover:scale-110 active:scale-90" onclick="event.stopPropagation()"><ion-icon name="eye-outline"></ion-icon></button>
                      </div>
                  </div>
                  <div class="p-4 sm:p-6 space-y-2">
                      <p class="text-[10px] text-[#5D4037] font-black uppercase tracking-widest">${product.category}</p>
                      <h3 class="font-bold text-gray-800 truncate text-sm sm:text-base">${product.name}</h3>
                      <div class="flex items-center gap-1 text-yellow-400 text-[10px]">${ratingHtml}</div>
                      <div class="flex items-center gap-2 font-black text-lg text-gray-900 mt-1">
                          <span>₹${product.price.toLocaleString('en-IN')}</span> ${delHtml}
                      </div>
                  </div>
              </div>
            `;
                $productGrid.append(productHtml);
            });
        }
    } catch (err) {
        console.error("Error injecting products from MongoDB:", err);
    }

    // 2. Inject Categories
    const categories = getCategories();
    const $categoryContainer = $('.category-item-container');
    $categoryContainer.empty();

    categories.forEach(cat => {
        const catHtml = `
      <div class="min-w-[160px] md:min-w-[220px] snap-start bg-[#F5F5DC] border border-[#D7CCC8] p-4 rounded-2xl flex items-center gap-4 hover:shadow-xl hover:border-[#5D4037] transition-all cursor-pointer group">
          <div class="bg-[#D7CCC8] p-2.5 rounded-xl text-[#5D4037] text-xl group-hover:bg-[#5D4037] group-hover:text-[#F5F5DC] transition-colors duration-300 flex items-center justify-center">
              <img src="${cat.icon}" alt="${cat.name}" width="24" class="group-hover:brightness-0 group-hover:invert transition-all">
          </div>
          <div>
              <h3 class="font-bold text-xs md:text-sm truncate">${cat.name}</h3>
              <p class="text-[10px] text-gray-400">(${cat.amount} items)</p>
          </div>
      </div>
    `;
        $categoryContainer.append(catHtml);
    });
    // 3. Inject Fashion Banners
    const banners = getBanners();
    const fashionBanners = banners.filter(b => b.section === 'fashion');
    const $fashionSection = $('#fashion-section');
    if ($fashionSection.length > 0) {
        $fashionSection.empty();
        fashionBanners.forEach(banner => {
            const bannerHtml = `
          <div class="${banner.classes}" style="background-color: ${banner.bg_color}">
              <div class="w-1/2 p-6 md:p-10 flex flex-col justify-center relative">
                  <img src="${banner.icon}" class="absolute bottom-4 left-4 w-12 opacity-80" alt="">
                  <h3 class="text-xl md:text-3xl font-black mb-2 leading-tight">${banner.title}</h3>
                  <p class="text-gray-600 text-sm mb-2">${banner.description}</p>
                  <p class="text-2xl font-black">${banner.price_info}</p>
                  <div class="flex gap-1.5 mt-6">
                      <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <div class="w-3 h-1.5 rounded-full bg-gray-800"></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  </div>
              </div>
              <div class="w-1/2 h-full">
                  <img src="${banner.image}" alt="${banner.title}" class="w-full h-full object-cover">
              </div>
          </div>
      `;
            $fashionSection.append(bannerHtml);
        });
    }

    res.send($.html());
});

// Server-Side Injection for Fashion.html
app.get('/Fashion.html', (req, res) => {
    const fashionPath = path.join(__dirname, 'Fashion.html');
    let html = fs.readFileSync(fashionPath, 'utf8');
    const $ = cheerio.load(html);

    // Inject Banners
    const banners = getBanners();
    const $heroSlider = $('#hero-slider');
    $heroSlider.empty();

    banners.forEach(banner => {
        let bannerHtml = '';
        if (banner.type === 'standard') {
            bannerHtml = `
        <div class="${banner.classes}">
            <img src="${banner.image}" alt="${banner.title}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                <p class="text-sm font-light tracking-[0.3em] uppercase mb-1">${banner.subtitle}</p>
                <h2 class="text-3xl md:text-5xl font-serif tracking-tight">${banner.title}</h2>
            </div>
        </div>
      `;
        } else if (banner.type === 'featured') {
            bannerHtml = `
        <div class="${banner.classes}" style="background-color: ${banner.bg_color}">
            <div class="w-1/2 p-6 md:p-10 flex flex-col justify-center relative">
                <img src="${banner.icon}" class="absolute bottom-4 left-4 w-12 opacity-80" alt="">
                <h3 class="text-xl md:text-3xl font-black mb-2 leading-tight">${banner.title}</h3>
                <p class="text-gray-600 text-sm mb-2">${banner.description}</p>
                <p class="text-2xl font-black">${banner.price_info}</p>
                <div class="flex gap-1.5 mt-6">
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <div class="w-3 h-1.5 rounded-full bg-gray-800"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                </div>
            </div>
            <div class="w-1/2 relative overflow-hidden">
                <img src="${banner.image}" alt="${banner.title}" class="w-full h-full object-cover">
                <img src="https://img.icons8.com/color/96/000000/leaves.png" class="absolute top-4 right-4 w-8 rotate-45" alt="">
            </div>
        </div>
      `;
        } else if (banner.type === 'featured_small') {
            bannerHtml = `
        <div class="${banner.classes}" style="background-color: ${banner.bg_color}">
            <div class="p-6 md:p-10 flex flex-col justify-center h-full relative">
                <img src="${banner.icon}" class="absolute bottom-4 left-4 w-12 opacity-80" alt="">
                <h3 class="text-xl md:text-3xl font-black mb-2 leading-tight">${banner.title}</h3>
                <p class="text-gray-600 text-sm mb-2">${banner.description}</p>
                <p class="text-2xl font-black">${banner.price_info}</p>
                <div class="absolute top-10 right-10 w-32 h-32 bg-yellow-200/50 rounded-full blur-2xl"></div>
            </div>
        </div>
      `;
        }
        $heroSlider.append(bannerHtml);
    });

    res.send($.html());
});

// Serve Admin Dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Serve hidden admin panel
app.get('/hostelmart-control-room', (req, res) => {
    res.sendFile(path.join(__dirname, 'hostelmart-control-room.html'));
});

// Serve static files from root
app.use(express.static(__dirname, {
    extensions: ['html'],
    index: false // We handle index.html manually
}));

// Fallback for HTML files not explicitly handled
app.get('/:page.html', (req, res, next) => {
    const filePath = path.join(__dirname, req.params.page + '.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        next();
    }
});

// 404 Logger to find broken links
app.use((req, res, next) => {
    console.warn(`404 Not Found: ${req.url} - Referer: ${req.headers.referer || 'Direct'}`);
    res.status(404).send(`Cannot GET ${req.url}`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
module.exports = app;
