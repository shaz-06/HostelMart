/**
 * seed_boxers.js
 * Database seeding script for HostelMart to dynamically add/update Boxer and Shorts products in MongoDB.
 */

const mongoose = require('mongoose');
const Product = require('./models/Product');

const boxersData = [
  {
    name: "U.S. Polo Assn. Solid Men Boxer",
    slug: "us-polo-solid-men-boxer",
    brand: "U.S. Polo Assn.",
    category: "Innerwear",
    subcategory: "Men's Boxer",
    price: 12,
    originalPrice: 18,
    discount: "PREMIUM",
    rating: 4.8,
    ratingsCount: 1420,
    reviewsCount: 380,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80"
    ],
    colors: ["Cream", "Beige"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% Premium Combed Cotton fabric for unmatched softness",
      "Comfortable inner elastic waistband that leaves no marks",
      "Convenient side pockets and front fly opening",
      "Durable double-stitched seams for long-lasting wear",
      "Eco-friendly fabric processing and skin-safe dyes"
    ],
    description: "Experience ultimate comfort with the U.S. Polo Assn. Solid Men Boxer. Crafted from 100% premium combed cotton, these boxers offer a soft feel and perfect breathability for everyday wear. Featuring a comfortable elastic waistband and a classic fit, they are designed to keep you relaxed and confident all day long.",
    specifications: {
      "Brand": "U.S. Polo Assn.",
      "Category": "Innerwear",
      "Type": "Men's Boxer",
      "Fabric": "100% Combed Cotton",
      "Fit": "Regular Fit",
      "Waistband": "Inner Elastic",
      "Pocket": "Dual Side Pockets",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 45,
    featured: true,
    trending: true
  },
  {
    name: "Damensch Solid Men Boxer",
    slug: "damensch-solid-men-boxer",
    brand: "Damensch",
    category: "Innerwear",
    subcategory: "Men's Boxer",
    price: 15,
    originalPrice: 22,
    discount: "ECO-SOFT",
    rating: 4.9,
    ratingsCount: 980,
    reviewsCount: 240,
    image: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80"
    ],
    colors: ["Sage", "Charcoal"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "MicroModal fibers derived from sustainable beechwood",
      "Moisture-wicking properties keep you cool all day",
      "Anti-microbial finish to prevent odor and irritation",
      "Tagless design for maximum irritation-free comfort",
      "Sophisticated eco-friendly solid shades"
    ],
    description: "Redefine comfort with Damensch Solid Men Boxers. Engineered with natural beechwood fibers, this Eco-Soft collection is incredibly smooth, lightweight, and breathable. Its natural moisture-wicking technology makes it ideal for humid weather and active days.",
    specifications: {
      "Brand": "Damensch",
      "Category": "Innerwear",
      "Type": "Men's Boxer",
      "Fabric": "Bamboo MicroModal Blend",
      "Fit": "Ergonomic Fit",
      "Waistband": "Ultra-soft tagless elastic",
      "Pocket": "One secure pocket",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 35,
    featured: true,
    trending: true
  },
  {
    name: "Levi’s Solid Men Boxer",
    slug: "levis-solid-men-boxer",
    brand: "Levi’s",
    category: "Innerwear",
    subcategory: "Men's Boxer",
    price: 18,
    originalPrice: 25,
    discount: "CLASSIC",
    rating: 4.7,
    ratingsCount: 2150,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80"
    ],
    colors: ["Navy", "Black"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "Robust cotton-rich fabric for heavy durability",
      "Authentic Levi's classic logo waistband",
      "Smooth non-rolling comfort waistband",
      "Convenient back pocket along with side pockets",
      "Vibrant fade-resistant colors"
    ],
    description: "Embrace the timeless style and signature durability of Levi’s Solid Men Boxers. Designed with a perfect blend of high-grade cotton and elastic, these boxers feature the classic Levi's logo waist strap, keeping you locked in premium comfort all day long.",
    specifications: {
      "Brand": "Levi’s",
      "Category": "Innerwear",
      "Type": "Men's Boxer",
      "Fabric": "Cotton-Elastic Blend",
      "Fit": "Relaxed Fit",
      "Waistband": "Branded Exposed Elastic",
      "Pocket": "Three pockets (2 side, 1 back)",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 2,
    stock: 50,
    featured: true,
    trending: true
  },
  {
    name: "Jockey Solid Men Boxer",
    slug: "jockey-solid-men-boxer",
    brand: "Jockey",
    category: "Innerwear",
    subcategory: "Men's Boxer",
    price: 22,
    originalPrice: 28,
    discount: "PACK OF 2",
    rating: 4.8,
    ratingsCount: 3840,
    reviewsCount: 850,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80"
    ],
    colors: ["Blue", "Charcoal"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "Convenient daily boxers for comfort loungewear",
      "Super combed cotton rich fabric",
      "Comfort elastic waistband with Jockey branding",
      "Side pockets for carrying micro essentials",
      "Double reinforced front seam for maximum shape retention"
    ],
    description: "Jockey Solid Men Boxers are a staple of premium comfort. Made from super combed cotton rich fabric, these boxers are incredibly soft and durable. They feature a relaxed, active fit with convenient side pockets, making them the ultimate loungewear choice.",
    specifications: {
      "Brand": "Jockey",
      "Category": "Innerwear",
      "Type": "Men's Boxer",
      "Fabric": "Combed Cotton Rich",
      "Fit": "Loungewear Relaxed Fit",
      "Waistband": "Branded Soft Elastic",
      "Pocket": "Side Pockets",
      "Pack Of": "2"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 60,
    featured: true,
    trending: true
  },
  {
    name: "Pepe Jeans Printed Men Boxer",
    slug: "pepe-jeans-printed-men-boxer",
    brand: "Pepe Jeans",
    category: "Innerwear",
    subcategory: "Men's Boxer",
    price: 20,
    originalPrice: 30,
    discount: "STYLE",
    rating: 4.6,
    ratingsCount: 780,
    reviewsCount: 160,
    image: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80"
    ],
    colors: ["Printed Navy", "Printed Grey"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "Trendy London-inspired conversational print",
      "100% fine cotton fabric for lightweight feel",
      "Concealed button fly for elegant clean look",
      "Comfort-fit waistband leaves no impressions",
      "High resolution wash-resistant prints"
    ],
    description: "Infuse style into your innerwear drawer with the Pepe Jeans Printed Men Boxer. Featuring vibrant, London-inspired lifestyle patterns, these 100% fine cotton boxers combine custom comfort with standout style, ideal for modern hostel trendsetters.",
    specifications: {
      "Brand": "Pepe Jeans",
      "Category": "Innerwear",
      "Type": "Men's Boxer",
      "Fabric": "100% Fine Cotton",
      "Fit": "Smart Fit",
      "Waistband": "Soft-woven Inner Elastic",
      "Pocket": "Dual Side Pockets",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 2,
    stock: 40,
    featured: true,
    trending: true
  }
];

