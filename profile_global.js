/**
 * HostelMart Global Profile & Address Manager
 * Handles user profile fetching, auto-filling, and cross-page persistence.
 */

const ProfileManager = {
    _profile: null,
    _loading: false,

    /**
     * Fetches user profile from the server and caches it
     */
    async fetchProfile() {
        const token = localStorage.getItem('userToken');
        if (!token) return null;

        this._loading = true;
        try {
            const response = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                this._profile = data.user;
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                // Sync with address localStorage keys for backward compatibility
                if (data.user.address) {
                    localStorage.setItem('deliveryAddress', data.user.address);
                    const detailed = {
                        house: data.user.hostel,
                        roomNumber: data.user.room,
                        fullName: data.user.name,
                        mobile: data.user.phone,
                        locality: data.user.address,
                        type: data.user.addressType || 'Home'
                    };
                    localStorage.setItem('detailedAddress', JSON.stringify(detailed));
                }
                
                return data.user;
            }
        } catch (error) {
            console.error("Profile Fetch Error:", error);
        } finally {
            this._loading = false;
        }
        return JSON.parse(localStorage.getItem('userData'));
    },

    /**
     * Returns the current profile (cached or fetched)
     */
    async getProfile() {
        if (this._profile) return this._profile;
        return await this.fetchProfile();
    },

    /**
     * Updates the user profile on the server and locally
     */
    async updateProfile(data) {
        const token = localStorage.getItem('userToken');
        if (!token) {
            // Save locally for guests
            const current = JSON.parse(localStorage.getItem('userData') || '{}');
            const updated = { ...current, ...data };
            localStorage.setItem('userData', JSON.stringify(updated));
            return updated;
        }

        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                this._profile = result.user;
                localStorage.setItem('userData', JSON.stringify(result.user));
                return result.user;
            }
        } catch (error) {
            console.error("Profile Update Error:", error);
        }
        return null;
    },

    /**
     * Auto-fills checkout form with a premium animation sequence
     */
    async loadAndFillCheckout() {
        const form = {
            name: document.getElementById('guest-name'),
            phone: document.getElementById('guest-phone'),
            hostel: document.getElementById('guest-hostel'),
            room: document.getElementById('guest-room'),
            address: document.getElementById('guest-address')
        };

        if (!form.name) return; // Not on checkout page

        // Show loading state (shimmer effect if styles exist)
        Object.values(form).forEach(el => el && el.classList.add('animate-pulse', 'bg-gray-100'));

        const profile = await this.getProfile();
        
        // Remove pulse after 800ms for a "loading" feel
        setTimeout(() => {
            Object.values(form).forEach(el => el && el.classList.remove('animate-pulse', 'bg-gray-100'));
            
            if (profile) {
                this._animateFill(form.name, profile.name);
                this._animateFill(form.phone, profile.phone);
                this._animateFill(form.hostel, profile.hostel);
                this._animateFill(form.room, profile.room);
                this._animateFill(form.address, profile.address);
            } else {
                // Fallback to guest profiles
                const guestDetails = JSON.parse(localStorage.getItem('deliveryDetails') || '{}');
                if (guestDetails.name) {
                    this._animateFill(form.name, guestDetails.name);
                    this._animateFill(form.phone, guestDetails.phone);
                    this._animateFill(form.hostel, guestDetails.hostel);
                    this._animateFill(form.room, guestDetails.room);
                    this._animateFill(form.address, guestDetails.address);
                }
            }
        }, 800);
    },

    _animateFill(element, value) {
        if (!element || !value) return;
        
        // Simple "fade in" text animation
        element.style.opacity = '0';
        element.value = value;
        element.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => element.style.opacity = '1', 50);
    }
};

// Global Exposure
window.ProfileManager = ProfileManager;

// Auto-run on checkout page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('Checkout.html')) {
        ProfileManager.loadAndFillCheckout();
    }
});
