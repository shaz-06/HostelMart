/**
 * seed_buckets.js
 * Script to seed 25+ bucket products into MongoDB Atlas.
 */

const connectDB = require('./lib/mongodb');
const Product = require('./models/Product');

const bucketProducts = [
  {
    name: "Cello Classic Plastic Bucket - 20L",
    slug: "cello-classic-plastic-bucket-20l",
    brand: "Cello",
    description: "Durable and stylish 20-liter plastic bucket for daily bathroom use. Features a sturdy handle for easy lifting.",
    category: "Home",
    subcategory: "Bathroom Essentials",
    section: "Buckets",
    material: "Plastic",
    capacity: "20L",
    colors: ["Blue", "Pink", "Green"],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    price: 349,
    originalPrice: 499,
    discount: "30% OFF",
    stock: 120,
    rating: 4.5,
    featured: true
  },
  {
    name: "Milton Premium Mug & Bucket Set",
    slug: "milton-premium-mug-bucket-set",
    brand: "Milton",
    description: "Complete bathroom set including a 25L bucket and a matching 1.5L mug. Elegant textured design.",
    category: "Home",
    subcategory: "Bathroom Essentials",
    section: "Mug + Bucket Sets",
    material: "Plastic",
    capacity: "25L",
    colors: ["Ivory", "Grey"],
    image: "https://images.unsplash.com/photo-1620626011761-9963d7521476?auto=format&fit=crop&q=80&w=800",
    price: 899,
    originalPrice: 1200,
    discount: "25% OFF",
    stock: 45,
    rating: 4.8,
    trending: true
  },
  {
    name: "Nayasa Designer Bathroom Bucket - 18L",
    slug: "nayasa-designer-bathroom-bucket-18l",
    brand: "Nayasa",
    description: "Beautifully printed designer bucket that adds a touch of elegance to your bathroom decor.",
    category: "Home",
    subcategory: "Bathroom Essentials",
    section: "Designer Buckets",
    material: "Plastic",
    capacity: "18L",
    colors: ["Floral White", "Rose Pink"],
    image: "https://images.unsplash.com/photo-1595231712325-9fdec20445f6?auto=format&fit=crop&q=80&w=800",
    price: 450,
    originalPrice: 550,
    discount: "18% OFF",
    stock: 80,
    rating: 4.3
  },
  {
    name: "Stainless Steel Heavy Duty Bucket - 15L",
    slug: "stainless-steel-heavy-duty-bucket-15l",
    brand: "Generic",
    description: "Rust-proof high-grade stainless steel bucket. Perfect for hot water and long-lasting durability.",
    category: "Home",
    subcategory: "Bathroom Essentials",
    section: "Steel Buckets",
    material: "Stainless Steel",
    capacity: "15L",
    colors: ["Silver"],
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800",
    price: 1299,
    originalPrice: 1599,
    discount: "19% OFF",
    stock: 30,
    rating: 4.7
  },
  {
    name: "Modware Foldable Space-Saving Bucket - 10L",
    slug: "modware-foldable-bucket-10l",
    brand: "Modware",
    description: "Collapsible silicone bucket ideal for small hostel rooms. Folds flat for easy storage.",
    category: "Home",
    subcategory: "Bathroom Essentials",
    section: "Foldable Buckets",
    material: "Silicone",
    capacity: "10L",
    colors: ["Grey-White", "Blue-White"],
    image: "https://images.unsplash.com/photo-1595231712325-9fdec20445f6?auto=format&fit=crop&q=80&w=800",
    price: 599,
    originalPrice: 799,
    discount: "25% OFF",
    stock: 60,
    rating: 4.6,
    featured: true
  },
  {
    name: "Home Puff Mini Portable Bucket - 5L",
    slug: "home-puff-mini-portable-bucket-5l",
    brand: "Home Puff",
    description: "Compact 5-liter bucket for quick washes or carrying small items. Very lightweight.",
    category: "Home",
    subcategory: "Bathroom Essentials",
    section: "Mini Buckets",
    material: "Plastic",
    capacity: "5L",
    colors: ["Red", "Yellow"],
    image: "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=800",
    price: 199,
    originalPrice: 299,
    discount: "33% OFF",
    stock: 200,
    rating: 4.2
  },
  {
    name: "Cello Jumbo Storage Bucket - 35L",
    slug: "cello-jumbo-storage-bucket-35l",
    brand: "Cello",
    description: "Extra large capacity bucket for heavy laundry or water storage. Reinforced base.",
    category: "Home",
    subcategory: "Bathroom Essentials",
    section: "Large Capacity Buckets",
    material: "Plastic",
    capacity: "35L",
    colors: ["Dark Brown", "Maroon"],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    price: 749,
    originalPrice: 999,
    discount: "25% OFF",
    stock: 40,
    rating: 4.4
  },
  {
    name: "Milton Frosty Bathroom Bucket - 22L",
    slug: "milton-frosty-bathroom-bucket-22l",
    brand: "Milton",
    description: "Semi-transparent frosty finish bucket. Strong handle and non-slip base.",
    category: "Home",
    subcategory: "Bathroom Essentials",
    section: "Bathroom Buckets",
    material: "Plastic",
    capacity: "22L",
    colors: ["Frosty Blue", "Frosty Purple"],
    image: "https://images.unsplash.com/photo-1620626011761-9963d7521476?auto=format&fit=crop&q=80&w=800",
    price: 399,
    originalPrice: 499,
    discount: "20% OFF",
    stock: 90,
    rating: 4.5
  }
];

// Generate more to reach 25+
const additionalBrands = ["Cello", "Milton", "Nayasa", "Modware", "Home Puff"];
const additionalSections = ["Plastic Buckets", "Bathroom Buckets", "Mini Buckets", "Mug + Bucket Sets"];

for(let i=9; i<=30; i++) {
    const brand = additionalBrands[i % additionalBrands.length];
    const section = additionalSections[i % additionalSections.length];
    const capacity = (10 + (i % 3) * 5) + "L";
    bucketProducts.push({
        name: `${brand} ${section} Standard - ${capacity} (V${i})`,
        slug: `${brand.toLowerCase()}-${section.toLowerCase().replace(/ \+ /g, '-').replace(/ /g, '-')}-v${i}`,
        brand: brand,
        description: `High quality ${section} from ${brand}. Durable design for long term use in hostel bathrooms.`,
        category: "Home",
        subcategory: "Bathroom Essentials",
        section: section,
        material: "Plastic",
        capacity: capacity,
        colors: ["Various"],
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
        price: 250 + (i * 10),
        originalPrice: 400 + (i * 10),
        discount: "15% OFF",
        stock: 50 + i,
        rating: 4.0 + (i % 10) / 10,
    });
}

async function seedBuckets() {
  try {
    await connectDB();
    
    // We don't want to clear EVERYTHING, just maybe the buckets category products?
    // Actually, user wants a fresh category, let's just add them.
    // If they already exist, we might get duplicate slug errors, so let's handle that.
    
    for (const prod of bucketProducts) {
        await Product.findOneAndUpdate({ slug: prod.slug }, prod, { upsert: true });
    }
    
    console.log('🪣 Bucket products seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding buckets:', error);
    process.exit(1);
  }
}

seedBuckets();