const shortsData = [
  {
    name: "Classic Denim Shorts",
    slug: "classic-denim-shorts",
    brand: "HostelMart",
    category: "Womens Shorts",
    subcategory: "Women's Shorts",
    price: 18,
    originalPrice: 25,
    discount: "28% OFF",
    rating: 4.8,
    ratingsCount: 1150,
    reviewsCount: 260,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80"
    ],
    colors: ["Indigo", "Light Blue"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "Heavyweight durable denim fabric",
      "Stylish high-waist classic cut",
      "Five pocket design for style & utility",
      "Frayed hem detailing for a modern touch",
      "Pre-shrunk wash-resistant premium denim"
    ],
    description: "Step out in classic style with the Classic Denim Shorts. Constructed from robust, high-grade cotton denim, these high-waisted shorts feature elegant frayed hem detailing and a traditional five-pocket layout, combining lifetime durability with timeless summer aesthetic.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Womens Shorts",
      "Type": "Denim Shorts",
      "Fabric": "100% Cotton Denim",
      "Fit": "Regular Fit",
      "Hemline": "Frayed/Raw Hem",
      "Rise": "High Rise",
      "Closure": "Button & Zip Fly"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 50,
    featured: true,
    trending: true
  },
  {
    name: "Soft Cotton Lounge",
    slug: "soft-cotton-lounge-shorts",
    brand: "HostelMart",
    category: "Womens Shorts",
    subcategory: "Women's Shorts",
    price: 12,
    originalPrice: 18,
    discount: "PURE COTTON",
    rating: 4.9,
    ratingsCount: 1840,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80"
    ],
    colors: ["Soft Grey", "Peach"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% organic knit cotton for superior breathability",
      "Comfort elastic waistband with adjustable drawstrings",
      "Super soft touch feel, perfect for indoor lounging",
      "Dual deep side slash pockets",
      "Lightweight eco-friendly processed fabric"
    ],
    description: "Lounge in unparalleled comfort with the Soft Cotton Lounge Shorts. Tailored from 100% fine organic combed cotton, these breathable shorts are equipped with an adjustable drawstring waistband and dual deep side pockets, establishing them as your daily comfort choice.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Womens Shorts",
      "Type": "Lounge Shorts",
      "Fabric": "100% Organic Knit Cotton",
      "Fit": "Relaxed Fit",
      "Waistband": "Elastic with Adjustable Drawstring",
      "Pockets": "Dual Side Slash Pockets",
      "Special Tech": "Hygroscopic Combed Weave"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 40,
    featured: true,
    trending: true
  },
  {
    name: "Quick-Dry Sports",
    slug: "quick-dry-sports-shorts",
    brand: "HostelMart",
    category: "Womens Shorts",
    subcategory: "Women's Shorts",
    price: 15,
    originalPrice: 22,
    discount: "PRO-ACTIVE",
    rating: 4.7,
    ratingsCount: 1620,
    reviewsCount: 380,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80"
    ],
    colors: ["Jet Black", "Hot Pink"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "Advanced moisture-wicking Quick-Dry mesh technology",
      "Double layered design with built-in compression liner",
      "Four-way stretch fabric for unrestricted movement",
      "Concealed zipper pocket for key/card safety",
      "Reflective accents for high visibility"
    ],
    description: "Optimize your performance with the Quick-Dry Sports Shorts. Built with advanced moisture-wicking double layers and a supportive compression liner, these activewear shorts provide maximum flexibility and heat regulation during workouts, gym sessions, or morning runs.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Womens Shorts",
      "Type": "Active Sports Shorts",
      "Fabric": "88% Polyester, 12% Spandex",
      "Fit": "Athletic Compression Double-Layer",
      "Waistband": "Wide High-Rise Supportive Band",
      "Special Tech": "Dry-Fit Moisture Control",
      "Visibility": "Reflective Safety Print"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 60,
    featured: true,
    trending: true
  },
  {
    name: "Floral Printed Shorts",
    slug: "floral-printed-shorts",
    brand: "HostelMart",
    category: "Womens Shorts",
    subcategory: "Women's Shorts",
    price: 14,
    originalPrice: 20,
    discount: "30% OFF",
    rating: 4.6,
    ratingsCount: 730,
    reviewsCount: 140,
    image: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80"
    ],
    colors: ["Sky Blue", "Coral White"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "Vibrant high-definition floral print patterns",
      "Ultra-lightweight fluid rayon fabric",
      "Relaxed flared fit with excellent drape",
      "Comfortable elasticated smocked waistband",
      "Color-fast prints that do not fade on washing"
    ],
    description: "Bring fresh vibes to your everyday closet with the Floral Printed Shorts. Tailored from light, fluid rayon fabric that drapes elegantly, these flared casual shorts feature a comfortable smocked waistband and highly detailed floral patterns, keeping you stylish and breezy.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Womens Shorts",
      "Type": "Casual Printed Shorts",
      "Fabric": "100% Rayon Viscose",
      "Fit": "Flared Relaxed Fit",
      "Waistband": "Smocked Elasticated waist",
      "Pockets": "Dual Invisible Side Pockets",
      "Color Fastness": "Grade 4.5 Standard verified"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 2,
    stock: 45,
    featured: true,
    trending: true
  },
  {
    name: "High-Rise Sculpt",
    slug: "high-rise-sculpt-shorts",
    brand: "HostelMart",
    category: "Womens Shorts",
    subcategory: "Women's Shorts",
    price: 20,
    originalPrice: 28,
    discount: "PREMIUM CUT",
    rating: 4.9,
    ratingsCount: 2100,
    reviewsCount: 540,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80"
    ],
    colors: ["Steel Black", "Navy Blue"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "Premium supportive sculpt-knit fabric",
      "Ultra high-rise tummy support waistband",
      "Anti-roll waistband stays secure on squats",
      "Seamless side construction avoids chafing",
      "Premium interlock stitching for lifetime hold"
    ],
    description: "Sculpt your silhouette with the High-Rise Sculpt Shorts. Combining heavy tummy-control support with seamless structural sides, these compression active shorts stay completely secure, squat-proof, and comfortable during high-intensity training.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Womens Shorts",
      "Type": "Compression Sculpt Shorts",
      "Fabric": "80% Nylon, 20% Elastane",
      "Fit": "High-Compression Sculpt Fit",
      "Rise": "Extra High-Rise Supportive Waistband",
      "Seams": "Flatlock friction-free seams",
      "Squat Proof": "100% Opaque certified"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 55,
    featured: true,
    trending: true
  }
];

