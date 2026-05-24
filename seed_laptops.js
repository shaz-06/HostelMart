/**
 * seed_laptops.js
 * Comprehensive database seeding script for HostelMart to dynamically add
 * at least 400 realistic Laptop products across 24 brands and 4 key sections.
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
    "Apple": ["MacBook Air", "MacBook Pro"],
    "Dell": ["Inspiron", "XPS", "Alienware", "Latitude", "Vostro", "Precision", "G Series", "G15 Gaming"],
    "HP": ["Pavilion", "Victus", "Omen", "Spectre", "Envy", "EliteBook", "ProBook", "Chromebook", "ZBook", "Essential Series", "Omen Transcend", "Victus Gaming"],
    "Lenovo": ["IdeaPad", "ThinkPad", "Legion", "Yoga", "LOQ", "ThinkBook", "Slim Series", "Chromebook", "Legion Slim", "Legion Pro", "LOQ Gaming"],
    "ASUS": ["ROG Zephyrus", "ROG Strix", "TUF Gaming", "VivoBook", "ZenBook", "ExpertBook", "Chromebook", "ProArt", "BR Series", "ROG Flow", "ROG Duo", "TUF Dash"],
    "Acer": ["Aspire", "Nitro", "Predator", "Swift", "Spin", "TravelMate", "Chromebook", "Extensa", "Predator Helios", "Predator Triton", "Nitro V"],
    "MSI": ["Titan", "Raider", "Stealth", "Vector", "Katana", "Sword", "Cyborg", "Modern", "Prestige", "Creator Series", "Stealth Studio", "Raider GE", "Vector GP", "Cyborg AI"],
    "Samsung": ["Galaxy Book", "Galaxy Book Pro", "Galaxy Book Ultra", "Chromebook"],
    "Microsoft": ["Surface Laptop", "Surface Pro", "Surface Book", "Surface Go", "Surface Studio Laptop"],
    "Razer": ["Razer Blade 14", "Razer Blade 15", "Razer Blade 16", "Razer Blade 18"],
    "Huawei": ["MateBook D14", "MateBook D15", "MateBook X Pro", "MateBook 16s"],
    "LG": ["LG Gram 14", "LG Gram 16", "LG Gram 17", "LG Gram Style"],
    "Gigabyte": ["Gigabyte AORUS 15", "Gigabyte AORUS 17", "Gigabyte G5", "Gigabyte AERO 16"],
    "Xiaomi": ["RedmiBook 14", "RedmiBook Pro 15", "Xiaomi Notebook Pro"],
    "Honor": ["Honor MagicBook 14", "Honor MagicBook 15", "Honor MagicBook X16"],
    "Framework": ["Framework Laptop 13", "Framework Laptop 16"],
    "Realme": ["Realme Book Slim", "Realme Book Prime"],
    "Infinix": ["Infinix InBook X1", "Infinix InBook X2", "Infinix ZERO Book"],
    "Jio": ["JioBook 11"],
    "Panasonic": ["Panasonic Toughbook 33", "Panasonic Toughbook 55"],
    "Google": ["Google Pixelbook Go"],
    "Tecno": ["Tecno MegaBook T1", "Tecno MegaBook S1"],
    "System76": ["System76 Lemur Pro", "System76 Oryx Pro", "System76 Pangolin"],
    "Vaio": ["Vaio FE14", "Vaio FE15", "Vaio SX14"]
};

// Curated high-quality Unsplash image pools based on laptop type
const categoryImages = {
    "Gaming": [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop"
    ],
    "Premium": [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop"
    ],
    "Student": [
        "https://images.unsplash.com/photo-1496181130204-755241544e35?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=800&auto=format&fit=crop"
    ],
    "Business": [
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1537498424274-c2834779886a?q=80&w=800&auto=format&fit=crop"
    ]
};

// Specs definition pools for deterministic variations
const processors = [
    "Intel Core i5-1335U", "Intel Core i7-1355U", "Intel Core i9-14900HX",
    "AMD Ryzen 5 7520U", "AMD Ryzen 7 7730U", "AMD Ryzen 9 7945HX",
    "Intel Core Ultra 5 125H", "Intel Core Ultra 7 155H", "Intel Core Ultra 9 185H",
    "Apple M3 Chip", "Apple M3 Pro Chip", "Apple M3 Max Chip",
    "Snapdragon X Elite X1E-78-100", "Snapdragon X Plus X1P-64-100",
    "Intel Celeron N4500", "MediaTek Kompanio 520"
];

const graphicsCards = [
    "Integrated Intel Iris Xe Graphics", "Integrated AMD Radeon 780M Graphics",
    "Integrated Intel Arc Graphics", "Integrated Apple 10-Core GPU",
    "Integrated Apple 18-Core GPU", "Integrated Apple 30-Core GPU",
    "NVIDIA GeForce RTX 4050 (6GB GDDR6)", "NVIDIA GeForce RTX 4060 (8GB GDDR6)",
    "NVIDIA GeForce RTX 4070 (8GB GDDR6)", "NVIDIA GeForce RTX 4080 (12GB GDDR6)",
    "NVIDIA GeForce RTX 4090 (16GB GDDR6)", "Integrated ARM Mali-G57 Graphics",
    "Intel UHD Graphics"
];

const rams = ["8GB LPDDR5", "16GB LPDDR5X", "32GB LPDDR5X", "64GB DDR5", "4GB LPDDR4X"];
const storages = ["256GB PCIe NVMe SSD", "512GB PCIe Gen4 NVMe SSD", "1TB PCIe Gen4 NVMe SSD", "2TB PCIe Gen4 NVMe SSD", "64GB eMMC", "128GB eMMC"];
const displays = [
    "13.3-inch WUXGA (1920 x 1200) IPS", "14.0-inch WQXGA (2560 x 1600) OLED",
    "15.6-inch Full HD (1920 x 1080) IPS", "16.0-inch WQXGA (2560 x 1600) IPS",
    "17.3-inch Ultra HD (3840 x 2160) Mini-LED", "13.6-inch Liquid Retina Display",
    "14.2-inch Liquid Retina XDR", "16.2-inch Liquid Retina XDR"
];

const refreshRates = ["60Hz", "90Hz", "120Hz", "144Hz", "165Hz", "240Hz"];
const operatingSystems = [
    "Windows 11 Home", "Windows 11 Pro", "macOS Sequoia", "ChromeOS", "JioOS",
    "Pop!_OS 22.04 LTS", "Ubuntu 24.04 LTS"
];

const batteryLifes = ["Up to 8 Hours", "Up to 12 Hours", "Up to 15 Hours", "Up to 18 Hours", "Up to 22 Hours", "Up to 6 Hours"];
const weights = ["1.24 kg", "1.40 kg", "1.65 kg", "1.85 kg", "2.10 kg", "2.50 kg", "3.20 kg", "0.99 kg"];
const colorsPool = ["Space Gray", "Midnight Black", "Platinum Silver", "Dark Ash Gray", "Starlight Gold", "Lunar White", "Aurora Blue", "Cosmos Slate"];

const portsPool = [
    "2x Thunderbolt 4, 1x USB-C, Headphone Jack, MagSafe 3",
    "1x USB-C, 2x USB-A 3.2, 1x HDMI 2.1, RJ45 Ethernet, Headphone Jack, SD Card Reader",
    "2x USB-C 3.2 (DisplayPort), 1x USB-A, Headphone Jack",
    "1x USB-A 2.0, 1x USB-C, MicroSD Slot, Headphone Jack"
];

const specialCategories = [
    "Gaming Laptops", "AI Creator Laptops", "Copilot+ PCs", "Coding Laptops",
    "Engineering Student Laptops", "Video Editing Laptops", "CAD Workstation Laptops",
    "Data Science Laptops", "Cybersecurity Laptops", "Online Class Laptops",
    "Budget Study Laptops", "Waterproof Laptops", "Rugged Industrial Laptops"
];

const brandList = Object.keys(brandSeries);

// Generate 412 distinct, realistic, uniquely-named, SEO-optimized laptops
const generate412Laptops = () => {
    const products = [];
    const countToGenerate = 412;

    for (let i = 0; i < countToGenerate; i++) {
        const brand = brandList[i % brandList.length];
        const seriesOptions = brandSeries[brand];
        const series = seriesOptions[(Math.floor(i / brandList.length)) % seriesOptions.length];

        // 1. Determine Section, Specs, and Price based on model characteristics
        let section = "Tech Essentials";
        let type = "Standard Notebook";
        let isGaming = false;
        let isPremium = false;
        let isBudget = false;

        // Flags based on series name
        if (
            series.includes("Alienware") || series.includes("Legion") || series.includes("Predator") ||
            series.includes("ROG") || series.includes("TUF") || series.includes("Nitro") ||
            series.includes("Katana") || series.includes("Raider") || series.includes("AORUS") ||
            series.includes("Omen") || series.includes("Victus") || series.includes("LOQ") ||
            series.includes("Cyborg") || series.includes("Vector") || series.includes("G Series") ||
            series.includes("G15") || series.includes("Sword") || series.includes("Oryx") ||
            series.includes("G5")
        ) {
            isGaming = true;
            section = "Gaming Essentials";
            type = "Gaming Laptop";
        } else if (
            series.includes("XPS") || series.includes("Spectre") || series.includes("ZenBook") ||
            series.includes("Galaxy Book Ultra") || series.includes("Surface Studio") ||
            series.includes("MateBook X Pro") || series.includes("LG Gram") || brand === "Apple" ||
            series.includes("Razer Blade") || series.includes("Creator") || series.includes("ProArt")
        ) {
            isPremium = true;
            section = "Premium Essentials";
            type = "Premium Thin & Light";
        } else if (
            series.includes("Chromebook") || series.includes("JioBook") || series.includes("Surface Go") ||
            series.includes("InBook") || series.includes("Essential Series") || series.includes("Extensa") ||
            series.includes("BR Series") || series.includes("Realme Book") || series.includes("FE14") ||
            series.includes("FE15") || series.includes("MegaBook T1")
        ) {
            isBudget = true;
            section = "Student Essentials";
            type = "Budget Laptop";
        } else {
            // General business/tech laptops (Inspiron, Pavilion, IdeaPad, Latitude, ExpertBook, EliteBook, ThinkPad, ThinkBook)
            section = (i % 2 === 0) ? "Tech Essentials" : "Student Essentials";
            type = "Business Laptop";
        }

        // Special Categories distribution
        let specCategory = specialCategories[i % specialCategories.length];
        if (isGaming) specCategory = "Gaming Laptops";
        else if (isPremium && i % 3 === 0) specCategory = "AI Creator Laptops";
        else if (isPremium && i % 3 === 1) specCategory = "Copilot+ PCs";
        else if (isBudget) specCategory = (i % 2 === 0) ? "Budget Study Laptops" : "Online Class Laptops";
        
        if (series.includes("Toughbook")) {
            specCategory = "Rugged Industrial Laptops";
            type = "Rugged Laptop";
        }

        // 2. Select Processor
        let processor = processors[i % processors.length];
        if (brand === "Apple") {
            if (series === "MacBook Air") {
                processor = "Apple M3 Chip";
            } else {
                processor = i % 2 === 0 ? "Apple M3 Pro Chip" : "Apple M3 Max Chip";
            }
        } else if (series.includes("Chromebook") || series.includes("JioBook")) {
            processor = i % 2 === 0 ? "Intel Celeron N4500" : "MediaTek Kompanio 520";
        } else if (isGaming) {
            const gamingCPUs = ["Intel Core i9-14900HX", "AMD Ryzen 9 7945HX", "Intel Core Ultra 9 185H", "Intel Core i7-14700HX", "AMD Ryzen 7 7840HS"];
            processor = gamingCPUs[i % gamingCPUs.length];
        } else if (isPremium) {
            const premiumCPUs = ["Intel Core Ultra 7 155H", "Intel Core Ultra 9 185H", "Snapdragon X Elite X1E-78-100", "AMD Ryzen 7 8840HS"];
            processor = premiumCPUs[i % premiumCPUs.length];
        } else {
            const normalCPUs = ["Intel Core i5-1335U", "Intel Core i7-1355U", "AMD Ryzen 5 7520U", "AMD Ryzen 7 7730U", "Intel Core Ultra 5 125H"];
            processor = normalCPUs[i % normalCPUs.length];
        }

        // 3. Select Graphics Card
        let graphicsCard = graphicsCards[i % graphicsCards.length];
        if (brand === "Apple") {
            if (processor.includes("Max")) graphicsCard = "Integrated Apple 30-Core GPU";
            else if (processor.includes("Pro")) graphicsCard = "Integrated Apple 18-Core GPU";
            else graphicsCard = "Integrated Apple 10-Core GPU";
        } else if (series.includes("Chromebook") || series.includes("JioBook")) {
            graphicsCard = "Intel UHD Graphics";
        } else if (isGaming) {
            const gpus = ["NVIDIA GeForce RTX 4050 (6GB GDDR6)", "NVIDIA GeForce RTX 4060 (8GB GDDR6)", "NVIDIA GeForce RTX 4070 (8GB GDDR6)", "NVIDIA GeForce RTX 4080 (12GB GDDR6)", "NVIDIA GeForce RTX 4090 (16GB GDDR6)"];
            graphicsCard = gpus[i % gpus.length];
        } else {
            const integrated = ["Integrated Intel Iris Xe Graphics", "Integrated AMD Radeon 780M Graphics", "Integrated Intel Arc Graphics"];
            graphicsCard = integrated[i % integrated.length];
        }

        // 4. Select RAM & Storage
        let ram = rams[i % rams.length];
        let storage = storages[i % storages.length];
        if (series.includes("Chromebook") || series.includes("JioBook")) {
            ram = i % 2 === 0 ? "4GB LPDDR4X" : "8GB LPDDR4X";
            storage = i % 2 === 0 ? "64GB eMMC" : "128GB eMMC";
        } else {
            if (ram === "4GB LPDDR4X") ram = "16GB LPDDR5X"; // upgrade for normal laptops
            if (storage.includes("eMMC")) storage = "512GB PCIe Gen4 NVMe SSD";

            if (isGaming || isPremium) {
                const highRams = ["16GB LPDDR5X", "32GB LPDDR5X", "64GB DDR5"];
                ram = highRams[i % highRams.length];
                const highStorages = ["1TB PCIe Gen4 NVMe SSD", "2TB PCIe Gen4 NVMe SSD"];
                storage = highStorages[i % highStorages.length];
            }
        }

        // 5. Select Display & Refresh Rate
        let display = displays[i % displays.length];
        let refreshRate = refreshRates[i % refreshRates.length];
        if (brand === "Apple") {
            if (series === "MacBook Air") {
                display = "13.6-inch Liquid Retina Display";
                refreshRate = "60Hz";
            } else {
                display = i % 2 === 0 ? "14.2-inch Liquid Retina XDR" : "16.2-inch Liquid Retina XDR";
                refreshRate = "120Hz";
            }
        } else if (isGaming) {
            display = i % 2 === 0 ? "15.6-inch Full HD (1920 x 1080) IPS" : "16.0-inch WQXGA (2560 x 1600) IPS";
            const highHz = ["144Hz", "165Hz", "240Hz"];
            refreshRate = highHz[i % highHz.length];
        } else if (isPremium) {
            display = "14.0-inch WQXGA (2560 x 1600) OLED";
            refreshRate = i % 2 === 0 ? "90Hz" : "120Hz";
        } else {
            display = "15.6-inch Full HD (1920 x 1080) IPS";
            refreshRate = "60Hz";
        }

        // 6. Select Operating System
        let operatingSystem = operatingSystems[i % operatingSystems.length];
        if (brand === "Apple") {
            operatingSystem = "macOS Sequoia";
        } else if (series.includes("Chromebook")) {
            operatingSystem = "ChromeOS";
        } else if (series.includes("JioBook")) {
            operatingSystem = "JioOS";
        } else if (brand === "System76") {
            operatingSystem = i % 2 === 0 ? "Pop!_OS 22.04 LTS" : "Ubuntu 24.04 LTS";
        } else {
            const pcOS = ["Windows 11 Home", "Windows 11 Pro"];
            operatingSystem = (isPremium || i % 4 === 0) ? "Windows 11 Pro" : "Windows 11 Home";
        }

        // 7. Select Color, Weight, Battery Life, Ports, and other specs
        const color = colorsPool[i % colorsPool.length];
        const secondaryColor = colorsPool[(i + 2) % colorsPool.length];
        const colors = [color, secondaryColor];
        
        let weight = weights[i % weights.length];
        if (isGaming) {
            const gamingWeights = ["2.10 kg", "2.50 kg", "3.20 kg"];
            weight = gamingWeights[i % gamingWeights.length];
        } else if (isPremium) {
            const premiumWeights = ["0.99 kg", "1.24 kg", "1.40 kg"];
            weight = premiumWeights[i % premiumWeights.length];
        } else if (isBudget) {
            weight = "1.40 kg";
        }

        let batteryLife = batteryLifes[i % batteryLifes.length];
        if (brand === "Apple" || processor.includes("Snapdragon")) {
            batteryLife = "Up to 22 Hours";
        } else if (isGaming) {
            batteryLife = "Up to 6 Hours";
        }

        const ports = portsPool[i % portsPool.length];
        const keyboardType = isGaming ? "RGB Backlit Chiclet Keyboard" : "Chiclet Backlit Keyboard";
        const coolingSystem = isGaming ? "Dual-Fan Liquid Metal Cooling with Vapor Chamber" : "Single-Fan Smart Cooling";
        const connectivity = i % 2 === 0 ? "Wi-Fi 6E (802.11ax) + Bluetooth 5.3" : "Wi-Fi 7 (802.11be) + Bluetooth 5.4";
        const aiFeatures = isPremium ? "Copilot+ AI Assistant (45 TOPS NPU), Windows Studio Effects, Smart Noise Cancellation" : "Dynamic Sound Isolation, Adaptive Battery Allocation";
        const warranty = "1 Year Brand Domestic Warranty";

        // 8. Deterministic pricing formulas correlating to specs
        let basePrice = 45000;
        if (brand === "Apple") {
            basePrice = (series === "MacBook Air") ? 92000 : 179000;
        } else if (series.includes("Chromebook")) {
            basePrice = 24900;
        } else if (series.includes("JioBook")) {
            basePrice = 14500;
        } else if (series.includes("Toughbook")) {
            basePrice = 240000;
        } else if (series.includes("Alienware") || series.includes("Titan") || series.includes("Blade")) {
            basePrice = 239000;
        } else if (series.includes("XPS") || series.includes("Spectre") || series.includes("Galaxy Book Ultra") || series.includes("Surface Studio Laptop")) {
            basePrice = 145000;
        } else if (isGaming) {
            basePrice = 69900;
        } else if (isPremium) {
            basePrice = 89900;
        } else if (isBudget) {
            basePrice = 32900;
        }

        // Spec modifiers
        let cpuMod = 0;
        if (processor.includes("i9") || processor.includes("Ryzen 9") || processor.includes("Max")) cpuMod = 50000;
        else if (processor.includes("i7") || processor.includes("Ryzen 7") || processor.includes("Pro") || processor.includes("Ultra 7") || processor.includes("Elite")) cpuMod = 22000;
        else if (processor.includes("Celeron") || processor.includes("Kompanio")) cpuMod = -10000;

        let gpuMod = 0;
        if (graphicsCard.includes("RTX 4090")) gpuMod = 120000;
        else if (graphicsCard.includes("RTX 4080")) gpuMod = 70000;
        else if (graphicsCard.includes("RTX 4070")) gpuMod = 35000;
        else if (graphicsCard.includes("RTX 4060")) gpuMod = 18000;
        else if (graphicsCard.includes("RTX 4050")) gpuMod = 8000;

        let ramMod = 0;
        if (ram.includes("64GB")) ramMod = 25000;
        else if (ram.includes("32GB")) ramMod = 12000;
        else if (ram.includes("4GB")) ramMod = -4000;

        let storageMod = 0;
        if (storage.includes("2TB")) storageMod = 18000;
        else if (storage.includes("1TB")) storageMod = 7000;
        else if (storage.includes("64GB") || storage.includes("128GB")) storageMod = -4000;

        let price = Math.round(basePrice + cpuMod + gpuMod + ramMod + storageMod);
        if (price < 12900) price = 12900; // Floor price safety
        
        const originalPrice = Math.round(price * 1.15); // Staggered discount
        const discountVal = Math.round((1 - price / originalPrice) * 100);

        // Simplify GPU name for product title
        let gpuName = graphicsCard;
        if (graphicsCard.includes("RTX 4090")) gpuName = "RTX 4090";
        else if (graphicsCard.includes("RTX 4080")) gpuName = "RTX 4080";
        else if (graphicsCard.includes("RTX 4070")) gpuName = "RTX 4070";
        else if (graphicsCard.includes("RTX 4060")) gpuName = "RTX 4060";
        else if (graphicsCard.includes("RTX 4050")) gpuName = "RTX 4050";
        else if (graphicsCard.includes("Iris Xe")) gpuName = "Iris Xe";
        else if (graphicsCard.includes("Radeon")) gpuName = "Radeon";
        else if (graphicsCard.includes("Intel Arc")) gpuName = "Intel Arc";
        else if (graphicsCard.includes("Apple")) gpuName = "Integrated GPU";
        else if (graphicsCard.includes("Mali")) gpuName = "Mali GPU";
        else if (graphicsCard.includes("UHD")) gpuName = "Intel UHD";

        // Format a professional retail product name under 95 characters
        let name = `${brand} ${series} (${processor.replace(" Chip", "").replace(" Processors", "")} / ${ram.split(" ")[0]} / ${storage.split(" ")[0]} / ${gpuName})`;
        if (name.length > 95) {
            name = `${brand} ${series} (${processor.split(" ")[0]} ${processor.split(" ")[1] || ""} / ${ram.split(" ")[0]} / ${storage.split(" ")[0]})`;
        }

        // SEO Slug generation guaranteeing absolute uniqueness
        const cleanSlug = name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        const slug = `${cleanSlug}-${i + 1}`;

        // Select specific image from pool
        let imageType = "Student";
        if (isGaming) imageType = "Gaming";
        else if (isPremium) imageType = "Premium";
        else if (type === "Business Laptop") imageType = "Business";

        const imagePool = categoryImages[imageType] || categoryImages["Student"];
        const image = imagePool[i % imagePool.length];
        const hoverImage = imagePool[(i + 1) % imagePool.length];
        const images = [image, hoverImage];

        const rating = parseFloat((4.0 + ((i % 10) / 10)).toFixed(1));
        const ratingsCount = 20 + (i * 5) % 850;
        const stock = 5 + (i * 3) % 45;

        // Long highly-premium Flipkart description
        const description = `Unleash unparalleled performance with the ${brand} ${series}. Engineered to support your specialized workflows, this state-of-the-art ${type} features a groundbreaking ${processor} paired with a super-fast ${ram} memory and spacious ${storage}. Whether you are coding complex applications, rendering detailed 3D CAD models, gaming at ultra-high settings, or multi-tasking through intense online lectures, this machine keeps you ahead. Complemented by a breathtaking ${display} and running on ${operatingSystem}, it provides up to ${batteryLife} on a single charge. Finished in standard ${color} premium materials, it is the ultimate companion for modern students and ambitious tech professionals.`;

        products.push({
            name,
            slug,
            brand,
            description,
            category: "Electronics & Tech",
            subcategory: "Laptops",
            section,
            type,
            processor,
            graphicsCard,
            ram,
            storage,
            display,
            refreshRate,
            operatingSystem,
            batteryLife,
            weight,
            ports,
            keyboardType,
            coolingSystem,
            aiFeatures,
            connectivity,
            warranty,
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
                `High-performance ${processor} for advanced workflows and multitasking`,
                `Dedicated graphics: ${graphicsCard} for ultra-realistic visuals`,
                `Ultra-responsive ${ram} paired with ultra-fast ${storage} speed`,
                `Breathtaking ${display} at fluid ${refreshRate} response`,
                `Robust operating system: ${operatingSystem} pre-installed`,
                `Outstanding battery backup: ${batteryLife} with smart fast charge support`
            ],
            specifications: {
                "Brand": brand,
                "Series Name": series,
                "Processor": processor,
                "Graphics Card": graphicsCard,
                "RAM": ram,
                "Storage Capacity": storage,
                "Display Details": display,
                "Refresh Rate": refreshRate,
                "Operating System": operatingSystem,
                "Battery Backup": batteryLife,
                "Product Weight": weight,
                "I/O Ports": ports,
                "Cooling Tech": coolingSystem,
                "AI Capabilities": aiFeatures,
                "Primary Color": color,
                "Product Class": specCategory
            },
            featured: i % 12 === 0,
            trending: i % 8 === 0,
            createdAt: new Date(Date.now() - i * 4 * 60 * 60 * 1000)
        });
    }

    return products;
};

async function seedLaptopsWithoutExit() {
    try {
        console.log("🧹 Cleaning existing laptop products from target category to prevent duplicate collisions...");
        
        // Clean all products under 'Electronics & Tech' -> 'Laptops'
        const deleted = await Product.deleteMany({
            category: "Electronics & Tech",
            subcategory: "Laptops"
        });
        
        console.log(`🗑️ Cleared ${deleted.deletedCount} products from database to ensure fresh seeding.`);

        const laptopProducts = generate412Laptops();
        console.log(`🌱 Compiling and inserting ${laptopProducts.length} high-fidelity laptop products into MongoDB Atlas...`);
        
        const inserted = await Product.insertMany(laptopProducts);
        console.log(`🎉 Seeded ${inserted.length} high-quality laptop products successfully into HostelMart database!`);
    } catch (error) {
        console.error("❌ Seeding Error in seedLaptopsWithoutExit:", error);
        throw error;
    }
}

async function seedDB() {
    try {
        console.log("🔌 Connecting to MongoDB Database...");
        await connectDB();
        console.log("✅ MongoDB Connected Successfully!");

        await seedLaptopsWithoutExit();

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
    module.exports = { generateLaptops: generate412Laptops, seedLaptopsWithoutExit };
}
