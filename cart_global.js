/**
 * HostelMart Global Cart Manager
 * Handles product additions, removal, and persistence.
 */

const CART_STORAGE_KEY = 'hostelmart_cart';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch (e) {
        console.error("Cart retrieval error:", e);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadges();
}

function addToCart(product) {
    const cart = getCart();
    
    // Check if product with same title and size already exists
    const existingIndex = cart.findIndex(item => item.title === product.title && item.size === product.size);
    
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
    return true;
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function updateQuantity(index, newQty) {
    const cart = getCart();
    if (newQty < 1) return;
    cart[index].qty = newQty;
    saveCart(cart);
}

function updateCartBadges() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    
    // Update all cart count elements on the page
    const badges = document.querySelectorAll('.absolute.-top-1.-right-1, .absolute.-top-2.left-3, .absolute.-top-2.left-4, .absolute.-top-2.-right-2');
    badges.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Initialize badges on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();
});

// Export to window
window.addToCart = addToCart;
window.getCart = getCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.updateCartBadges = updateCartBadges;
