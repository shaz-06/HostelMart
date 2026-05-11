/**
 * HostelMart Custom Authentication Global Manager
 * Handles user session, navbar updates, and profile actions.
 */

// Load AuthModal component
const script = document.createElement('script');
script.src = 'assets/js/components/AuthModal.js';
document.head.appendChild(script);

async function checkSession() {
    const token = localStorage.getItem('userToken');
    if (!token) return null;

    try {
        const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('userData', JSON.stringify(data.user));
            return data.user;
        } else {
            // Token invalid
            logout();
            return null;
        }
    } catch (error) {
        console.error("Session Check Error:", error);
        return JSON.parse(localStorage.getItem('userData'));
    }
}

function updateNavbar() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const loginText = document.getElementById('login-text');
    const profileLink = document.getElementById('profile-link');
    const profileIcon = document.querySelector('ion-icon[name="person-circle-outline"]');

    // Find the profile container (we might need to add an ID in the HTML)
    const navActions = document.querySelector('.auth-nav-slot') || 
                       document.querySelector('#nav-actions') || 
                       document.querySelector('.flex.items-center.gap-4.md\\:gap-8');
    if (!navActions) {
        console.warn('Auth UI container not found');
        return;
    }

    if (userData) {
        // User IS logged in
        // Replace existing login/track order links if necessary, 
        // but the best way is to have a dedicated profile slot.

        const existingProfile = document.getElementById('user-profile-dropdown');
        if (!existingProfile) {
            const profileHtml = `
                <div class="relative group" id="user-profile-dropdown">
                    <button class="flex items-center gap-2 cursor-pointer hover:text-[#8D6E63] transition-colors">
                        <ion-icon name="person-circle-outline" class="text-2xl md:text-xl"></ion-icon>
                        <span class="hidden md:inline">${userData.name.split(' ')[0]}</span>
                    </button>
                    <!-- Dropdown Menu -->
                    <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-[#D7CCC8] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
                        <div class="p-4 border-b border-gray-100 bg-[#F5F5DC]/50">
                            <p class="text-xs font-black text-[#5D4037] truncate">${userData.name}</p>
                            <p class="text-[10px] text-gray-400 font-bold">${userData.phone}</p>
                        </div>
                        <a href="Orders.html" class="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 hover:bg-[#F5F5DC] transition-colors">
                            <ion-icon name="bag-handle-outline" class="text-lg"></ion-icon>
                            My Orders
                        </a>
                        <a href="javascript:void(0)" onclick="openAddressModal()" class="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 hover:bg-[#F5F5DC] transition-colors">
                            <ion-icon name="location-outline" class="text-lg"></ion-icon>
                            Saved Address
                        </a>
                        <button onclick="logout()" class="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50">
                            <ion-icon name="log-out-outline" class="text-lg"></ion-icon>
                            Logout
                        </button>
                    </div>
                </div>
            `;
            // Remove the old Track Order link in navbar if it's there
            const trackOrderLink = Array.from(navActions.querySelectorAll('a')).find(a => a.textContent.includes('Track Order'));
            if (trackOrderLink) trackOrderLink.remove();

            navActions.insertAdjacentHTML('beforeend', profileHtml);
        }
    } else {
        // User IS NOT logged in
        const existingLogin = document.getElementById('login-btn');
        if (!existingLogin) {
            const loginHtml = `
                <button id="login-btn" onclick="AuthModal.show()" class="flex items-center gap-2 cursor-pointer hover:text-[#8D6E63] transition-colors font-black text-sm uppercase tracking-widest bg-[#5D4037] text-[#F5F5DC] px-4 py-2 rounded-xl">
                    <ion-icon name="log-in-outline" class="text-xl"></ion-icon>
                    Login
                </button>
            `;
            navActions.insertAdjacentHTML('beforeend', loginHtml);
        }
    }
}

async function logout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) { }
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.reload();
}

// Global exposure
window.logout = logout;
window.updateNavbar = updateNavbar;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    updateNavbar();
});
