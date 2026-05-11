/**
 * HostelMart Global Dynamic Search System
 * Powered by MongoDB Atlas
 */

// State Management
let searchTimeout = null;
let currentSearchQuery = "";

/**
 * Expose functions to global scope for existing HTML attributes
 */
window.showSearchDropdown = function() {
    if (document.getElementById('product-search').value.trim() === "") {
        renderInitialDropdown();
    }
    const dropdown = document.getElementById('search-suggestions');
    if (dropdown) dropdown.style.display = 'block';
};

window.handleSearchClick = function(term) {
    setSearchQuery(term);
};

// Initialize Search System
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('product-search');
    const searchDropdown = document.getElementById('search-suggestions');
    const searchContainer = document.getElementById('search-container');

    if (!searchInput) return;

    // Load Initial Dropdown State (Recent/Trending)
    renderInitialDropdown();

    // Event Listeners
    searchInput.addEventListener('input', handleSearchInput);
    
    // In case onfocus is missing or removed
    searchInput.addEventListener('focus', () => {
        window.showSearchDropdown();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                saveSearchToHistory(query);
                performGlobalSearch(query);
                hideDropdown();
            }
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (searchContainer && !searchContainer.contains(e.target)) {
            hideDropdown();
        }
    });
});

/**
 * Handle input with debouncing
 */
function handleSearchInput(e) {
    const query = e.target.value.trim();
    currentSearchQuery = query;

    clearTimeout(searchTimeout);

    if (query.length < 2) {
        renderInitialDropdown();
        return;
    }

    // Show loading state
    renderLoadingState();

    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
            const products = await response.json();
            
            if (currentSearchQuery === query) {
                renderSearchResults(products, query);
            }
        } catch (error) {
            console.error("Search fetch error:", error);
            renderErrorState();
        }
    }, 300); // 300ms debounce
}

/**
 * Render Results in Dropdown
 */