const tshirtsData = [
  {
    name: "Burger Print Tee",
    slug: "burger-print-tee",
    brand: "HostelMart",
    category: "Graphic T-Shirts",
    subcategory: "Graphic T-Shirts",
    price: 249,
    originalPrice: 399,
    discount: "37% OFF",
    rating: 4.8,
    ratingsCount: 1120,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["Cream", "White"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% Premium Cotton fabric for outstanding comfort",
      "Vibrant fade-resistant food print design",
      "Comfortable crew neck and regular casual fit",
      "Double reinforced neck seams for durability",
      "Soft breathable fabric optimized for summer wear"
    ],
    description: "Showcase your love for fast food with the classic Burger Print Tee. Crafted from 100% premium long-staple cotton, this high-grade graphic tee is built to maintain its shape, softness, and vibrant print over lifetime washes. Featuring a breathable casual crew neck style, it is the ultimate wardrobe essential for stylish college students.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Graphic T-Shirts",
      "Type": "Crew Neck Tee",
      "Fabric": "100% Premium Cotton",
      "Fit": "Regular Casual Fit",
      "Neck": "Crew Neck",
      "Print": "Burger Print",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 50,
    featured: true,
    trending: true
  },
  {
    name: "Pizza Print Tee",
    slug: "pizza-print-tee",
    brand: "HostelMart",
    category: "Graphic T-Shirts",
    subcategory: "Graphic T-Shirts",
    price: 299,
    originalPrice: 449,
    discount: "33% OFF",
    rating: 4.9,
    ratingsCount: 1420,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["Cream", "White"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% Premium Cotton fabric for outstanding comfort",
      "Vibrant fade-resistant food print design",
      "Comfortable crew neck and regular casual fit",
      "Double reinforced neck seams for durability",
      "Soft breathable fabric optimized for summer wear"
    ],
    description: "Showcase your love for fast food with the classic Pizza Print Tee. Crafted from 100% premium long-staple cotton, this high-grade graphic tee is built to maintain its shape, softness, and vibrant print over lifetime washes. Featuring a breathable casual crew neck style, it is the ultimate wardrobe essential for stylish college students.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Graphic T-Shirts",
      "Type": "Crew Neck Tee",
      "Fabric": "100% Premium Cotton",
      "Fit": "Regular Casual Fit",
      "Neck": "Crew Neck",
      "Print": "Pizza Print",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 50,
    featured: true,
    trending: true
  },
  {
    name: "Sushi Print Tee",
    slug: "sushi-print-tee",
    brand: "HostelMart",
    category: "Graphic T-Shirts",
    subcategory: "Graphic T-Shirts",
    price: 249,
    originalPrice: 399,
    discount: "37% OFF",
    rating: 4.7,
    ratingsCount: 980,
    reviewsCount: 180,
    image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["Cream", "White"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% Premium Cotton fabric for outstanding comfort",
      "Vibrant fade-resistant food print design",
      "Comfortable crew neck and regular casual fit",
      "Double reinforced neck seams for durability",
      "Soft breathable fabric optimized for summer wear"
    ],
    description: "Showcase your love for fast food with the classic Sushi Print Tee. Crafted from 100% premium long-staple cotton, this high-grade graphic tee is built to maintain its shape, softness, and vibrant print over lifetime washes. Featuring a breathable casual crew neck style, it is the ultimate wardrobe essential for stylish college students.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Graphic T-Shirts",
      "Type": "Crew Neck Tee",
      "Fabric": "100% Premium Cotton",
      "Fit": "Regular Casual Fit",
      "Neck": "Crew Neck",
      "Print": "Sushi Print",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 50,
    featured: true,
    trending: true
  },
  {
    name: "Taco Print Tee",
    slug: "taco-print-tee",
    brand: "HostelMart",
    category: "Graphic T-Shirts",
    subcategory: "Graphic T-Shirts",
    price: 299,
    originalPrice: 449,
    discount: "33% OFF",
    rating: 4.8,
    ratingsCount: 1050,
    reviewsCount: 200,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["Cream", "White"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% Premium Cotton fabric for outstanding comfort",
      "Vibrant fade-resistant food print design",
      "Comfortable crew neck and regular casual fit",
      "Double reinforced neck seams for durability",
      "Soft breathable fabric optimized for summer wear"
    ],
    description: "Showcase your love for fast food with the classic Taco Print Tee. Crafted from 100% premium long-staple cotton, this high-grade graphic tee is built to maintain its shape, softness, and vibrant print over lifetime washes. Featuring a breathable casual crew neck style, it is the ultimate wardrobe essential for stylish college students.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Graphic T-Shirts",
      "Type": "Crew Neck Tee",
      "Fabric": "100% Premium Cotton",
      "Fit": "Regular Casual Fit",
      "Neck": "Crew Neck",
      "Print": "Taco Print",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 50,
    featured: true,
    trending: true
  },
  {
    name: "Ice Cream Tee",
    slug: "ice-cream-tee",
    brand: "HostelMart",
    category: "Graphic T-Shirts",
    subcategory: "Graphic T-Shirts",
    price: 249,
    originalPrice: 399,
    discount: "37% OFF",
    rating: 4.9,
    ratingsCount: 1380,
    reviewsCount: 290,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["Cream", "White"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% Premium Cotton fabric for outstanding comfort",
      "Vibrant fade-resistant food print design",
      "Comfortable crew neck and regular casual fit",
      "Double reinforced neck seams for durability",
      "Soft breathable fabric optimized for summer wear"
    ],
    description: "Showcase your love for fast food with the classic Ice Cream Tee. Crafted from 100% premium long-staple cotton, this high-grade graphic tee is built to maintain its shape, softness, and vibrant print over lifetime washes. Featuring a breathable casual crew neck style, it is the ultimate wardrobe essential for stylish college students.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Graphic T-Shirts",
      "Type": "Crew Neck Tee",
      "Fabric": "100% Premium Cotton",
      "Fit": "Regular Casual Fit",
      "Neck": "Crew Neck",
      "Print": "Ice Cream Print",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 50,
    featured: true,
    trending: true
  },
  {
    name: "Donut Print Tee",
    slug: "donut-print-tee",
    brand: "HostelMart",
    category: "Graphic T-Shirts",
    subcategory: "Graphic T-Shirts",
    price: 299,
    originalPrice: 449,
    discount: "33% OFF",
    rating: 4.8,
    ratingsCount: 1190,
    reviewsCount: 240,
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=800&q=80"
    ],
    colors: ["Cream", "White"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% Premium Cotton fabric for outstanding comfort",
      "Vibrant fade-resistant food print design",
      "Comfortable crew neck and regular casual fit",
      "Double reinforced neck seams for durability",
      "Soft breathable fabric optimized for summer wear"
    ],
    description: "Showcase your love for fast food with the classic Donut Print Tee. Crafted from 100% premium long-staple cotton, this high-grade graphic tee is built to maintain its shape, softness, and vibrant print over lifetime washes. Featuring a breathable casual crew neck style, it is the ultimate wardrobe essential for stylish college students.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Graphic T-Shirts",
      "Type": "Crew Neck Tee",
      "Fabric": "100% Premium Cotton",
      "Fit": "Regular Casual Fit",
      "Neck": "Crew Neck",
      "Print": "Donut Print",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 50,
    featured: true,
    trending: true
  }
];

