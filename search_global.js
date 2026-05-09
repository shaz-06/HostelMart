// Global Search Logic for HostelMart
const productRegistry = {
    "Clothes": {
        "Men's": ["Mens T-Shirts", "Casual & Formal Shirts", "Jeans & Denim", "Tracksuits & Activewear", "Mens Jackets & Winter Wear", "Hoodies & Sweatshirts", "Slim-Fit Charcoal Blazer", "Suits & Blazers", "Trousers & Chinos", "Shorts & Swimwear", "Ethnic & Kurta Wear", "Innerwear & Basics", "Classic Indigo Denim Jacket"],
        "Women's - Zara": ["Zara Tops", "Zara T-Shirts", "Zara Blouses", "Zara Maxi Dresses", "Zara Midi Dresses", "Zara Mini Skirts", "Zara Blazers", "Zara Jackets", "Zara Jumpsuits"],
        "Women's - H&M": ["H&M Crop Tops", "H&M Casual Dresses", "H&M Jeggings", "H&M Sweatshirts", "H&M Cardigans", "H&M Loungewear", "H&M Bras", "H&M Panties"],
        "Women's - Biba": ["Biba Kurtas", "Biba Sarees", "Biba Salwar Suits", "Biba Anarkali Dresses", "Biba Lehengas", "Biba Ethnic Gowns"],
        "Women's - Fabindia": ["Fabindia Handloom Sarees", "Fabindia Tunics", "Fabindia Ethnic Jackets", "Fabindia Stoles"],
        "Women's - Forever 21": ["Forever 21 Crop Tops", "Forever 21 Mini Dresses", "Forever 21 Playsuits", "Forever 21 Activewear"],
        "Women's - Only": ["Only Denim Dresses", "Only Mom Jeans", "Only Overshirts", "Only Knitwear"]
    },
    "Mobiles": {
        "Apple": ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 16 Plus", "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 15 Plus", "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14", "iPhone 14 Plus"],
        "Samsung": ["Samsung Galaxy S25 Ultra", "Samsung Galaxy S25 Plus", "Samsung Galaxy S25", "Samsung Galaxy S25 FE", "Samsung Galaxy S24 Ultra", "Samsung Galaxy S24 FE", "Samsung Galaxy Z Fold7", "Samsung Galaxy Z Flip7", "Samsung Galaxy Z Flip6", "Samsung Galaxy A56", "Samsung Galaxy A55", "Samsung Galaxy A36", "Samsung Galaxy A35", "Samsung Galaxy A26", "Samsung Galaxy A17", "Samsung Galaxy A16", "Samsung Galaxy A15", "Samsung Galaxy A14", "Samsung Galaxy A07", "Samsung Galaxy A06", "Samsung Galaxy M56", "Samsung Galaxy M36", "Samsung Galaxy M35", "Samsung Galaxy M17", "Samsung Galaxy M06", "Samsung Galaxy F55", "Samsung Galaxy F36", "Samsung Galaxy F17", "Samsung Galaxy F06", "Samsung Galaxy F05"],
        "Google": ["Google Pixel 10 Pro 5G", "Google Pixel 10 Pro XL 5G", "Google Pixel 10 5G", "Google Pixel 10 Pro Fold 5G", "Google Pixel 10a 5G", "Google Pixel 9 5G", "Google Pixel 9 Pro", "Google Pixel 9 Pro XL 5G", "Google Pixel 9 Pro Fold", "Google Pixel 9a 5G", "Google Pixel 8 Pro", "Google Pixel 8", "Google Pixel 8a", "Google Pixel 7", "Google Pixel 7a", "Google Pixel 7 Pro"],
        "Sony": ["Sony Xperia 1 VI", "Sony Xperia 1 IV", "Sony Xperia 1 V", "Sony Xperia 5 V", "Sony Xperia 5 IV", "Sony Xperia 10 VI", "Sony Xperia 10 V", "Sony Xperia 10 IV", "Sony Xperia 1 III", "Sony Xperia 5 III", "Sony Xperia 5 II"],
        "Motorola": ["Motorola Edge 70 Fusion", "Motorola Edge 70", "Motorola Edge 60 Pro", "Motorola Edge 60", "Motorola Edge 60 Fusion", "Motorola Edge 60 Stylus", "Motorola Edge 50 Ultra", "Motorola Edge 50 Pro", "Motorola Edge 50", "Motorola Edge 50 Fusion", "Motorola Edge 50 Neo", "Motorola Razr 60", "Motorola Razr 50", "Motorola Razr 50 Ultra", "Moto G96 5G", "Moto G86 Power", "Moto G67 Power", "Moto G57 Power", "Moto G64 5G", "Moto G45 5G", "Moto G04s", "Moto G06 Power", "Motorola Signature"],
        "Xiaomi": ["Xiaomi 17 Ultra", "Xiaomi 17", "Xiaomi 15 Ultra", "Xiaomi 15", "Xiaomi 14 Civi", "Redmi Note 15", "Redmi Note 15 Pro", "Redmi Note 15 Pro+", "Redmi Note 15 SE", "Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 14", "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13", "Redmi 15", "Redmi 15C", "Redmi 15A", "Redmi 14C", "Redmi 13C", "POCO F7", "POCO F6", "POCO X8 Pro", "POCO X7 Pro", "POCO X7", "POCO X6", "POCO X6 Neo", "POCO M8", "POCO M7", "POCO M6", "POCO C85", "POCO C75", "POCO C71"],
        "Realme": ["Realme 16 Pro+", "Realme 16 Pro", "Realme 15", "Realme 15 Pro", "Realme 14 Pro+", "Realme 14 Pro", "Realme 14T", "Realme 14x", "Realme 13 Pro+", "Realme 13 Pro", "Realme 13", "Realme GT 7 Pro", "Realme GT 7", "Realme GT 7T", "Realme GT 6", "Realme GT 6T", "Realme P4 Pro", "Realme P4", "Realme P4x", "Realme P3 Ultra", "Realme P3 Pro", "Realme P3", "Realme P3 Lite", "Realme P2 Pro", "Realme P1 Speed", "Realme Narzo 90", "Realme Narzo 90x", "Realme Narzo 80 Pro", "Realme Narzo 80x", "Realme Narzo 80 Lite", "Realme Narzo 70 Turbo", "Realme Narzo N65", "Realme Narzo N61", "Realme C85", "Realme C75", "Realme C73", "Realme C71", "Realme C63", "Realme C55"],
        "Oppo": ["Oppo Find X9 Pro", "Oppo Find X9", "Oppo Reno 15 Pro", "Oppo Reno 15", "Oppo Reno 14 Pro", "Oppo Reno 14", "Oppo F27 Pro+", "Oppo F27 Pro", "Oppo A6k", "Oppo A3 Pro"],
        "Vivo": ["Vivo X200 Pro", "Vivo X200", "Vivo X100 Pro", "Vivo X100", "Vivo V70", "Vivo V70 FE", "Vivo V60", "Vivo T5 Pro", "Vivo T5x", "Vivo Y200"],
        "OnePlus": ["OnePlus 15", "OnePlus 15R", "OnePlus 14", "OnePlus 13", "OnePlus Nord 6", "OnePlus Nord CE 5", "OnePlus Nord CE 4 Lite"],
        "Nothing": ["Nothing Phone (3)", "Nothing Phone (3a)", "Nothing Phone (3a) Pro", "Nothing Phone (2)", "Nothing Phone (2a)", "Nothing Phone (2a) Plus", "Nothing Phone (1)"],
        "Micromax": ["Micromax IN 1", "Micromax IN 2C", "Micromax Bharat 2 Plus", "Micromax X1i Smart", "Micromax X1i Flip", "Micromax X809", "Micromax X513 Plus"],
        "Lava": ["Lava Agni 4", "Lava Agni 3 5G", "Lava Blaze Duo", "Lava Blaze Dragon 5G", "Lava Blaze 2 5G", "Lava Storm Lite 5G", "Lava Storm Play 5G", "Lava Play Ultra", "Lava Play Max", "Lava Bold N1 5G", "Lava Bold N1 Pro", "Lava Shark 5G", "Lava Yuva Smart 2"],
        "Infinix": ["Infinix Note 60 Pro", "Infinix Note 60", "Infinix Note 50 Pro", "Infinix Note 50", "Infinix Zero 40", "Infinix Zero 30", "Infinix GT 20 Pro", "Infinix Hot 50", "Infinix Hot 40", "Infinix Smart 9"],
        "iQOO": ["iQOO 15", "iQOO 15 Pro", "iQOO 15R", "iQOO Neo 11", "iQOO Neo 10", "iQOO Z11", "iQOO Z11x", "iQOO Z10", "iQOO Z9 Turbo"]
    },
    "Laptops": {
        "Apple": ["MacBook Air M2", "MacBook Air M3", "MacBook Air M5", "MacBook Pro M3", "MacBook Pro M4", "MacBook Pro M5", "MacBook Neo"],
        "Dell": ["Dell XPS 13", "Dell XPS 14", "Dell XPS 15", "Dell XPS 17", "Dell Inspiron 15", "Dell Inspiron 14", "Dell Vostro 15", "Dell Latitude 7440", "Dell Alienware m16", "Alienware m16 R2", "Alienware x16 R2", "Alienware m18", "Alienware 16 Aurora"],
        "HP": ["HP Pavilion 14", "HP Pavilion x360", "HP Victus 15", "HP Omen 16", "HP Omen 17", "HP Omen Transcend 14", "HP Omen Max", "HP Envy x360", "HP Spectre x360", "HP Chromebook Plus"],
        "Lenovo": ["Lenovo IdeaPad Slim 3", "Lenovo IdeaPad Slim 5", "Lenovo Yoga Slim 7", "Lenovo Yoga Slim 9i", "Lenovo ThinkPad X1 Carbon", "Lenovo ThinkPad X1 Yoga", "Lenovo ThinkPad T14", "Lenovo ThinkPad E14", "Lenovo ThinkPad L14", "Lenovo LOQ Gaming", "Lenovo Legion 5"],
        "Asus": ["Asus Vivobook 14", "Asus Vivobook 15", "Asus Vivobook S14", "Asus Zenbook 14", "Asus Zenbook S16", "Asus TUF Gaming A15", "Asus ROG Zephyrus G16", "ASUS ROG Strix G16", "ASUS ROG Strix Scar 16", "ASUS ROG Strix Scar 18", "ASUS ROG Zephyrus G14", "ASUS ROG Flow X13"],
        "Acer": ["Acer Aspire 3", "Acer Aspire 5", "Acer Swift Go 14", "Acer Swift X", "Acer Nitro V 15"],
        "MSI": ["MSI Thin 15", "MSI Katana 15", "MSI Katana 15 HX", "MSI Cyborg 15", "MSI Bravo 15", "MSI Stealth 16", "MSI Raider GE78"]
    },
    "Audio": {
        "Sony": ["Sony WF-1000XM5", "Sony WF-C700N", "Sony WH-1000XM5", "Sony ULT Wear WH-ULT900N"],
        "Bose": ["Bose QuietComfort Ultra Earbuds", "Bose QuietComfort Headphones", "Bose Sport Earbuds"],
        "Sennheiser": ["Sennheiser Momentum True Wireless 4", "Sennheiser Accentum Wireless", "Sennheiser HD 450BT"],
        "Apple": ["Apple AirPods 4 Wireless Earbuds", "AirPods Pro (2nd Gen)", "AirPods Max"],
        "boAt": ["boAt Airdopes Prime", "boAt Airdopes 800", "boAt Nirvana Ion ANC Pro", "boAt Rockerz 550"],
        "JBL": ["JBL Live Buds 3", "JBL Tune Buds 2", "JBL Tune 770NC", "JBL Live 660NC"],
        "Realme": ["realme Buds T200 Lite", "realme Buds T200x", "realme Buds Wireless 3 Neo"],
        "OnePlus": ["OnePlus Buds 3 Pro", "OnePlus Nord Buds 3r", "OnePlus Buds"]
    },
    "Smartwatches": {
        "Apple": ["Apple Watch Series 11", "Apple Watch Series 10", "Apple Watch Ultra 3", "Apple Watch SE (3rd Gen)"],
        "Samsung": ["Samsung Galaxy Watch 8", "Samsung Galaxy Watch 8 Classic", "Samsung Galaxy Watch Ultra", "Samsung Galaxy Watch 7", "Samsung Galaxy Watch FE"],
        "Garmin": ["Garmin Fenix 8", "Garmin Vivoactive 5", "Garmin Forerunner 165", "Garmin Forerunner 55"],
        "boAt": ["boAt Ultima Prime", "boAt Wave Call 3", "boAt Chrome Horizon", "boAt Lunar Discovery Neo"],
        "Noise": ["Noise ColorFit Pro 6 Max", "Noise Twist 2", "Noise Endeavour 2", "NoiseFit Halo"],
        "Fire-Boltt": ["Fire-Boltt Ninja Call Pro", "Fire-Boltt Phoenix Ultra", "Fire-Boltt Visionary"],
        "Titan": ["Titan Smart 3", "Titan Talk S", "Titan Connected X"]
    }
};

