/**
 * AuthModal Component
 * Handles Name + Phone Number login for HostelMart.
 */

const AuthModal = {
    render() {
        const modalHtml = `
            <div id="auth-modal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 hidden">
                <div class="absolute inset-0 bg-[#5D4037]/60 backdrop-blur-sm" onclick="AuthModal.hide()"></div>
                <div class="bg-[#FDFBF7] rounded-[2.5rem] shadow-[0_20px_50px_rgba(93,64,55,0.3)] max-w-md w-full relative overflow-hidden transform transition-all duration-500 scale-95 opacity-0" id="auth-modal-container">
                    <div class="p-8 md:p-12 space-y-8">
                        <div class="text-center">
                            <h2 class="text-3xl font-black text-[#5D4037] mb-2 italic">
                                <span class="text-[#8D6E63]">Hostel</span><span class="text-[#C8A951]">Mart</span>
                            </h2>
                            <p class="text-gray-500 text-sm font-bold uppercase tracking-widest">Student Login / Sign Up</p>
                        </div>

                        <form id="auth-form" class="space-y-6" onsubmit="AuthModal.handleSubmit(event)">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-[#8D6E63] ml-2">Full Name</label>
                                <input type="text" id="auth-name" placeholder="Enter your name" 
                                    class="w-full bg-[#F5F5DC] border-2 border-[#D7CCC8] rounded-2xl px-6 py-4 outline-none text-base font-bold text-[#5D4037] focus:border-[#5D4037] transition-all" required>
                            </div>

                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-[#8D6E63] ml-2">Phone Number</label>
                                <input type="tel" id="auth-phone" placeholder="e.g. 9876543210" 
                                    class="w-full bg-[#F5F5DC] border-2 border-[#D7CCC8] rounded-2xl px-6 py-4 outline-none text-base font-bold text-[#5D4037] focus:border-[#5D4037] transition-all" required>
                            </div>

                            <button type="submit" id="auth-submit-btn"
                                class="w-full bg-[#5D4037] text-[#F5F5DC] py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#8D6E63] shadow-xl shadow-[#D7CCC8]/60 transition-all active:scale-95 flex items-center justify-center gap-3">
                                <span>Continue</span>
                                <ion-icon name="arrow-forward-outline" class="text-xl"></ion-icon>
                            </button>
                        </form>

                        <p class="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                            By continuing, you agree to HostelMart's <br> Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        `;

        if (!document.getElementById('auth-modal')) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }
    },

    show() {
        this.render();
        const modal = document.getElementById('auth-modal');
        const container = document.getElementById('auth-modal-container');
        modal.classList.remove('hidden');
        setTimeout(() => {
            container.classList.remove('scale-95', 'opacity-0');
            container.classList.add('scale-100', 'opacity-100');
        }, 10);
    },

    hide() {
        const container = document.getElementById('auth-modal-container');
        container.classList.add('scale-95', 'opacity-0');
        container.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
            document.getElementById('auth-modal').classList.add('hidden');
        }, 300);
    },

    async handleSubmit(event) {
        event.preventDefault();
        const btn = document.getElementById('auth-submit-btn');
        const name = document.getElementById('auth-name').value;
        const phone = document.getElementById('auth-phone').value;

        // Validation
        if (!/^\d{10}$/.test(phone)) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = `<ion-icon name="sync-outline" class="animate-spin text-xl"></ion-icon> <span>Processing...</span>`;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                if (data.redirect) {
                    window.location.href = data.redirect;
                } else {
                    window.location.reload();
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login Fetch Error Detail:', error);
            alert('Something went wrong: ' + error.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<span>Continue</span> <ion-icon name="arrow-forward-outline" class="text-xl"></ion-icon>`;
        }
    }
};

window.AuthModal = AuthModal;
