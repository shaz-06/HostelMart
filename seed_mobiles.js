/**
 * seed_mobiles.js
 * Comprehensive database seeding script for HostelMart to dynamically add
 * exactly 510 realistic Smartphone products across 20+ brands and 4 key sections.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const Product = require('./models/Product');
const connectDB = require('./lib/mongodb');

// Brand and Series definitions matching instructions exactly
const brandSeries = {
    "Apple": ["iPhone", "iPhone Pro", "iPhone Pro Max", "iPhone Plus", "iPhone SE"],
    "Samsung": [
        "Galaxy S Series", "Galaxy A Series", "Galaxy M Series", "Galaxy F Series",
        "Galaxy Z Fold Series", "Galaxy Z Flip Series", "Galaxy Note Series",
        "Galaxy C Series", "Galaxy J Series", "Galaxy S Ultra", "Galaxy Z Fold Gaming"
    ],
    "OnePlus": ["OnePlus Number Series", "OnePlus Nord Series", "OnePlus Ace Series", "OnePlus R Series"],
    "Xiaomi": [
        "Xiaomi Number Series", "Xiaomi T Series", "Xiaomi Ultra Series", "Xiaomi Civi Series",
        "Redmi Series", "Redmi Note Series", "Redmi A Series", "Redmi K Series", "Black Shark Pro"
    ],
    "POCO": ["POCO F Series", "POCO X Series", "POCO M Series", "POCO C Series"],
    "Realme": ["Realme Number Series", "Realme GT Series", "Realme Narzo Series", "Realme C Series", "Realme V Series", "Realme Q Series"],
    "Vivo": ["Vivo X Series", "Vivo V Series", "Vivo Y Series", "Vivo T Series", "Vivo S Series"],
    "iQOO": ["iQOO Number Series", "iQOO Neo Series", "iQOO Z Series", "iQOO U Series"],
    "Oppo": ["Oppo Find X Series", "Oppo Reno Series", "Oppo F Series", "Oppo A Series", "Oppo K Series"],
    "Google": ["Pixel Number Series", "Pixel A Series", "Pixel Fold"],
    "Nothing": ["Nothing Phone Series", "CMF Phone Series"],
    "ASUS": ["ASUS ROG Phone Series"],
    "Sony": ["Sony Xperia Series"],
    "Motorola": ["Motorola Edge Series", "Motorola Razr Series"],
    "Nokia": ["Nokia G/X/C Series"],
    "Huawei": ["Huawei Mate/P Series"],
    "Honor": ["Honor Magic Series"],
    "Infinix": ["Infinix Note Series"],
    "Tecno": ["Tecno Camon Series"],
    "Lenovo": ["Lenovo Legion Series"]
};

// Custom Niche / Extra Brands to fulfill the complete requirement list
const nicheBrands = {
    "Lava": ["Lava Blaze Series"],
    "Jio": ["JioPhone Series"],
    "TCL": ["TCL Series"],
    "CAT": ["CAT Rugged Phones"],
    "Fairphone": ["Fairphone Series"],
    "Vertu": ["Vertu Luxury Smartphones"]
};

// Merge all brandSeries pools
const allBrandSeries = { ...brandSeries, ...nicheBrands };
const brandList = Object.keys(allBrandSeries);

// Curated high-quality Unsplash image pools for smartphones
const categoryImages = {
    "Gaming": [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=800&auto=format&fit=crop"
    ],
    "Premium": [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop"
    ],
    "Student": [
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?q=80&w=800&auto=format&fit=crop"
    ],
    "Standard": [
        "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1565849906662-68a83a277a1e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=800&auto=format&fit=crop"
    ]
};

// Specs definition pools for deterministic variations
const processors = [
    "Snapdragon 8 Gen 3", "Apple A18 Pro", "MediaTek Dimensity 9300+",
    "Snapdragon 8s Gen 3", "Google Tensor G4", "MediaTek Dimensity 8300 Ultra",
    "Snapdragon 7+ Gen 3", "Snapdragon 6 Gen 1", "MediaTek Helio G99 Ultimate",
    "Apple A17 Pro", "Apple A16 Bionic", "Snapdragon 4 Gen 2", "Unisoc T606",
    "Snapdragon 8 Gen 4", "MediaTek Dimensity 9400", "Google Tensor G3"
];

const rams = ["4GB LPDDR4X", "6GB LPDDR4X", "8GB LPDDR5X", "12GB LPDDR5X", "16GB LPDDR5X", "24GB LPDDR5X"];
const storages = ["64GB eMMC 5.1", "128GB UFS 3.1", "256GB UFS 4.0", "512GB UFS 4.0", "1TB UFS 4.0"];
const displays = [
    "6.1-inch Super Retina XDR OLED (60Hz)", "6.7-inch Super Retina XDR OLED (120Hz LTPO)",
    "6.8-inch Dynamic AMOLED 2X (120Hz)", "6.5-inch FHD+ IPS LCD (90Hz)",
    "6.78-inch AMOLED 1.5K (144Hz)", "6.67-inch AMOLED CrystalRes (120Hz)",
    "6.9-inch Foldable Dynamic AMOLED 2X (120Hz)", "6.82-inch BOE X1 LTPO OLED (120Hz)",
    "6.78-inch Full HD+ AMOLED (165Hz)"
];

const refreshRates = ["60Hz", "90Hz", "120Hz", "144Hz", "165Hz"];
const operatingSystems = [
    "iOS 18", "Android 14 (One UI 6.1)", "Android 14 (OxygenOS 14)",
    "Android 14 (HyperOS)", "Android 14 (Nothing OS 2.6)", "Android 14 (Pixel UI)",
    "Android 14 (OriginOS 4)", "Android 14 (ColorOS 14)", "Android 14 (MyUX)",
    "iOS 17", "JioOS"
];

const rearCameras = [
    "50MP Triple OIS (50MP Main + 50MP UltraWide + 50MP Telephoto)",
    "200MP Quad OIS (200MP Main + 50MP Periscope + 12MP UltraWide + 10MP Telephoto)",
    "48MP Dual OIS (48MP Main + 12MP UltraWide)",
    "108MP Triple (108MP Main + 8MP UltraWide + 2MP Macro)",
    "50MP Dual OIS (50MP Main + 12MP UltraWide)",
    "12MP Dual (12MP Main + 12MP UltraWide)",
    "64MP Triple OIS (64MP Main + 8MP UltraWide + 32MP Telephoto)",
    "50MP Single Camera"
];

const frontCameras = [
    "12MP TrueDepth Front Camera", "16MP Selfie Camera", "32MP Dual-LED Front Camera",
    "50MP Autofocus Front Camera", "8MP Front Camera"
];

const batteries = [
    "3240 mAh Li-Ion", "4400 mAh Li-Po", "5000 mAh Li-Po", "5400 mAh Li-Po",
    "5500 mAh Li-Po", "6000 mAh Li-Po", "6500 mAh Li-Po"
];

const chargingSpeeds = [
    "15W MagSafe Wireless Charging", "25W Wired Charging", "45W PPS Super Fast Charging",
    "67W SuperVOOC Flash Charge", "80W SuperVOOC Charge", "100W SuperVOOC Charging",
    "120W HyperCharge", "150W SUPERVOOC Power Charge"
];

const fingerprintTypes = [
    "Under-Display Ultrasonic Fingerprint", "Under-Display Optical Fingerprint",
    "Side-Mounted Capacitive Fingerprint", "Rear-Mounted Capacitive Fingerprint",
    "Face ID 3D Face Unlock (No Fingerprint)", "Capacitive Home Button Fingerprint"
];

const waterResistances = [
    "IP68 Dust/Water Resistant (up to 6m for 30 mins)", "IP67 Dust/Water Resistant (up to 1m)",
    "IP65 Dust/Water Resistant", "IP54 Splash Resistant", "IPX8 Waterproof (Foldable Design)",
    "MIL-STD-810H Military Grade Shockproof & Waterproof"
];

const colorsPool = [
    "Titanium Gray", "Space Black", "Pearl White", "Ocean Blue", "Sunset Orange",
    "Mint Green", "Lilac Purple", "Emerald Green", "Cosmos Gold", "Ruby Red"
];

const specialCategories = [
    "Fold Phones", "Flip Phones", "Rollable Phones", "Waterproof Phones",
    "Shockproof Phones", "Military Grade Phones", "AI Camera Phones",
    "AI Productivity Phones", "On-device AI Phones", "Budget Student Phones",
    "Online Class Phones", "Gaming Student Phones", "Creator Phones",
    "Photography Phones", "Productivity Phones"
];

// Generate exactly 510 distinct, realistic, uniquely-named, SEO-optimized smartphones
const generate510Smartphones = () => {
    const specialDeals = [
        {
            name: "realme P4 5G (MediaTek D7400 / 12GB / 256GB)",
            slug: "realme-p4-5g",
            brand: "Realme",
            description: "Step up to the next level of performance with realme P4 5G. Engineered with the MediaTek D7400 Hyper Vision AI Chip, an impressive 7000mAh battery, and superfast 80W charging, this smartphone is built for all-day performance. Features an immersive 144Hz high refresh display and a sleek 7.58mm ultra-slim profile.",
            category: "Electronics & Tech",
            subcategory: "Mobiles",
            section: "Tech Essentials",
            type: "Premium Smartphone",
            processor: "MediaTek D7400 Hyper Vision AI Chip",
            ram: "12GB LPDDR5X",
            storage: "256GB UFS 4.0",
            display: "6.78-inch AMOLED 1.5K (144Hz)",
            refreshRate: "144Hz",
            battery: "7000 mAh Li-Po",
            chargingSpeed: "80W SuperVOOC Charge",
            rearCamera: "50MP Dual OIS (50MP Main + 12MP UltraWide)",
            frontCamera: "16MP Selfie Camera",
            operatingSystem: "Android 14 (Realme UI 5.0)",
            aiFeatures: "Smart AI Photo Enhancer, Smart Scene Optimizer",
            connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3, NFC",
            waterResistance: "IP65 Dust/Water Resistant",
            fingerprintType: "Under-Display Optical Fingerprint",
            colors: ["Silver", "Titanium Gray"],
            image: "media__1778090802439.png",
            images: ["media__1778090802439.png", "media__1778090802439.png"],
            price: 19999,
            originalPrice: 21999,
            discount: "9% OFF",
            stock: 30,
            rating: 4.4,
            ratingsCount: 1250,
            highlights: [
                "MediaTek D7400 Hyper Vision AI Chip with dedicated dual NPU processing",
                "Massive 7000mAh battery for 2+ days of continuous usage",
                "Superfast 80W flash charging refills battery to 50% in 20 minutes",
                "Sleek 7.58mm ultra-thin lightweight body fits perfectly in hand",
                "Immersive 144Hz high-refresh rate smooth scrolling display"
            ],
            specifications: {
                "Brand": "Realme",
                "Series Name": "Realme P Series",
                "Processor": "MediaTek D7400 Hyper Vision AI Chip",
                "RAM Size": "12GB",
                "Storage Capacity": "256GB",
                "Display Info": "6.78-inch AMOLED 1.5K (144Hz)",
                "Refresh Rate": "144Hz",
                "Rear Camera Specs": "50MP Dual OIS",
                "Front Camera Specs": "16MP",
                "Battery details": "7000 mAh",
                "Fast Charging speed": "80W",
                "Security Type": "Under-Display Optical Fingerprint",
                "Water Proof Class": "IP65",
                "Mobile Class": "AI Camera Phones"
            },
            featured: true,
            trending: true,
            createdAt: new Date()
        },
        {
            name: "realme P4X 5G (Dimensity 7400 AI / 16GB / 512GB)",
            slug: "realme-p4x-5g",
            brand: "Realme",
            description: "Experience the fastest segment smartphone with the realme P4X 5G. Outfitted with the MediaTek Dimensity 7400 AI, an enormous 7000mAh battery, and 45W superfast charging, this device delivers uninterrupted endurance. Features a brighter 1000nit display with a fluid 144Hz refresh rate, all under an award-winning beautiful purple aesthetic.",
            category: "Electronics & Tech",
            subcategory: "Mobiles",
            section: "Tech Essentials",
            type: "Premium Flagship Phone",
            processor: "MediaTek Dimensity 7400 AI",
            ram: "16GB LPDDR5X",
            storage: "512GB UFS 4.0",
            display: "6.7-inch FHD+ AMOLED (144Hz)",
            refreshRate: "144Hz",
            battery: "7000 mAh Li-Po",
            chargingSpeed: "45W SuperVOOC Charge",
            rearCamera: "50MP Triple OIS (50MP Main + 8MP UltraWide + 2MP Macro)",
            frontCamera: "16MP Selfie Camera",
            operatingSystem: "Android 14 (Realme UI 5.0)",
            aiFeatures: "Smart AI Photo Enhancer, Smart Scene Optimizer",
            connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3, NFC",
            waterResistance: "IP65 Dust/Water Resistant",
            fingerprintType: "Under-Display Optical Fingerprint",
            colors: ["Lilac Purple", "Titanium Gray"],
            image: "media__1778090823169.png",
            images: ["media__1778090823169.png", "media__1778090823169.png"],
            price: 19999,
            originalPrice: 21999,
            discount: "9% OFF",
            stock: 35,
            rating: 4.5,
            ratingsCount: 1480,
            highlights: [
                "MediaTek Dimensity 7400 AI processor handles heavy-duty tasks with ease",
                "Segments biggest 7000mAh battery guarantees record-breaking endurance",
                "Superfast 45W flash charging keeps you connected on the go",
                "Super-bright 1000nit high refresh rate 144Hz display panels",
                "Award-winning elegant lavender purple aesthetic design"
            ],
            specifications: {
                "Brand": "Realme",
                "Series Name": "Realme P Series",
                "Processor": "MediaTek Dimensity 7400 AI",
                "RAM Size": "16GB",
                "Storage Capacity": "512GB",
                "Display Info": "6.7-inch FHD+ AMOLED (144Hz)",
                "Refresh Rate": "144Hz",
                "Rear Camera Specs": "50MP Triple OIS",
                "Front Camera Specs": "16MP",
                "Battery details": "7000 mAh",
                "Fast Charging speed": "45W",
                "Security Type": "Under-Display Optical Fingerprint",
                "Water Proof Class": "IP65",
                "Mobile Class": "AI Camera Phones"
            },
            featured: true,
            trending: true,
            createdAt: new Date()
        },
        {
            name: "vivo T4 Lite 5G (MediaTek D6300 / 8GB / 128GB)",
            slug: "vivo-t4-lite-5g",
            brand: "Vivo",
            description: "Get value, power, and design combined in the vivo T4 Lite 5G. Running on the MediaTek Dimensity 6300 processor, it features a highly capable 5G connectivity setup and beautiful dual rear cameras. Designed with a gorgeous matte dark navy blue back, this value champion delivers excellent features at a very smart price.",
            category: "Electronics & Tech",
            subcategory: "Mobiles",
            section: "Student Essentials",
            type: "Budget Smartphone",
            processor: "MediaTek Dimensity 6300",
            ram: "8GB LPDDR4X",
            storage: "128GB UFS 2.2",
            display: "6.56-inch FHD+ LCD (90Hz)",
            refreshRate: "90Hz",
            battery: "5000 mAh Li-Po",
            chargingSpeed: "18W Fast Charging",
            rearCamera: "50MP Dual Camera (50MP Main + 2MP Depth)",
            frontCamera: "8MP Front Camera",
            operatingSystem: "Android 14 (Funtouch OS 14)",
            aiFeatures: "Standard AI Portrait Mode, Smart Beautification",
            connectivity: "5G, Wi-Fi 5, Bluetooth 5.2, GPS",
            waterResistance: "IP54 Splash Resistant",
            fingerprintType: "Side-Mounted Capacitive Fingerprint",
            colors: ["Ocean Blue", "Space Black"],
            image: "media__1778090834961.png",
            images: ["media__1778090834961.png", "media__1778090834961.png"],
            price: 12999,
            originalPrice: 13999,
            discount: "7% OFF",
            stock: 45,
            rating: 4.3,
            ratingsCount: 2350,
            highlights: [
                "MediaTek Dimensity 6300 5G processor for fast daily multitasking",
                "Best-value 5G smartphone segment winner for budget-conscious buyers",
                "Immersive 90Hz smooth high refresh rate display panels",
                "5000mAh battery with optimized FunTouch OS power-saving controls",
                "Beautiful premium back panel texture with award-winning layout styling"
            ],
            specifications: {
                "Brand": "Vivo",
                "Series Name": "Vivo T Series",
                "Processor": "MediaTek Dimensity 6300",
                "RAM Size": "8GB",
                "Storage Capacity": "128GB",
                "Display Info": "6.56-inch FHD+ LCD (90Hz)",
                "Refresh Rate": "90Hz",
                "Rear Camera Specs": "50MP Dual Camera",
                "Front Camera Specs": "8MP",
                "Battery details": "5000 mAh",
                "Fast Charging speed": "18W",
                "Security Type": "Side-Mounted Capacitive Fingerprint",
                "Water Proof Class": "IP54",
                "Mobile Class": "Budget Student Phones"
            },
            featured: true,
            trending: true,
            createdAt: new Date()
        },
        {
            name: "Google Pixel 10a (Tensor G5 AI / 8GB / 128GB)",
            slug: "google-pixel-10a",
            brand: "Google",
            description: "Welcome to the ultimate portrait and AI-powered smartphone experience: Google Pixel 10a. Driven by Google's proprietary Tensor G5 AI chip and outfitted with premium on-device Gemini intelligence, this device captures incredible, life-like pictures. Finished in a gorgeous light cornflower blue color, it represents the best smartphone for portrait photography.",
            category: "Electronics & Tech",
            subcategory: "Mobiles",
            section: "Premium Essentials",
            type: "Premium Flagship Phone",
            processor: "Google Tensor G5 AI",
            ram: "8GB LPDDR5X",
            storage: "128GB UFS 3.1",
            display: "6.1-inch OLED (120Hz)",
            refreshRate: "120Hz",
            battery: "4700 mAh Li-Po",
            chargingSpeed: "30W Fast Charging",
            rearCamera: "50MP Dual OIS (50MP Main + 12MP UltraWide)",
            frontCamera: "10.5MP TrueDepth Selfie Camera",
            operatingSystem: "Android 15 (Pixel UI)",
            aiFeatures: "Gemini Nano, Magic Eraser, Best Take, Real Tone, Circle to Search",
            connectivity: "5G, Wi-Fi 7, Bluetooth 5.4, NFC",
            waterResistance: "IP67 Dust/Water Resistant",
            fingerprintType: "Under-Display Optical Fingerprint",
            colors: ["Ocean Blue", "Space Black"],
            image: "media__1778090848379.png",
            images: ["media__1778090848379.png", "media__1778090848379.png"],
            price: 46999,
            originalPrice: 49999,
            discount: "6% OFF",
            stock: 25,
            rating: 4.5,
            ratingsCount: 890,
            highlights: [
                "Google Tensor G5 AI chip with advanced TPU for on-device machine learning",
                "Best smartphone for portraits and cinematic skin-tone captures",
                "Gemini Nano assistant integrated natively for on-screen smart reading and summaries",
                "Gorgeous cornflower blue light-alloy body with IP67 weather sealing",
                "Fluid 120Hz smooth high refresh OLED display panels"
            ],
            specifications: {
                "Brand": "Google",
                "Series Name": "Pixel A Series",
                "Processor": "Google Tensor G5 AI",
                "RAM Size": "8GB",
                "Storage Capacity": "128GB",
                "Display Info": "6.1-inch OLED (120Hz)",
                "Refresh Rate": "120Hz",
                "Rear Camera Specs": "50MP Dual OIS",
                "Front Camera Specs": "10.5MP",
                "Battery details": "4700 mAh",
                "Fast Charging speed": "30W",
                "Security Type": "Under-Display Optical Fingerprint",
                "Water Proof Class": "IP67",
                "Mobile Class": "Photography Phones"
            },
            featured: true,
            trending: true,
            createdAt: new Date()
        },
        {
            name: "Motorola Edge 60 Fusion (Snapdragon 7s Gen 3 / 12GB / 256GB)",
            slug: "motorola-edge-60-fusion",
            brand: "Motorola",
            description: "Experience absolute visual immersion with the Motorola Edge 60 Fusion. Equipped with a brilliant 1.5K True Quad-Curved display, the powerhouse Snapdragon 7s Gen 3 processor, and a professional-grade Sony-LYT 700C OIS camera, it represents the best build quality in its class. Finished in an elegant Pantone-validated matte teal back, this premium device is a masterpiece.",
            category: "Electronics & Tech",
            subcategory: "Mobiles",
            section: "Premium Essentials",
            type: "Premium Flagship Phone",
            processor: "Snapdragon 7s Gen 3",
            ram: "12GB LPDDR5X",
            storage: "256GB UFS 4.0",
            display: "6.7-inch 1.5K True Quad-Curved AMOLED (144Hz)",
            refreshRate: "144Hz",
            battery: "5000 mAh Li-Po",
            chargingSpeed: "68W TurboPower Charge",
            rearCamera: "50MP Dual OIS (50MP Main Sony-LYT 700C + 13MP UltraWide)",
            frontCamera: "32MP Selfie Camera",
            operatingSystem: "Android 14 (MyUX)",
            aiFeatures: "Moto AI Engine, Smart Photo Erase, AI Style Sync",
            connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3, NFC",
            waterResistance: "IP68 Dust/Water Resistant",
            fingerprintType: "Under-Display Optical Fingerprint",
            colors: ["Mint Green", "Space Black"],
            image: "media__1778090861210.png",
            images: ["media__1778090861210.png", "media__1778090861210.png"],
            price: 24999,
            originalPrice: 27999,
            discount: "10% OFF",
            stock: 40,
            rating: 4.4,
            ratingsCount: 1620,
            highlights: [
                "Snapdragon 7s Gen 3 processor for top-tier midrange speed and efficiency",
                "World's most immersive 1.5K True Quad-Curved bezel-less AMOLED display",
                "Professional-grade Sony-LYT 700C main camera with OIS for low-light stability",
                "IP68 dust and water resistance with MIL-STD-810H military-grade build",
                "Sleek Pantone-validated premium mint teal back panel craftsmanship"
            ],
            specifications: {
                "Brand": "Motorola",
                "Series Name": "Motorola Edge Series",
                "Processor": "Snapdragon 7s Gen 3",
                "RAM Size": "12GB",
                "Storage Capacity": "256GB",
                "Display Info": "6.7-inch 1.5K True Quad-Curved AMOLED (144Hz)",
                "Refresh Rate": "144Hz",
                "Rear Camera Specs": "50MP Dual OIS",
                "Front Camera Specs": "32MP",
                "Battery details": "5000 mAh",
                "Fast Charging speed": "68W",
                "Security Type": "Under-Display Optical Fingerprint",
                "Water Proof Class": "IP68",
                "Mobile Class": "Military Grade Phones"
            },
            featured: true,
            trending: true,
            createdAt: new Date()
        }
    ];
    const products = [...specialDeals];
    const countToGenerate = 510;

    for (let i = 0; i < countToGenerate; i++) {
        const brand = brandList[i % brandList.length];
        const seriesOptions = allBrandSeries[brand];
        const series = seriesOptions[(Math.floor(i / brandList.length)) % seriesOptions.length];

        // 1. Determine Section, Specs, and Price based on model characteristics
        let section = "Tech Essentials";
        let type = "Standard Smartphone";
        let isGaming = false;
        let isPremium = false;
        let isBudget = false;

        // Flags based on series name
        if (
            series.includes("Gaming") || series.includes("ROG Phone") ||
            series.includes("Black Shark") || series.includes("Legion") ||
            series.includes("GT Series") || series.includes("IQOO") ||
            series.includes("RedMagic") || series.includes("K Series")
        ) {
            isGaming = true;
            section = "Gaming Essentials";
            type = "Gaming Smartphone";
        } else if (
            series.includes("Fold") || series.includes("Flip") ||
            series.includes("Pro Max") || series.includes("Ultra") ||
            series.includes("Find X") || series.includes("Razr") ||
            series.includes("Luxury") || series.includes("Mate/P") ||
            brand === "Vertu"
        ) {
            isPremium = true;
            section = "Premium Essentials";
            type = series.includes("Fold") ? "Foldable Phone" : (series.includes("Flip") || series.includes("Razr") ? "Flip Phone" : "Premium Flagship Phone");
        } else if (
            series.includes("JioPhone") || series.includes("C Series") ||
            series.includes("Narzo") || series.includes("M Series") ||
            series.includes("F Series") || series.includes("A Series") ||
            series.includes("Y Series") || series.includes("U Series") ||
            series.includes("CMF Phone") || series.includes("Blaze")
        ) {
            isBudget = true;
            section = "Student Essentials";
            type = "Budget Smartphone";
        } else {
            // General business/tech/productivity mid-range smartphones (Pixel A, Nord, Edge, Reno, Honor Magic, V series)
            section = (i % 2 === 0) ? "Tech Essentials" : "Student Essentials";
            type = "Productivity Phone";
        }

        // Special Categories distribution
        let specCategory = specialCategories[i % specialCategories.length];
        if (isGaming) specCategory = "Gaming Student Phones";
        else if (isPremium) {
            if (type.includes("Fold")) specCategory = "Fold Phones";
            else if (type.includes("Flip")) specCategory = "Flip Phones";
            else specCategory = i % 2 === 0 ? "Photography Phones" : "AI Productivity Phones";
        } else if (isBudget) {
            specCategory = i % 2 === 0 ? "Budget Student Phones" : "Online Class Phones";
        }

        if (series.includes("Rugged") || series.includes("CAT")) {
            specCategory = "Military Grade Phones";
            type = "Rugged Smartphone";
        }

        // 2. Select Processor
        let processor = processors[i % processors.length];
        if (brand === "Apple") {
            if (series === "iPhone SE") {
                processor = "Apple A15 Bionic";
            } else if (series.includes("Pro")) {
                processor = i % 2 === 0 ? "Apple A18 Pro" : "Apple A17 Pro";
            } else {
                processor = "Apple A16 Bionic";
            }
        } else if (series.includes("JioPhone") || series.includes("C Series") || series.includes("A Series")) {
            processor = i % 2 === 0 ? "Unisoc T606" : "Snapdragon 4 Gen 2";
        } else if (isGaming) {
            const gamingCPUs = ["Snapdragon 8 Gen 4", "MediaTek Dimensity 9400", "Snapdragon 8 Gen 3", "MediaTek Dimensity 9300+"];
            processor = gamingCPUs[i % gamingCPUs.length];
        } else if (isPremium) {
            const premiumCPUs = ["Snapdragon 8 Gen 3", "Apple A18 Pro", "MediaTek Dimensity 9300+", "Google Tensor G4"];
            processor = premiumCPUs[i % premiumCPUs.length];
        } else {
            const normalCPUs = ["Snapdragon 8s Gen 3", "MediaTek Dimensity 8300 Ultra", "Snapdragon 7+ Gen 3", "Snapdragon 6 Gen 1", "MediaTek Helio G99 Ultimate"];
            processor = normalCPUs[i % normalCPUs.length];
        }

        // 3. Select Biometrics (Fingerprint Type)
        let fingerprintType = fingerprintTypes[i % fingerprintTypes.length];
        if (brand === "Apple") {
            fingerprintType = (series === "iPhone SE") ? "Capacitive Home Button Fingerprint" : "Face ID 3D Face Unlock (No Fingerprint)";
        } else if (isBudget) {
            fingerprintType = i % 2 === 0 ? "Side-Mounted Capacitive Fingerprint" : "Rear-Mounted Capacitive Fingerprint";
        } else if (isPremium || isGaming) {
            fingerprintType = i % 2 === 0 ? "Under-Display Ultrasonic Fingerprint" : "Under-Display Optical Fingerprint";
        }

        // 4. Select Cameras
        let rearCamera = rearCameras[i % rearCameras.length];
        let frontCamera = frontCameras[i % frontCameras.length];
        if (brand === "Apple") {
            frontCamera = "12MP TrueDepth Front Camera";
            if (series.includes("Pro")) rearCamera = "48MP Triple OIS (48MP Main + 12MP UltraWide + 12MP Telephoto)";
            else rearCamera = "48MP Dual OIS (48MP Main + 12MP UltraWide)";
        } else if (isBudget) {
            rearCamera = i % 2 === 0 ? "50MP Dual OIS (50MP Main + 2MP Portrait)" : "108MP Triple (108MP Main + 8MP UltraWide + 2MP Macro)";
            frontCamera = "8MP Front Camera";
        } else if (isPremium) {
            rearCamera = "200MP Quad OIS (200MP Main + 50MP Periscope + 12MP UltraWide + 10MP Telephoto)";
            frontCamera = "32MP Autofocus Front Camera";
        }

        // 5. Select RAM & Storage
        let ram = rams[i % rams.length];
        let storage = storages[i % storages.length];
        if (brand === "Apple") {
            ram = series.includes("Pro") ? "8GB LPDDR5X" : "6GB LPDDR4X";
            if (storage.includes("eMMC") || storage.includes("4GB")) storage = "128GB UFS 3.1";
        } else if (isBudget) {
            ram = i % 2 === 0 ? "4GB LPDDR4X" : "6GB LPDDR4X";
            storage = i % 2 === 0 ? "64GB eMMC 5.1" : "128GB UFS 3.1";
        } else {
            if (ram.includes("4GB") || ram.includes("6GB")) ram = "12GB LPDDR5X";
            if (storage.includes("64GB")) storage = "256GB UFS 4.0";

            if (isGaming || isPremium) {
                const highRams = ["12GB LPDDR5X", "16GB LPDDR5X", "24GB LPDDR5X"];
                ram = highRams[i % highRams.length];
                const highStorages = ["256GB UFS 4.0", "512GB UFS 4.0", "1TB UFS 4.0"];
                storage = highStorages[i % highStorages.length];
            }
        }

        // 6. Select Display & Refresh Rate
        let display = displays[i % displays.length];
        let refreshRate = refreshRates[i % refreshRates.length];
        if (brand === "Apple") {
            if (series.includes("Pro") || series.includes("Max")) {
                display = "6.7-inch Super Retina XDR OLED (120Hz LTPO)";
                refreshRate = "120Hz";
            } else {
                display = "6.1-inch Super Retina XDR OLED (60Hz)";
                refreshRate = "60Hz";
            }
        } else if (isGaming) {
            display = "6.78-inch Full HD+ AMOLED (165Hz)";
            const highHz = ["144Hz", "165Hz"];
            refreshRate = highHz[i % highHz.length];
        } else if (isPremium) {
            display = type.includes("Fold") ? "6.9-inch Foldable Dynamic AMOLED 2X (120Hz)" : "6.8-inch Dynamic AMOLED 2X (120Hz)";
            refreshRate = "120Hz";
        } else if (isBudget) {
            display = "6.5-inch FHD+ IPS LCD (90Hz)";
            refreshRate = i % 2 === 0 ? "60Hz" : "90Hz";
        } else {
            display = "6.67-inch AMOLED CrystalRes (120Hz)";
            refreshRate = "120Hz";
        }

        // 7. Select Operating System
        let operatingSystem = operatingSystems[i % operatingSystems.length];
        if (brand === "Apple") {
            operatingSystem = (series.includes("16") || i % 2 === 0) ? "iOS 18" : "iOS 17";
        } else if (series.includes("JioPhone")) {
            operatingSystem = "JioOS";
        } else if (brand === "Google") {
            operatingSystem = "Android 14 (Pixel UI)";
        } else {
            const defaultOS = ["Android 14 (One UI 6.1)", "Android 14 (OxygenOS 14)", "Android 14 (HyperOS)", "Android 14 (Nothing OS 2.6)", "Android 14 (ColorOS 14)"];
            operatingSystem = defaultOS[i % defaultOS.length];
        }

        // 8. Colors, Water Resistance, Batteries & Charging
        const color = colorsPool[i % colorsPool.length];
        const secondaryColor = colorsPool[(i + 2) % colorsPool.length];
        const colors = [color, secondaryColor];

        const waterResistance = waterResistances[i % waterResistances.length];
        const battery = batteries[i % batteries.length];
        const chargingSpeed = chargingSpeeds[i % chargingSpeeds.length];

        const connectivity = i % 2 === 0 ? "5G (SA/NSA), Wi-Fi 7, Bluetooth 5.4, NFC" : "5G, Wi-Fi 6E, Bluetooth 5.3, NFC";
        
        let aiFeatures = "Standard AI Photo Enhancer, Smart Scene Optimizer";
        if (brand === "Apple") {
            aiFeatures = "Apple Intelligence (On-device writing tools, clean up, Siri with screen awareness)";
        } else if (brand === "Samsung" && (series.includes("S ") || series.includes("Fold") || series.includes("Ultra"))) {
            aiFeatures = "Galaxy AI (Circle to Search, Live Translate, Note Assist, Generative Edit)";
        } else if (brand === "Google") {
            aiFeatures = "Gemini Nano (Summarize in Recorder, Smart Reply, Circle to Search, Pixel Studio)";
        } else if (isPremium) {
            aiFeatures = "On-device AI Engine (45 TOPS NPU, AI Smart Erase, AI Voice Summary)";
        }

        const warranty = "1 Year Brand Domestic Warranty";

        // 9. Deterministic Pricing Formulas
        let basePrice = 25000;
        if (brand === "Apple") {
            basePrice = series.includes("Pro Max") ? 139000 : (series.includes("Pro") ? 119000 : (series.includes("SE") ? 43900 : 79900));
        } else if (brand === "Vertu") {
            basePrice = 175000;
        } else if (series.includes("JioPhone")) {
            basePrice = 6490;
        } else if (type.includes("Foldable")) {
            basePrice = 149000;
        } else if (type.includes("Flip")) {
            basePrice = 79900;
        } else if (isGaming) {
            basePrice = 54900;
        } else if (isPremium) {
            basePrice = 84900;
        } else if (isBudget) {
            basePrice = 11900;
        }

        // Spec modifiers
        let cpuMod = 0;
        if (processor.includes("A18 Pro") || processor.includes("8 Gen 4") || processor.includes("9400")) cpuMod = 25000;
        else if (processor.includes("A17 Pro") || processor.includes("8 Gen 3") || processor.includes("9300")) cpuMod = 12000;
        else if (processor.includes("Unisoc") || processor.includes("Celeron")) cpuMod = -4000;

        let ramMod = 0;
        if (ram.includes("24GB")) ramMod = 10000;
        else if (ram.includes("16GB")) ramMod = 5000;
        else if (ram.includes("4GB")) ramMod = -2000;

        let storageMod = 0;
        if (storage.includes("1TB")) storageMod = 15000;
        else if (storage.includes("512GB")) storageMod = 7000;
        else if (storage.includes("64GB")) storageMod = -2000;

        let price = Math.round(basePrice + cpuMod + ramMod + storageMod);
        if (price < 5990) price = 5990; // Floor price safety

        const originalPrice = Math.round(price * 1.18); // Staggered discount
        const discountVal = Math.round((1 - price / originalPrice) * 100);

        // Format a professional retail product name under 95 characters
        let name = `${brand} ${series.replace(" Series", "").replace(" Phones", "").replace(" Smartphones", "")} (${processor} / ${ram.split(" ")[0]} / ${storage.split(" ")[0]})`;
        if (name.length > 95) {
            name = `${brand} ${series.replace(" Series", "")} (${ram.split(" ")[0]} / ${storage.split(" ")[0]})`;
        }

        // SEO Slug generation guaranteeing absolute uniqueness
        const cleanSlug = name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        const slug = `${cleanSlug}-${i + 1}`;

        // Select specific image from pool
        let imageType = "Standard";
        if (isGaming) imageType = "Gaming";
        else if (isPremium) imageType = "Premium";
        else if (isBudget) imageType = "Student";

        const imagePool = categoryImages[imageType] || categoryImages["Standard"];
        const image = imagePool[i % imagePool.length];
        const hoverImage = imagePool[(i + 1) % imagePool.length];
        const images = [image, hoverImage];

        const rating = parseFloat((4.0 + ((i % 10) / 10)).toFixed(1));
        const ratingsCount = 10 + (i * 3) % 940;
        const stock = 5 + (i * 4) % 65;

        // Long highly-premium Flipkart description
        const description = `Discover next-generation capabilities with the ${brand} ${series}. Supercharged with the state-of-the-art ${processor} and packed with an ultra-responsive ${ram} RAM and ${storage} high-speed storage, this ${type} is ready for all your intense workloads. Experience cinema-grade visuals on its immersive ${display} screen, supported by a fluid ${refreshRate} refresh rate. Capture every detail with its highly advanced ${rearCamera} primary camera and beautiful ${frontCamera}. Complemented by ${fingerprintType} security and running on ${operatingSystem}, this smartphone guarantees up to ${battery.split(' ')[0]} mAh battery power with ${chargingSpeed}. Styled in premium ${color} craftsmanship, it is the ultimate dynamic companion for modern students and tech power-users.`;

        products.push({
            name,
            slug,
            brand,
            description,
            category: "Electronics & Tech",
            subcategory: "Mobiles",
            section,
            type,
            processor,
            ram,
            storage,
            display,
            refreshRate,
            battery,
            chargingSpeed,
            rearCamera,
            frontCamera,
            operatingSystem,
            aiFeatures,
            connectivity,
            waterResistance,
            fingerprintType,
            colors,
            image,
            images,
            price,
            originalPrice,
            discount: `${discountVal}% OFF`,
            stock,
            rating,
            ratingsCount,
            highlights: [
                `High-performance ${processor} processor with dedicated NPU cores`,
                `Advanced camera setup: ${rearCamera} for professional-grade photography`,
                `Immersive display: ${display} screen with vivid colors`,
                `Super-fast RAM: ${ram} memory and spacious ${storage} internal drive`,
                `Long-lasting ${battery} battery supporting high-speed ${chargingSpeed}`,
                `Pre-installed robust OS: ${operatingSystem} out of the box`
            ],
            specifications: {
                "Brand": brand,
                "Series Name": series,
                "Processor": processor,
                "RAM Size": ram,
                "Storage Capacity": storage,
                "Display Info": display,
                "Refresh Rate": refreshRate,
                "Rear Camera Specs": rearCamera,
                "Front Camera Specs": frontCamera,
                "Battery details": battery,
                "Fast Charging speed": chargingSpeed,
                "Security Type": fingerprintType,
                "Water Proof Class": waterResistance,
                "Mobile Class": specCategory
            },
            featured: i % 15 === 0,
            trending: i % 10 === 0,
            createdAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000)
        });
    }

    return products;
};

async function seedMobilesWithoutExit() {
    try {
        console.log("🧹 Cleaning existing Mobiles products from target category to prevent duplicate collisions...");
        
        // Clean all products under 'Electronics & Tech' -> 'Mobiles'
        const deleted = await Product.deleteMany({
            category: "Electronics & Tech",
            subcategory: "Mobiles"
        });
        
        console.log(`🗑️ Cleared ${deleted.deletedCount} Mobile products from database to ensure fresh seeding.`);

        const mobileProducts = generate510Smartphones();
        console.log(`🌱 Compiling and inserting ${mobileProducts.length} high-fidelity smartphone products into MongoDB Atlas...`);
        
        const inserted = await Product.insertMany(mobileProducts);
        console.log(`🎉 Seeded ${inserted.length} high-quality smartphone products successfully into HostelMart database!`);
    } catch (error) {
        console.error("❌ Seeding Error in seedMobilesWithoutExit:", error);
        throw error;
    }
}

async function seedDB() {
    try {
        console.log("🔌 Connecting to MongoDB Database...");
        await connectDB();
        console.log("✅ MongoDB Connected Successfully!");

        await seedMobilesWithoutExit();

        mongoose.connection.close();
        console.log("🔌 Database connection closed gracefully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Script Failed:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    seedDB();
} else {
    module.exports = { generateSmartphones: generate510Smartphones, seedMobilesWithoutExit };
}