const localProductFallback = [];
let idCounter = 1;

Object.keys(productRegistry).forEach(category => {
    Object.keys(productRegistry[category]).forEach(brand => {
        productRegistry[category][brand].forEach(model => {
            localProductFallback.push({
                id: idCounter++,
                name: model,
                category: category,
                price: Math.floor(Math.random() * (1500 - 50) + 50),
                delPrice: Math.floor(Math.random() * (2000 - 1600) + 1600),
                discount: Math.random() > 0.5 ? "Sale" : "Hot",
                rating: Math.floor(Math.random() * (5 - 3) + 3),
                images: {
                    default: `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80`,
                    hover: `https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&w=800&q=80`
                },
                tags: [brand.toLowerCase(), category.toLowerCase(), ...model.toLowerCase().split(" ")]
            });
        });
    });
});

let allProductsGlobal = [];

async function loadProductsFallback() {
    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) throw new Error("Local products.json fetch failed");
        allProductsGlobal = await response.json();
    } catch (e) {
        allProductsGlobal = localProductFallback;
    }
}

function createProductHTML(product) {
    const ratingHtml = Array(5).fill(0).map((_, i) =>
        `<ion-icon name="${i < product.rating ? 'star' : 'star-outline'}"></ion-icon>`
    ).join('');
    const badgeHtml = product.discount ? `<span class="absolute top-4 left-4 bg-[#795548] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg">${product.discount}</span>` : '';
    const delHtml = product.delPrice ? `<del class="text-xs text-gray-300 font-normal">$${product.delPrice.toFixed(2)}</del>` : '';

    return `
        <div class="product-card bg-[#F5F5DC] border border-[#D7CCC8] rounded-3xl overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500">
            <div class="relative aspect-[4/5] overflow-hidden">
                <img src="${product.images.default}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                <img src="${product.images.hover}" alt="${product.name}" class="absolute inset-0 w-full h-full object-cover hover-img">
                ${badgeHtml}
                <div class="absolute -right-16 top-4 group-hover:right-4 transition-all duration-300 flex flex-col gap-2">
                    <button class="bg-[#F5F5DC]/90 backdrop-blur p-2.5 rounded-xl shadow-lg hover:bg-[#795548] hover:text-white transition-all transform hover:scale-110 active:scale-90"><ion-icon name="heart-outline"></ion-icon></button>
                    <button class="bg-[#F5F5DC]/90 backdrop-blur p-2.5 rounded-xl shadow-lg hover:bg-[#795548] hover:text-white transition-all transform hover:scale-110 active:scale-90"><ion-icon name="eye-outline"></ion-icon></button>
                </div>
            </div>
            <div class="p-4 sm:p-6 space-y-2">
                <p class="text-[10px] text-[#795548] font-black uppercase tracking-widest">${product.category}</p>
                <h3 class="font-bold text-[#5D4037] truncate text-sm sm:text-base">${product.name}</h3>
                <div class="flex items-center gap-1 text-yellow-400 text-[10px]">${ratingHtml}</div>
                <div class="flex items-center gap-2 font-black text-lg text-[#5D4037] mt-1">
                    <span>$${product.price.toFixed(2)}</span> ${delHtml}
                </div>
            </div>
        </div>
    `;
}

