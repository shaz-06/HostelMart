/**
 * seedProducts.js
 * Master database seeding script for HostelMart.
 * Sequentially runs all 28 seed scripts, parses the static detail runner files,
 * extracts the spotlight products from Beauty.html, and saves them to MongoDB.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
require('dotenv').config({ path: '.env.local' });

const Product = require('./models/Product');
const connectDB = require('./lib/mongodb');

// Helper to extract nested braces object from JS file
function extractObject(content, varName) {
    const startStr = `const ${varName} =`;
    const startIndex = content.indexOf(startStr);
    if (startIndex === -1) return null;
    
    const braceIndex = content.indexOf('{', startIndex);
    if (braceIndex === -1) return null;
    
    let depth = 0;
    let endIndex = -1;
    for (let i = braceIndex; i < content.length; i++) {
        if (content[i] === '{') depth++;
        else if (content[i] === '}') {
            depth--;
            if (depth === 0) {
                endIndex = i;
                break;
            }
        }
    }
    
    if (endIndex === -1) return null;
    const objStr = content.substring(braceIndex, endIndex + 1);
    
    // Evaluate the object definition
    return new Function(`return ${objStr}`)();
}

async function run() {
    try {
        console.log('⚡ Starting Master Database Seeding...');
        
        // 1. Run all 28 seed scripts sequentially as child processes
        const seedFiles = fs.readdirSync(__dirname)
            .filter(f => f.startsWith('seed_') && f.endsWith('.js'))
            .sort();

        console.log(`📂 Found ${seedFiles.length} category seed scripts to run:`);
        for (const file of seedFiles) {
            console.log(`⏳ Running ${file}...`);
            try {
                // We execute them synchronously using node child process
                execSync(`node "${path.join(__dirname, file)}"`, { stdio: 'inherit' });
                console.log(`✅ Completed ${file}`);
            } catch (err) {
                console.error(`❌ Error running ${file}:`, err.message);
            }
        }

        // 2. Connect to MongoDB to seed runner data and spotlight products
        console.log('🔌 Connecting to MongoDB...');
        await connectDB();
        console.log('✅ MongoDB Connected.');

        // 3. Parse and seed static runner products
        const runners = [
            { file: 'deals_detail_runner.js', var: 'DEALS_DATA', category: 'Deals & Offers' },
            { file: 'dress_detail_runner.js', var: 'DRESSES_DATA', category: 'Fashion & Apparel', subCategory: 'Dresses' },
            { file: 'daily_detail_runner.js', var: 'DAILY_DATA', category: 'Daily Essentials' },
            { file: 'footwear_detail_runner.js', var: 'FOOTWEAR_DATA', category: 'Fashion & Apparel', subCategory: 'Footwear' },
            { file: 'study_detail_runner.js', var: 'STUDY_DATA', category: 'Hostel & Student Essentials', subCategory: 'Study Essentials' },
            { file: 'trending_detail_runner.js', var: 'TRENDING_DATA', category: 'Trending' }
        ];

        console.log('📂 Seeding static runner products...');
        let seededRunnerCount = 0;
        for (const r of runners) {
            const runnerPath = path.join(__dirname, r.file);
            if (!fs.existsSync(runnerPath)) {
                console.warn(`⚠️ Runner file not found: ${r.file}`);
                continue;
            }

            console.log(`📖 Parsing ${r.file}...`);
            const content = fs.readFileSync(runnerPath, 'utf8');
            const data = extractObject(content, r.var);
            if (!data) {
                console.warn(`⚠️ Failed to parse ${r.var} from ${r.file}`);
                continue;
            }

            const productsToInsert = [];
            for (const [slug, sp] of Object.entries(data)) {
                // Map static details to database Product schema
                const price = Number(sp.price) || 0;
                const originalPrice = Number(sp.originalPrice) || Number(sp.price) || 0;
                const discount = sp.discount || '';

                const highlights = Array.isArray(sp.highlights) 
                    ? sp.highlights 
                    : typeof sp.highlights === 'object' && sp.highlights !== null 
                        ? Object.entries(sp.highlights).map(([k, v]) => `${k}: ${v}`) 
                        : [];

                const specMap = typeof sp.highlights === 'object' && sp.highlights !== null ? sp.highlights : {};

                // Map specific technical fields if present
                const battery = specMap["Battery Capacity"] || specMap["Battery"] || null;
                const processor = specMap["Processor"] || null;
                const ram = specMap["RAM"] || null;
                const storage = specMap["Storage"] || null;
                const display = specMap["Display"] || specMap["Main Display"] || null;
                const color = specMap["Color"] || (sp.colorOptions && sp.colorOptions[0] ? sp.colorOptions[0].name : null);

                // Check if product already exists to prevent duplicate slugs
                const existing = await Product.findOne({ slug });
                if (existing) continue;

                productsToInsert.push({
                    slug,
                    name: sp.title || sp.name || slug,
                    brand: sp.brand || 'HostelMart',
                    category: sp.category || r.category,
                    subCategory: sp.subcategory || r.subCategory || '',
                    subcategory: sp.subcategory || r.subCategory || '',
                    description: sp.description || sp.title || '',
                    price,
                    originalPrice,
                    oldPrice: originalPrice,
                    discount,
                    rating: Number(sp.rating) || 4.5,
                    ratingsCount: parseInt(sp.ratingsCount) || 50,
                    reviews: parseInt(sp.ratingsCount) || 50,
                    stock: 50,
                    image: sp.images && sp.images[0] ? sp.images[0] : 'https://via.placeholder.com/300',
                    images: sp.images || [],
                    highlights,
                    specifications: specMap,
                    battery,
                    processor,
                    ram,
                    storage,
                    display,
                    color,
                    featured: true,
                    trending: true
                });
            }

            if (productsToInsert.length > 0) {
                await Product.insertMany(productsToInsert);
                seededRunnerCount += productsToInsert.length;
                console.log(`   Seeded ${productsToInsert.length} products from ${r.file}`);
            }
        }
        console.log(`✅ Seeded ${seededRunnerCount} total static runner products.`);

        // 4. Extract and seed 20 beauty spotlight products from Beauty.html
        console.log('📂 Seeding 20 Spotlight products from Beauty.html...');
        const beautyHtmlPath = path.join(__dirname, 'Beauty.html');
        if (fs.existsSync(beautyHtmlPath)) {
            const html = fs.readFileSync(beautyHtmlPath, 'utf8');
            const $ = cheerio.load(html);
            const spotlightProducts = [];

            // We select all cards in the BRAND SPOTLIGHT DEALS grid
            const cards = $('section:contains("Brand Spotlight Deals")').find('.product-card');
            console.log(`   Found ${cards.length} cards inside Brand Spotlight Deals section.`);

            cards.each((idx, elem) => {
                const addBtn = $(elem).find('button[data-product-slug]');
                if (addBtn.length > 0) {
                    const slug = addBtn.attr('data-product-slug');
                    const name = addBtn.attr('data-product-name') || $(elem).find('h3').text().trim();
                    const rawPrice = addBtn.attr('data-product-price') || $(elem).find('.text-base').text().trim();
                    const image = addBtn.attr('data-product-image') || $(elem).find('img').attr('src');
                    const brand = addBtn.attr('data-product-brand') || 'ANI\'S';
                    const categoryTag = $(elem).find('span.absolute.top-3.left-3').text().trim() || 'Waxing';
                    const discount = $(elem).find('span.absolute.top-3.right-3').text().trim() || '78% OFF';
                    const rating = parseFloat($(elem).find('.flex.items-center.gap-1.bg-\\[\\#C8A951\\]\\/10').find('span').first().text().trim()) || 5.0;
                    const reviewsStr = $(elem).find('span.text-gray-400.font-normal').text().trim() || '(41)';
                    const reviews = parseInt(reviewsStr.replace(/[^0-9]/g, '')) || 41;

                    const price = parseInt(rawPrice.replace(/[^0-9]/g, '')) || 172;
                    const originalPriceStr = $(elem).find('del').text().trim();
                    const originalPrice = parseInt(originalPriceStr.replace(/[^0-9]/g, '')) || Math.floor(price * 1.3);

                    spotlightProducts.push({
                        slug,
                        name,
                        brand,
                        category: "Beauty & Personal Care",
                        subCategory: categoryTag,
                        subcategory: categoryTag,
                        description: `Premium ${categoryTag} deal: ${name} by ${brand}. High-rated beauty favorite.`,
                        price,
                        originalPrice,
                        oldPrice: originalPrice,
                        discount,
                        rating,
                        reviews,
                        ratingsCount: reviews,
                        stock: 100,
                        image,
                        images: [image],
                        badge: discount,
                        tags: [categoryTag, "Beauty", "Spotlight"],
                        featured: true,
                        trending: true,
                        section: "Brand Spotlight Deals"
                    });
                }
            });

            let spotSeededCount = 0;
            for (const sp of spotlightProducts) {
                const existing = await Product.findOne({ slug: sp.slug });
                if (!existing) {
                    await new Product(sp).save();
                    spotSeededCount++;
                }
            }
            console.log(`✅ Seeded ${spotSeededCount} brand spotlight deals from Beauty.html.`);
        } else {
            console.warn('⚠️ Beauty.html not found.');
        }

        console.log('🎉 Database seeding completely completed successfully!');
        mongoose.connection.close();
        process.exit(0);
    } catch (e) {
        console.error('❌ Master Seeding Error:', e);
        process.exit(1);
    }
}

run();
