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
    showCartToast(product.title + " added to cart!");
    return true;
}

function showCartToast(message) {
    // Create toast styles if they don't exist
    if (!document.getElementById('cart-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-toast-styles';
        style.textContent = `
            .cart-toast {
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: #3E2723;
                color: #FDFBF7;
                padding: 12px 24px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 700;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                z-index: 9999;
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                align-items: center;
                gap: 10px;
                border: 1px solid rgba(255,255,255,0.1);
            }
            .cart-toast.show {
                transform: translateX(-50%) translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    // Create toast element
    let toast = document.querySelector('.cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'cart-toast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `
        <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <ion-icon name="checkmark" style="color: white; font-size: 12px;"></ion-icon>
        </div>
        ${message}
    `;

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto hide
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
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