function renderSearchResults(products, query) {
    const dropdown = document.getElementById('search-suggestions');
    if (!dropdown) return;

    if (products.length === 0) {
        dropdown.innerHTML = `
            <div class="p-8 text-center">
                <div class="text-4xl mb-3">🔍</div>
                <p class="text-[#5D4037] font-bold">No products found for "${query}"</p>
                <p class="text-xs text-gray-400 mt-1">Try checking your spelling or use general terms.</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="dropdown-section-title">Products Found</div>
        <div class="search-results-container max-h-[400px] overflow-y-auto">
    `;

    products.forEach(product => {
        const image = product.image || (product.images && product.images.default) || 'https://via.placeholder.com/50';
        
        html += `
            <div class="search-item group" onclick="navigateToProduct('${product.slug}')">
                <div class="w-10 h-10 rounded-lg overflow-hidden bg-white border border-[#D7CCC8]/30 flex-shrink-0">
                    <img src="${image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="flex-1 min-w-0">
                    <p class="item-text truncate font-semibold text-[#3E2723] mb-0.5">${product.name}</p>
                    <p class="text-[9px] text-gray-400 uppercase tracking-widest font-bold">${product.brand || product.category}</p>
                </div>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                    <ion-icon name="arrow-forward-outline" class="text-xs text-gray-300"></ion-icon>
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <div class="p-3 bg-[#F5F5DC]/50 border-t border-[#D7CCC8]/30 text-center">
            <button onclick="performGlobalSearch('${query}')" class="text-xs font-black text-[#5D4037] uppercase tracking-widest hover:underline">
                View All Results
            </button>
        </div>
    `;

    dropdown.innerHTML = html;
}

/**
 * Render Initial State (Recent & Trending)
 */
function renderInitialDropdown() {
    const dropdown = document.getElementById('search-suggestions');
    if (!dropdown) return;

    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    // Hardcoded Trending Searches (could be dynamic in future)
    const trending = ['Buckets', 'Mobiles', 'T-Shirts', 'Laptops', 'Face Wash'];

    let html = '';

    if (history.length > 0) {
        html += `<div class="dropdown-section-title">Recent Searches</div>`;
        history.forEach(term => {
            html += `
                <div class="search-item" onclick="setSearchQuery('${term}')">
                    <ion-icon name="time-outline"></ion-icon>
                    <p class="item-text flex-1">${term}</p>
                    <ion-icon name="chevron-forward-outline" class="text-[10px] opacity-0 group-hover:opacity-100"></ion-icon>
                </div>
            `;
        });
    }

    html += `<div class="dropdown-section-title">Trending Searches</div>`;
    trending.forEach(term => {
        html += `
            <div class="search-item group" onclick="setSearchQuery('${term}')">
                <ion-icon name="trending-up-outline" class="text-green-500"></ion-icon>
                <p class="item-text flex-1">${term}</p>
                <span class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Popular</span>
            </div>
        `;
    });

    dropdown.innerHTML = html;
}

/**
 * Render Loading State
 */
function renderLoadingState() {
    const dropdown = document.getElementById('search-suggestions');
    if (!dropdown) return;

    dropdown.innerHTML = `
        <div class="p-12 text-center">
            <div class="inline-block w-8 h-8 border-4 border-[#5D4037] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p class="text-xs font-black text-[#5D4037] uppercase tracking-widest animate-pulse">Searching HostelMart...</p>
        </div>
    `;
}

/**
 * Render Error State
 */
function renderErrorState() {
    const dropdown = document.getElementById('search-suggestions');
    if (!dropdown) return;

    dropdown.innerHTML = `
        <div class="p-8 text-center text-red-500">
            <ion-icon name="alert-circle-outline" class="text-4xl mb-2"></ion-icon>
            <p class="font-bold">Search Unavailable</p>
            <p class="text-xs opacity-70">Please check your connection and try again.</p>
        </div>
    `;
}

/**
 * Global Search Performance (Renders Grid)
 */
window.performGlobalSearch = async function(query) {
    const searchArea = document.getElementById('search-results-area');
    const searchGrid = document.getElementById('search-results-grid');
    const titleEl = document.getElementById('search-results-title');

    if (!searchArea || !searchGrid) {
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
        return;
    }

    // Hide all major containers
    const containers = ['main > section', 'main > div', '.department-hero', '.category-grid', '.wedding-hero', '.pink-banner', '.occasions-grid', '.product-section', '.featured-section'];
    containers.forEach(selector => {
        document.querySelectorAll(selector).forEach(s => {
            if (s.id !== 'search-results-area') s.style.display = 'none';
        });
    });

    searchArea.classList.remove('hidden');
    searchArea.style.display = 'block';
    
    // Show loading in grid
    searchGrid.innerHTML = `
        <div class="col-span-full py-20 text-center">
            <div class="inline-block w-12 h-12 border-4 border-[#5D4037] border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 class="text-xl font-bold text-[#5D4037]">Finding products for "${query}"...</h3>
        </div>
    `;

    try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        const products = await response.json();

        searchGrid.innerHTML = '';
        if (products.length === 0) {
            searchGrid.innerHTML = `
                <div class="col-span-full py-20 text-center space-y-4">
                    <div class="text-6xl text-gray-300">🔍</div>
                    <h3 class="text-xl font-bold text-[#5D4037]">No products found for "${query}"</h3>
                    <p class="text-gray-500">Try checking your spelling or use more general terms.</p>
                </div>
            `;
        } else {
            products.forEach(p => {
                searchGrid.insertAdjacentHTML('beforeend', createProductCardHTML(p));
            });
        }

        if (titleEl) {
            titleEl.innerHTML = `<span class="w-2 h-6 bg-[#795548] rounded-full"></span> Found ${products.length} results for "${query}"`;
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error("Global search error:", error);
    }
};

/**
 * Helper: Create Product Card HTML
 */
function createProductCardHTML(product) {
    const ratingHtml = Array(5).fill(0).map((_, i) =>
        `<ion-icon name="${i < (product.rating || 4) ? 'star' : 'star-outline'}"></ion-icon>`
    ).join('');
    
    const image = product.image || (product.images && product.images.default);
    const hoverImage = (product.images && product.images.hover) || image;
    const badgeHtml = product.discount ? `<span class="absolute top-4 left-4 bg-[#795548] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg">${product.discount}</span>` : '';
    const delHtml = product.originalPrice ? `<del class="text-xs text-gray-400 font-normal ml-2">₹${product.originalPrice.toLocaleString('en-IN')}</del>` : '';

    return `
        <div class="product-card bg-[#F5F5DC] border border-[#D7CCC8] rounded-3xl overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer" onclick="navigateToProduct('${product.slug}')">
            <div class="relative aspect-[4/5] overflow-hidden">
                <img src="${image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                <img src="${hoverImage}" alt="${product.name}" class="absolute inset-0 w-full h-full object-cover hover-img opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                ${badgeHtml}
                <div class="absolute -right-16 top-4 group-hover:right-4 transition-all duration-300 flex flex-col gap-2">
                    <button class="bg-[#FDFBF7]/90 backdrop-blur p-2.5 rounded-xl shadow-lg hover:bg-[#795548] hover:text-white transition-all transform hover:scale-110 active:scale-90" onclick="event.stopPropagation()"><ion-icon name="heart-outline"></ion-icon></button>
                    <button class="bg-[#FDFBF7]/90 backdrop-blur p-2.5 rounded-xl shadow-lg hover:bg-[#795548] hover:text-white transition-all transform hover:scale-110 active:scale-90" onclick="event.stopPropagation()"><ion-icon name="eye-outline"></ion-icon></button>
                </div>
            </div>
            <div class="p-4 sm:p-6 space-y-2">
                <p class="text-[10px] text-[#795548] font-black uppercase tracking-widest">${product.category}</p>
                <h3 class="font-bold text-[#3E2723] truncate text-sm sm:text-base">${product.name}</h3>
                <div class="flex items-center gap-1 text-yellow-400 text-[10px]">${ratingHtml}</div>
                <div class="flex items-center gap-2 font-black text-lg text-[#3E2723] mt-1">
                    <span>₹${product.price.toLocaleString('en-IN')}</span> ${delHtml}
                </div>
            </div>
        </div>
    `;
}

// Utility Functions
function hideDropdown() {
    const dropdown = document.getElementById('search-suggestions');
    if (dropdown) dropdown.style.display = 'none';
}

function setSearchQuery(term) {
    const input = document.getElementById('product-search');
    if (input) {
        input.value = term;
        input.focus();
        handleSearchInput({ target: { value: term } });
        // Trigger actual search if user clicks a trending item
        saveSearchToHistory(term);
        window.performGlobalSearch(term);
        hideDropdown();
    }
}

function saveSearchToHistory(term) {
    if (!term) return;
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history = history.filter(h => h.toLowerCase() !== term.toLowerCase());
    history.unshift(term);
    history = history.slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

window.navigateToProduct = function(slug) {
    if (!slug) return;
    window.location.href = `ProductDetail.html?slug=${slug}`;
};

// Handle URL Search Params (e.g. for redirects from other pages)
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
        const input = document.getElementById('product-search');
        if (input) input.value = searchQuery;
        window.performGlobalSearch(searchQuery);
    }
});
