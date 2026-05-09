/**
 * HostelMart Global Authentication Manager
 * Handles login state, profile dropdown updates, and logout across all pages.
 */

function checkLoginStatus() {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const userName = localStorage.getItem('userName');
    
    if (userLoggedIn === 'true' && userName) {
        // Update Login Text
        const loginText = document.getElementById('login-text');
        if (loginText) loginText.textContent = userName;
        
        // Update Profile Link
        const profileLink = document.getElementById('profile-link');
        if (profileLink) profileLink.href = 'Profile.html';
        
        // Update Icon Color
        const loginIcon = document.querySelector('ion-icon[name="person-circle-outline"]');
        if (loginIcon) {
            loginIcon.style.color = '#5D4037';
            loginIcon.classList.remove('text-gray-400');
        }
    }

    // Also update saved address if it exists
    const savedAddress = localStorage.getItem('userAddress');
    const addressElement = document.getElementById('current-address');
    if (savedAddress && addressElement) {
        addressElement.textContent = savedAddress;
    }
}

function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    // We don't necessarily want to remove the address on logout, 
    // but we can if the business logic requires it.
    window.location.reload();
}

// Export to window for access from HTML onclick handlers
window.logout = logout;

// Initialize on load
document.addEventListener('DOMContentLoaded', checkLoginStatus);
