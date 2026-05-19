/**
 * HostelMart Global Cart Manager
 * Handles product additions, removal, and persistence across the entire site.
 */

const CART_STORAGE_KEY = 'hostelmart_cart';

/**
 * Retrieves the current cart from localStorage
 */
function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch (e) {
        console.error("Cart retrieval error:", e);
        return [];
    }
}

/**
 * Saves the cart to localStorage and updates UI elements
 */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadges();
    syncCartButtons(); // Update all "Add to Cart" buttons on the page
}

/**
 * Checks if a product is already in the cart
 * @param {string} slug - The unique identifier for the product
 */
function isInCart(slug) {
    const cart = getCart();
    return cart.some(item => item.slug === slug || item.id === slug);
}

/**
 * Adds a product to the cart or increases quantity if it exists
 */
function addToCart(product) {
    const cart = getCart();
    const slug = product.slug || product.id;
    
    const existingIndex = cart.findIndex(item => (item.slug === slug || item.id === slug) && item.size === product.size);
    
    if (existingIndex > -1) {
        cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
    } else {
        cart.push({
            ...product,
            qty: product.qty || 1,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart(cart);
    showCartToast(product.title + " added to cart!");
    return true;
}

/**
 * Removes an item from the cart by index
 */
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

/**
 * Updates the quantity of an item in the cart
 */
function updateQuantity(index, newQty) {
    const cart = getCart();
    if (newQty < 1) return;
    cart[index].qty = newQty;
    saveCart(cart);
}

/**
 * Updates all cart count badges on the page
 */
function updateCartBadges() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    
    const badges = document.querySelectorAll('.cart-badge, .absolute.-top-1.-right-1, .absolute.-top-2.left-3, .absolute.-top-2.left-4, .absolute.-top-2.-right-2');
    badges.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

/**
 * Synchronizes all "Add to Cart" buttons on the page with the current cart state
 */
function syncCartButtons() {
    const cart = getCart();
    const cartSlugs = cart.map(item => item.slug || item.id);
    
    // Find all buttons with data-cart-slug
    const buttons = document.querySelectorAll('[data-cart-action="add"], .add-to-cart-btn');
    
    buttons.forEach(btn => {
        const slug = btn.getAttribute('data-product-slug') || btn.getAttribute('data-id');
        if (!slug) return;
        
        if (cartSlugs.includes(slug)) {
            btn.innerHTML = btn.hasAttribute('data-mini') ? '<ion-icon name="arrow-forward-outline"></ion-icon>' : 'Go to Cart';
            btn.classList.add('in-cart');
            btn.setAttribute('data-cart-state', 'in-cart');
            // Update styles if needed
            if (!btn.hasAttribute('data-mini')) {
                btn.style.backgroundColor = '#C8A951';
                btn.style.color = '#FFFFFF';
            }
        } else {
            btn.innerHTML = btn.hasAttribute('data-mini') ? 'Add' : 'Add to Cart';
            btn.classList.remove('in-cart');
            btn.setAttribute('data-cart-state', 'not-in-cart');
            if (!btn.hasAttribute('data-mini')) {
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }
        }
    });
}

/**
 * Shows a premium success toast notification
 */
function showCartToast(message) {
    if (!document.getElementById('cart-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-toast-styles';
        style.textContent = `
            .cart-toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: #3E2723;
                color: #FDFBF7;
                padding: 14px 28px;
                border-radius: 16px;
                font-size: 13px;
                font-weight: 800;
                box-shadow: 0 15px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                align-items: center;
                gap: 12px;
                border: 1px solid rgba(255,255,255,0.1);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .cart-toast.show { transform: translateX(-50%) translateY(0); }
        `;
        document.head.appendChild(style);
    }

    let toast = document.querySelector('.cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'cart-toast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <ion-icon name="checkmark-outline" style="color: white; font-size: 16px; font-weight: bold;"></ion-icon>
        </div>
        ${message}
    `;

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => toast.classList.remove('show'), 3000);
}

/**
 * Global Event Delegation for Cart Actions
 */
document.addEventListener('click', (e) => {
    const cartBtn = e.target.closest('[data-cart-action="add"]');
    if (!cartBtn) return;
    
    const state = cartBtn.getAttribute('data-cart-state');
    const slug = cartBtn.getAttribute('data-product-slug');
    
    if (state === 'in-cart') {
        window.location.href = '/Cart.html';
        return;
    }
    
    // If not in cart, we need product data
    // In dynamic pages, we often have data attributes
    const product = {
        id: slug,
        slug: slug,
        title: cartBtn.getAttribute('data-product-name') || 'Product',
        name: cartBtn.getAttribute('data-product-name') || 'Product',
        currentPrice: cartBtn.getAttribute('data-product-price') || '₹0',
        price: parseInt((cartBtn.getAttribute('data-product-price') || '0').replace(/[^\d]/g, '')),
        img: cartBtn.getAttribute('data-product-image') || '',
        image: cartBtn.getAttribute('data-product-image') || '',
        brand: cartBtn.getAttribute('data-product-brand') || 'HostelMart',
        size: cartBtn.getAttribute('data-product-size') || 'Free Size',
        qty: 1
    };
    
    addToCart(product);
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();
    syncCartButtons();
});

// Export to window for legacy support and direct calls
window.getCart = getCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.updateCartBadges = updateCartBadges;
window.syncCartButtons = syncCartButtons;
window.isInCart = isInCart;

/**
 * Backward compatibility for legacy category pages
 */
window.addToCartHandler = function(slug, name, price, image, brand, e) {
    if (e) e.stopPropagation();
    addToCart({
        slug: slug,
        id: slug,
        name: name,
        title: name,
        price: typeof price === 'number' ? price : parseInt(String(price).replace(/[^\d]/g, '')),
        currentPrice: typeof price === 'string' && price.startsWith('₹') ? price : `₹${price}`,
        img: image,
        image: image,
        brand: brand || 'HostelMart',
        size: 'Free Size',
        qty: 1
    });
};