const shirtsData = [
  {
    name: "Floral White Shirt",
    slug: "floral-white-shirt",
    brand: "HostelMart",
    category: "Embroidered Shirts",
    subcategory: "Embroidered Shirts",
    price: 399,
    originalPrice: 599,
    discount: "33% OFF",
    rating: 4.8,
    ratingsCount: 1250,
    reviewsCount: 270,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"
    ],
    colors: ["White", "Off-White"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% Premium Cotton linen fabric for rich organic texture",
      "Exquisite embroidered floral motifs on front panel",
      "Breathable lightweight material designed for summer comfort",
      "High-grade classic tailored collar and regular smart fit",
      "Stitched with ultra-durable threads that resist stretching"
    ],
    description: "Elevate your style with the Floral White Embroidered Shirt. Tailored from premium organic cotton-linen blend, this shirt features sophisticated hand-embroidered floral motifs that add an artistic touch to your smart casual looks. Its high-grade weave is exceptionally breathable, making it a perfect pick for warm college days and casual hangouts.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Embroidered Shirts",
      "Type": "Embroidered Shirt",
      "Fabric": "Cotton-Linen Blend",
      "Fit": "Regular Smart Fit",
      "Sleeve": "Full Sleeve",
      "Pattern": "Embroidered Floral",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 40,
    featured: true,
    trending: true
  },
  {
    name: "Dragon Motif Black Shirt",
    slug: "dragon-motif-black-shirt",
    brand: "HostelMart",
    category: "Embroidered Shirts",
    subcategory: "Embroidered Shirts",
    price: 449,
    originalPrice: 699,
    discount: "35% OFF",
    rating: 4.9,
    ratingsCount: 1580,
    reviewsCount: 380,
    image: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80",
      "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80"
    ],
    colors: ["Black"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "Heavy-grade satin-touch premium fabric",
      "Stunning high-density dragon motif embroidery",
      "Ergonomically designed smart collar structure",
      "Glossy black premium buttons with spare attachments",
      "Pre-shrunk organic processing preserves shape"
    ],
    description: "Make a bold fashion statement with the Dragon Motif Black Shirt. Crafted with soft, satin-touch cotton blend, this luxury embroidered shirt showcases a magnificent high-density dragon artwork on the chest. Designed with a clean smart collar and custom premium buttons, it delivers a striking silhouette for parties, dates, or evening get-togethers.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Embroidered Shirts",
      "Type": "Luxury Motif Shirt",
      "Fabric": "Satin-Touch Cotton Blend",
      "Fit": "Ergonomic Smart Fit",
      "Sleeve": "Full Sleeve",
      "Pattern": "Dragon Motif",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 35,
    featured: true,
    trending: true
  },
  {
    name: "Bird Navy Shirt",
    slug: "bird-navy-shirt",
    brand: "HostelMart",
    category: "Embroidered Shirts",
    subcategory: "Embroidered Shirts",
    price: 349,
    originalPrice: 499,
    discount: "30% OFF",
    rating: 4.7,
    ratingsCount: 1120,
    reviewsCount: 240,
    image: "https://images.unsplash.com/photo-1588359348347-9bc6cbaa689e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1588359348347-9bc6cbaa689e?w=800&q=80",
      "https://images.unsplash.com/photo-1588359348347-9bc6cbaa689e?w=800&q=80"
    ],
    colors: ["Navy Blue"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% Cotton knit with super-combed luxury finish",
      "Elegantly detailed swallow/bird motifs on collar & cuff",
      "Relaxed casual look with comfortable smart fit",
      "Double reinforced cuffs and colorfast dye layers",
      "Premium interlock stitching avoids edge fraying"
    ],
    description: "Showcase understated elegance with the Bird Navy Embroidered Shirt. Built from super-combed luxury cotton, this deep navy blue shirt features delicate, high-precision swallow embroidery along the collar and cuffs. Ideal for a refined casual wardrobe, it pairs perfectly with chinos or denim.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Embroidered Shirts",
      "Type": "Casual Embroidered Shirt",
      "Fabric": "100% Super-Combed Cotton",
      "Fit": "Smart Casual Fit",
      "Sleeve": "Full Sleeve",
      "Pattern": "Bird Motif",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 45,
    featured: true,
    trending: true
  },
  {
    name: "Ethnic Cream Shirt",
    slug: "ethnic-cream-shirt",
    brand: "HostelMart",
    category: "Embroidered Shirts",
    subcategory: "Embroidered Shirts",
    price: 499,
    originalPrice: 799,
    discount: "37% OFF",
    rating: 4.8,
    ratingsCount: 940,
    reviewsCount: 190,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd15e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd15e?w=800&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd15e?w=800&q=80"
    ],
    colors: ["Cream", "Ivory"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "Pure textured handloom organic cotton fabric",
      "Intricate traditional ethnic borders on the front placket",
      "Moisture-wicking, highly breathable weave style",
      "Natural wooden-finished premium buttons",
      "Skin-friendly herbal organic dye processing"
    ],
    description: "Connect with heritage design using the Ethnic Cream Shirt. Crafted from textured handloom organic cotton, this shirt features traditional ethnic threadwork running elegantly down the central placket. Accented with natural wooden-finished buttons, it is an ideal fusion of ethnic style and modern luxury.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Embroidered Shirts",
      "Type": "Heritage Ethnic Shirt",
      "Fabric": "100% Handloom Cotton",
      "Fit": "Smart Traditional Fit",
      "Sleeve": "Full Sleeve",
      "Pattern": "Ethnic Border",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 30,
    featured: true,
    trending: true
  },
  {
    name: "Rose Pink Shirt",
    slug: "rose-pink-shirt",
    brand: "HostelMart",
    category: "Embroidered Shirts",
    subcategory: "Embroidered Shirts",
    price: 399,
    originalPrice: 599,
    discount: "33% OFF",
    rating: 4.9,
    ratingsCount: 1340,
    reviewsCount: 280,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"
    ],
    colors: ["Rose Pink"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "100% Fine Combed Cotton for a super soft texture",
      "Elegant classic rose branch embroidery on chest",
      "Smooth lightweight fabric optimized for all-day comfort",
      "Refined neat cuffs and premium thread-work borders",
      "Vibrant organic pink hue that stands out beautifully"
    ],
    description: "Redefine your casual style with the Rose Pink Shirt. Tailored from 100% fine combed cotton, it features a minimalist, beautifully stitched rose branch design on the chest. The organic dye layer is robust and fade-resistant, keeping the shirt's custom color looking outstanding for a lifetime.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Embroidered Shirts",
      "Type": "Casual Embroidered Shirt",
      "Fabric": "100% Combed Cotton",
      "Fit": "Regular Smart Fit",
      "Sleeve": "Full Sleeve",
      "Pattern": "Rose Embroidery",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 50,
    featured: true,
    trending: true
  },
  {
    name: "Geo Olive Shirt",
    slug: "geo-olive-shirt",
    brand: "HostelMart",
    category: "Embroidered Shirts",
    subcategory: "Embroidered Shirts",
    price: 449,
    originalPrice: 649,
    discount: "30% OFF",
    rating: 4.8,
    ratingsCount: 1190,
    reviewsCount: 220,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=800&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=800&q=80"
    ],
    colors: ["Olive Green"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    highlights: [
      "Textured premium cotton canvas fabric",
      "Precision geometric stitch patterns on cuffs and pocket",
      "Durable heavy-duty seams built for longevity",
      "Sophisticated earthy olive green organic shade",
      "Double reinforced placket for enhanced structure"
    ],
    description: "Incorporate earth tones into your rotation with the Geo Olive Shirt. Tailored from textured premium cotton canvas, this smart casual shirt is detailed with neat geometric accent stitching along the pocket and cuffs. Highly durable and structured, it delivers a handsome drape that stays sharp.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Embroidered Shirts",
      "Type": "Casual Embroidered Shirt",
      "Fabric": "Textured Cotton Canvas",
      "Fit": "Regular Smart Fit",
      "Sleeve": "Full Sleeve",
      "Pattern": "Geometric Accent",
      "Pack Of": "1"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 40,
    featured: true,
    trending: true
  }
];