function showSearchDropdown() {
    renderSearchHistory();
    const dropdown = document.getElementById('search-suggestions');
    if (dropdown) dropdown.style.display = 'block';
}

function renderSearchHistory() {
    const list = document.getElementById('recent-searches-list');
    if (!list) return;

    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    if (history.length === 0) {
        list.innerHTML = '';
        return;
    }

    list.innerHTML = history.map(term => `
        <div class="search-item" onclick="handleSearchClick('${term}')">
            <ion-icon name="time-outline"></ion-icon>
            <div class="flex-1">
                <p class="item-text">${term}</p>
            </div>
        </div>
    `).join('');
}

function handleSearchClick(term) {
    const searchInput = document.getElementById('product-search');
    searchInput.value = term;
    saveSearchToHistory(term);
    const dropdown = document.getElementById('search-suggestions');
    if (dropdown) dropdown.style.display = 'none';
    
    const event = new Event('input', { bubbles: true });
    searchInput.dispatchEvent(event);
}

function saveSearchToHistory(term) {
    if (!term || term.trim() === '') return;
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history = history.filter(h => h.toLowerCase() !== term.toLowerCase());
    history.unshift(term);
    history = history.slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    renderSearchHistory();
}

const performSearch = () => {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;

    const term = (searchInput.value || "").toLowerCase().trim().replace(/\//g, ' ');
    const searchArea = document.getElementById('search-results-area');
    const searchGrid = document.getElementById('search-results-grid');
    const titleEl = document.getElementById('search-results-title');

    if (!searchArea || !searchGrid) return;

    if (term !== "") {
        // Hide all major containers
        const containers = ['main > section', 'main > div', '.department-hero', '.category-grid', '.wedding-hero', '.pink-banner', '.occasions-grid'];
        containers.forEach(selector => {
            document.querySelectorAll(selector).forEach(s => {
                if (s.id !== 'search-results-area') s.style.display = 'none';
            });
        });

        searchArea.classList.remove('hidden');
        searchArea.style.display = 'block';

        searchGrid.innerHTML = '';
        let exactMatches = [];
        let relatedMatches = [];
        let pantsMatches = [];
        let capsMatches = [];
        let fansMatches = [];
        let boxerMatches = [];
        let shortsMatches = [];
        let penMatches = [];
        let paperMatches = [];

        const searchKeywords = term.split(/\s+/).filter(k => k.length > 1);
        const isPantSearch = term.includes("pant") || term.includes("trouser") || term.includes("jean");
        const isCapSearch = term.includes("cap") || term.includes("hat");
        const isFanSearch = term.includes("fan") || term.includes("cooler");
        const isBoxerSearch = term.includes("boxer") || term.includes("innerwear") || term.includes("under");
        const isShortsSearch = term.includes("short");
        const isPenSearch = term.includes("pen") || term.includes("marker") || term.includes("highlighter") || term.includes("stylus");
        const isPaperSearch = term.includes("paper") || term.includes("sheet") || term.includes("sketchbook") || term.includes("chart");

        allProductsGlobal.forEach(product => {
            const name = (product.name || "").toLowerCase();
            const category = (product.category || "").toLowerCase();
            const tags = (product.tags || []).join(' ').toLowerCase();
            const fullText = `${name} ${category} ${tags}`;

            if (isPantSearch && (category.includes("pants") || tags.includes("pant") || name.includes("pant") || category === "pants")) {
                pantsMatches.push(product); return;
            }
            if (isCapSearch && (category.includes("caps") || tags.includes("cap") || name.includes("cap") || category === "caps" || tags.includes("hat") || name.includes("hat"))) {
                capsMatches.push(product); return;
            }
            if (isFanSearch && (category.includes("appliances") || tags.includes("fan") || name.includes("fan") || tags.includes("cooler") || name.includes("cooler"))) {
                fansMatches.push(product); return;
            }
            if (isBoxerSearch && (category.includes("innerwear") || tags.includes("boxer") || name.includes("boxer"))) {
                boxerMatches.push(product); return;
            }
            if (isShortsSearch && (category.includes("shorts") || tags.includes("short") || name.includes("short"))) {
                shortsMatches.push(product); return;
            }
            if (isPenSearch && (category.includes("stationery") || tags.includes("pen") || name.includes("pen") || name.includes("marker") || name.includes("highlighter"))) {
                penMatches.push(product); return;
            }
            if (isPaperSearch && (category.includes("paper") || tags.includes("paper") || name.includes("paper") || name.includes("sheet") || name.includes("sketchbook"))) {
                paperMatches.push(product); return;
            }

            if (name.includes(term) || category === term || category.includes(term)) {
                exactMatches.push(product);
            } else if (searchKeywords.length > 0 && searchKeywords.some(key => fullText.includes(key))) {
                relatedMatches.push(product);
            }
        });

        // Render sections
        const renderSection = (matches, title, colorClass) => {
            if (matches.length === 0) return;
            searchGrid.insertAdjacentHTML('beforeend', `<div class="col-span-full pb-4 border-b border-[#D7CCC8] mb-6"><h3 class="text-2xl font-black uppercase tracking-tighter ${colorClass}">${title}</h3></div>`);
            matches.forEach(p => searchGrid.insertAdjacentHTML('beforeend', createProductHTML(p)));
            searchGrid.insertAdjacentHTML('beforeend', `<div class="col-span-full my-10 border-t border-[#D7CCC8]"></div>`);
        };

        renderSection(pantsMatches, "Pants Collection", "text-[#795548]");
        renderSection(capsMatches, "Caps & Hats Collection", "text-[#795548]");
        renderSection(fansMatches, "Premium Fans & Cooling", "text-[#3E2723]");
        renderSection(boxerMatches, "Men's Boxers & Innerwear", "text-[#5D4037]");
        renderSection(shortsMatches, "Women's Shorts Collection", "text-pink-600");
        renderSection(penMatches, "Premium Pen Gallery", "text-[#3E2723]");
        renderSection(paperMatches, "Paper & Creative Studio", "text-[#5D4037]");

        exactMatches.forEach(p => searchGrid.insertAdjacentHTML('beforeend', createProductHTML(p)));
        if (relatedMatches.length > 0) {
            searchGrid.insertAdjacentHTML('beforeend', `<div class="col-span-full pt-10 pb-4 border-t border-[#D7CCC8] mt-10"><h3 class="text-xl font-black uppercase tracking-tighter text-gray-400 italic">More Related Results</h3></div>`);
            relatedMatches.forEach(p => searchGrid.insertAdjacentHTML('beforeend', createProductHTML(p)));
        }

        const matchCount = exactMatches.length + relatedMatches.length + pantsMatches.length + capsMatches.length + fansMatches.length + boxerMatches.length + shortsMatches.length + penMatches.length + paperMatches.length;
        if (titleEl) titleEl.innerHTML = `<span class="w-2 h-6 bg-[#795548] rounded-full"></span> Found ${matchCount} results for "${searchInput.value}"`;

        if (matchCount === 0) {
            searchGrid.innerHTML = `
                <div class="col-span-full py-20 text-center space-y-4">
                    <div class="text-6xl text-gray-300">🔍</div>
                    <h3 class="text-xl font-bold text-[#5D4037]">No products found for "${searchInput.value}"</h3>
                    <p class="text-gray-500">Try checking your spelling or use more general terms.</p>
                    <button onclick="document.getElementById('product-search').value=''; document.getElementById('product-search').dispatchEvent(new Event('input'))" class="mt-4 px-6 py-2 bg-[#795548] text-white rounded-xl font-bold hover:bg-[#5D4037] transition-colors">Clear Search</button>
                </div>
            `;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const containers = ['main > section', 'main > div', '.department-hero', '.category-grid', '.wedding-hero', '.pink-banner', '.occasions-grid'];
        containers.forEach(selector => {
            document.querySelectorAll(selector).forEach(s => {
                if (s.id !== 'search-results-area') s.style.display = '';
            });
        });
        searchArea.classList.add('hidden');
        searchArea.style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadProductsFallback();
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveSearchToHistory(e.target.value);
                const dropdown = document.getElementById('search-suggestions');
                if (dropdown) dropdown.style.display = 'none';
            }
        });
    }

    document.addEventListener('click', (e) => {
        const container = document.getElementById('search-container');
        const dropdown = document.getElementById('search-suggestions');
        if (container && dropdown && !container.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
});
