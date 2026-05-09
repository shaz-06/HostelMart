/**
 * HostelMart Global Address Manager
 * Handles delivery address selection, map integration, and persistence.
 */

let addressMap;
let addressMarker;

function openAddressModal() {
    const modal = document.getElementById('address-modal');
    const container = document.getElementById('address-container');
    const overlay = document.getElementById('overlay');
    
    if (!modal || !container || !overlay) return;

    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        container.classList.remove('scale-95', 'opacity-0');
        container.classList.add('scale-100', 'opacity-100');
        initAddressMap();
    }, 10);
}

function closeAddressModal() {
    const container = document.getElementById('address-container');
    const overlay = document.getElementById('overlay');
    
    if (!container || !overlay) return;

    container.classList.remove('scale-100', 'opacity-100');
    container.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        const modal = document.getElementById('address-modal');
        if (modal) modal.classList.add('hidden');
        overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 500);
}

function initAddressMap() {
    if (addressMap) return; // Already initialized

    const mapElement = document.getElementById('address-map');
    if (!mapElement) return;

    // Default location (e.g., Bangalore)
    const defaultLoc = [12.9716, 77.5946];
    
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error("Leaflet library not loaded");
        return;
    }

    addressMap = L.map('address-map').setView(defaultLoc, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(addressMap);

    addressMarker = L.marker(defaultLoc, { draggable: true }).addTo(addressMap);

    // Update manual fields on drag end
    addressMarker.on('dragend', function(e) {
        const position = addressMarker.getLatLng();
        reverseGeocode(position.lat, position.lng);
    });

    // Update on map click
    addressMap.on('click', function(e) {
        addressMarker.setLatLng(e.latlng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
    });
}

async function useGPS(event) {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    const gpsBtn = event.currentTarget;
    const originalHTML = gpsBtn.innerHTML;
    gpsBtn.innerHTML = '<ion-icon name="sync-outline" class="animate-spin text-lg"></ion-icon> Locating...';

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            if (addressMap) addressMap.setView([latitude, longitude], 16);
            if (addressMarker) addressMarker.setLatLng([latitude, longitude]);
            reverseGeocode(latitude, longitude);
            gpsBtn.innerHTML = originalHTML;
        },
        (error) => {
            console.error("GPS Error:", error);
            let msg = "Unable to retrieve your location.";
            if (error.code === 1) msg = "Location permission denied. Please enable it in your browser settings.";
            else if (error.code === 2) msg = "Position unavailable. Please ensure your Wi-Fi is ON and you are in a location with signal.";
            else if (error.code === 3) msg = "Location request timed out. Please try again.";
            
            alert(msg);
            gpsBtn.innerHTML = originalHTML;
        },
        options
    );
}

async function reverseGeocode(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        if (data.address) {
            const street = data.address.road || data.address.suburb || data.address.neighbourhood || '';
            const city = data.address.city || data.address.town || data.address.village || '';
            
            const streetInput = document.getElementById('manual-street');
            const cityInput = document.getElementById('manual-city');
            
            if (streetInput) streetInput.value = street;
            if (cityInput) cityInput.value = city;
        }
    } catch (err) {
        console.error("Geocoding error:", err);
    }
}

function saveAddress(event) {
    const streetInput = document.getElementById('manual-street');
    const cityInput = document.getElementById('manual-city');
    
    if (!streetInput || !cityInput) return;

    const street = streetInput.value;
    const city = cityInput.value;

    if (!street || !city) {
        alert("Please provide a complete address.");
        return;
    }

    const fullAddress = `${street}, ${city}`;
    localStorage.setItem('deliveryAddress', fullAddress);
    
    // If logged in, sync with database
    const token = localStorage.getItem('userToken');
    if (token) {
        fetch('/api/auth/profile', {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ address: fullAddress })
        }).catch(err => console.error("Sync error:", err));
    }

    // Update UI
    const currentAddressElem = document.getElementById('current-address');
    const currentLocationElem = document.getElementById('current-location');
    if (currentAddressElem) currentAddressElem.textContent = fullAddress;
    if (currentLocationElem) currentLocationElem.textContent = fullAddress;
    
    // Success animation
    const confirmBtn = event.currentTarget;
    const originalHTML = confirmBtn.innerHTML;
    confirmBtn.innerHTML = 'Address Saved!';
    confirmBtn.classList.replace('bg-[#5D4037]', 'bg-green-600');
    
    setTimeout(() => {
        closeAddressModal();
        // Reset button
        setTimeout(() => {
            confirmBtn.innerHTML = originalHTML;
            confirmBtn.classList.replace('bg-green-600', 'bg-[#5D4037]');
        }, 1000);
    }, 800);
}

// Function to load saved address on startup
function loadSavedAddress() {
    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedAddress) {
        const addressElement = document.getElementById('current-address');
        const locationElement = document.getElementById('current-location');
        if (addressElement) addressElement.textContent = savedAddress;
        if (locationElement) locationElement.textContent = savedAddress;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadSavedAddress();
    
    // Inject map styles if missing (skip on dedicated Address page)
    if (!document.getElementById('address-map-style') && !window.location.pathname.includes('Address.html')) {
        const style = document.createElement('style');
        style.id = 'address-map-style';
        style.textContent = `
            #address-map {
                height: 300px;
                width: 100%;
                border-radius: 1.5rem;
                z-index: 10;
            }
        `;
        document.head.appendChild(style);
    }
});

// Export functions to window
window.openAddressModal = openAddressModal;
window.closeAddressModal = closeAddressModal;
window.useGPS = useGPS;
window.saveAddress = saveAddress;