const sneakersData = [
  {
    name: "Chunky White Sneakers",
    slug: "chunky-white-sneakers",
    brand: "HostelMart",
    category: "Sneakers",
    subcategory: "Platform Sneakers",
    price: 1299,
    originalPrice: 1999,
    discount: "35% OFF",
    rating: 4.8,
    ratingsCount: 2120,
    reviewsCount: 460,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"
    ],
    colors: ["White", "Beige"],
    sizeOptions: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    highlights: [
      "Heavy-duty double-stitched panel leather upper",
      "Signature high-comfort chunky TPU midsole styling",
      "Premium breathable micro-mesh interior padding",
      "Super-grip anti-slip grooved rubber outer sole",
      "Orthotic arch support insole prevents foot fatigue"
    ],
    description: "Step into street style with the Chunky White Sneakers. Engineered with heavy-duty vegan leather panels and a modern signature TPU platform midsole, these sneakers provide elite comfort, breathability, and responsive cushioning all day. Outfitted with super-grip grooved outer soles and orthotic arch inserts, they are perfect for daily campus walking, sports, or street fashion.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Footwear",
      "Lifestyle": "Streetwear / Casual Sport",
      "Upper Material": "Premium Vegan Leather & Mesh",
      "Sole Type": "Anti-Slip Grooved Rubber",
      "Midsole Technology": "Cushioned TPU Platform",
      "Comfort Features": "Orthotic Arch Support Insole",
      "Weight": "420g (Single Shoe Size 8)"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 50,
    featured: true,
    trending: true
  },
  {
    name: "Pastel Pink Sneakers",
    slug: "pastel-pink-sneakers",
    brand: "HostelMart",
    category: "Sneakers",
    subcategory: "Platform Sneakers",
    price: 1499,
    originalPrice: 2299,
    discount: "34% OFF",
    rating: 4.9,
    ratingsCount: 1840,
    reviewsCount: 410,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80"
    ],
    colors: ["Pink", "Beige"],
    sizeOptions: ["UK 5", "UK 6", "UK 7", "UK 8", "UK 9"],
    highlights: [
      "Eco-friendly sustainable soft canvas upper fabric",
      "Ultra-soft pastel rose styling with beige accents",
      "Memory foam cushioned orthotic insole layers",
      "Highly flexible vulcanized rubber outer sole",
      "Friction-free seamless lining prevents blistering"
    ],
    description: "Add a touch of elegance to your daily wear with the Pastel Pink Sneakers. Combining eco-friendly breathable canvas with an ultra-soft pastel color aesthetic, these sneakers feature triple-layer memory foam orthotic insoles and a flexible vulcanized sole. They guarantee lightweight, blister-free comfort for walking, lounging, or active travel.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Footwear",
      "Lifestyle": "Casual Athleisure",
      "Upper Material": "Organic Soft Canvas",
      "Sole Type": "Flexible Vulcanized Rubber",
      "Comfort Features": "Triple-Layer Memory Foam Insole",
      "Lining": "Blister-Free Seamless Knit",
      "Weight": "310g (Single Shoe Size 6)"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 40,
    featured: true,
    trending: true
  },
  {
    name: "Gothic Black Sneakers",
    slug: "gothic-black-sneakers",
    brand: "HostelMart",
    category: "Sneakers",
    subcategory: "Platform Sneakers",
    price: 1699,
    originalPrice: 2499,
    discount: "32% OFF",
    rating: 4.7,
    ratingsCount: 1420,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80",
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80"
    ],
    colors: ["Black"],
    sizeOptions: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    highlights: [
      "Water-resistant full-grain matte black leather",
      "Rugged heavy-lug double stitched command outer sole",
      "Intense all-black stealth style details",
      "Shock-absorbing high-density EVA midsole core",
      "Moisture-wicking odor-resistant charcoal insole"
    ],
    description: "Embrace dark aesthetics with the Gothic Black Sneakers. Engineered from premium water-resistant matte black leather, these sneakers feature rugged heavy-lug command outsoles, a high-density EVA midsole, and an odor-resistant charcoal cushion. They deliver supreme shock absorption, weather protection, and durability for all urban adventures.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Footwear",
      "Lifestyle": "Streetwear / Heavy Urban",
      "Upper Material": "Water-Resistant Full-Grain Leather",
      "Sole Type": "Heavy-Lug Rubber Command Sole",
      "Midsole Technology": "High-Density EVA Core",
      "Insole Type": "Odor-Resistant Charcoal Cushion",
      "Weight": "490g (Single Shoe Size 8)"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 35,
    featured: true,
    trending: true
  },
  {
    name: "Holographic Sneakers",
    slug: "holographic-sneakers",
    brand: "HostelMart",
    category: "Sneakers",
    subcategory: "Platform Sneakers",
    price: 1899,
    originalPrice: 2999,
    discount: "36% OFF",
    rating: 4.8,
    ratingsCount: 1150,
    reviewsCount: 260,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"
    ],
    colors: ["Holographic", "Silver"],
    sizeOptions: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    highlights: [
      "Stunning light-reactive color-shifting holographic panels",
      "Breathable organic mesh overlay with reflective piping",
      "Super-light bounce-cushion responsive midsole technology",
      "Opaque icy rubber traction outer sole",
      "Ergonomic stabilizing heel counter prevents rolling"
    ],
    description: "Stand out under any lighting with the Holographic Sneakers. Outfitted with light-reactive color-shifting synthetic panels and highly reflective safety piping, these sneakers are equipped with a bounce-cushion responsive midsole and an icy rubber traction outsole for explosive return energy and steady balance.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Footwear",
      "Lifestyle": "Fashion Streetwear / Club",
      "Upper Material": "Reflective Holographic Synthetic & Mesh",
      "Sole Type": "Icy Non-Marking Traction Rubber",
      "Midsole Technology": "Bounce-Cushion Responsive Foam",
      "Stability": "Stabilizing TPU Heel Counter",
      "Weight": "390g (Single Shoe Size 8)"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 30,
    featured: true,
    trending: true
  },
  {
    name: "Suede Beige Sneakers",
    slug: "suede-beige-sneakers",
    brand: "HostelMart",
    category: "Sneakers",
    subcategory: "Platform Sneakers",
    price: 1499,
    originalPrice: 2199,
    discount: "31% OFF",
    rating: 4.9,
    ratingsCount: 1690,
    reviewsCount: 380,
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80",
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80"
    ],
    colors: ["Beige", "Tan"],
    sizeOptions: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    highlights: [
      "Ultra-soft premium double-napped genuine suede leather",
      "Clean, minimalist cream styling with brown details",
      "Extra-padded dual foam step-in comfortable lining",
      "Durable cup-sole rubber bottom with vintage wrap",
      "Sweat-wicking leather-lined interior comfort"
    ],
    description: "Indulge in high-grade textures with the Suede Beige Sneakers. Carefully crafted from premium double-napped genuine suede, these cup-sole sneakers combine a padded dual-foam step-in lining with sweat-wicking genuine leather interiors, guaranteeing vintage style and luxurious comfort.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Footwear",
      "Lifestyle": "Premium Casual / Smart Casual",
      "Upper Material": "Premium Genuine Suede Leather",
      "Sole Type": "Vintage Rubber Cupsole",
      "Comfort Features": "Dual-Foam Padded Lining",
      "Interior Material": "Sweat-Wicking Soft Leather",
      "Weight": "440g (Single Shoe Size 8)"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 45,
    featured: true,
    trending: true
  },
  {
    name: "Neon Accent Sneakers",
    slug: "neon-accent-sneakers",
    brand: "HostelMart",
    category: "Sneakers",
    subcategory: "Platform Sneakers",
    price: 1599,
    originalPrice: 2499,
    discount: "36% OFF",
    rating: 4.8,
    ratingsCount: 2040,
    reviewsCount: 490,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
    ],
    colors: ["Neon Red", "Neon Green"],
    sizeOptions: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    highlights: [
      "Highly breathable engineered knit performance upper",
      "High-contrast electric neon detailing accents",
      "High-energy return shock absorbing running midsole",
      "Zonal traction carbon rubber outer sole pads",
      "Reflective laces for low-light night-run visibility"
    ],
    description: "Unleash high athletic performance with the Neon Accent Sneakers. Built with highly breathable engineered knit and zonal traction carbon rubber, these sport shoes are equipped with a high-energy return cushioning midsole and reflective security laces, providing supreme stability and speed.",
    specifications: {
      "Brand": "HostelMart",
      "Category": "Footwear",
      "Lifestyle": "Running / Sports Training",
      "Upper Material": "Engineered Knit Performance Fiber",
      "Sole Type": "Zonal Traction Carbon Rubber",
      "Midsole Technology": "High-Energy Return Cushioned Foam",
      "Safety features": "Reflective Night-Running Laces",
      "Weight": "350g (Single Shoe Size 8)"
    },
    seller: {
      name: "HostelMart Official",
      rating: 4.5,
      isVerified: true
    },
    returnPolicy: "7 Days Return & Exchange",
    deliveryDays: 1,
    stock: 40,
    featured: true,
    trending: true
  }
];

async function seedBoxersWithoutExit() {
  try {
    console.log("🌱 Checking database for boxer, shorts, t-shirt, shirt, and sneaker products...");
    const allProducts = [...boxersData, ...shortsData, ...tshirtsData, ...shirtsData, ...sneakersData];
    for (const prod of allProducts) {
      await Product.findOneAndUpdate(
        { slug: prod.slug },
        prod,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✅ Product [${prod.name}] (${prod.category}) seeded/updated successfully.`);
    }
    console.log("🎉 All premium fashion products seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding Error in seedBoxersWithoutExit:", error);
    throw error;
  }
}

module.exports = { seedBoxersWithoutExit };
