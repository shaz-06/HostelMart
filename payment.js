document.addEventListener('DOMContentLoaded', () => {
    const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
    
    if (!pendingOrder) {
        window.location.href = 'PaymentMethod.html';
        return;
    }

    renderSummary(pendingOrder);
    initPaymentLogic(pendingOrder);
    startTimer(600); // 10 minutes
});

function renderSummary(order) {
    const payable = parseInt(order.totalAmount.replace(/[^\d]/g, ''));
    const original = Math.round(payable / 0.9); // Reverse 10% discount for summary display
    const discount = original - payable;

    document.getElementById('order-id-label').textContent = order.orderId;
    document.getElementById('summary-total').textContent = '₹' + original;
    document.getElementById('summary-discount').textContent = '-₹' + discount;
    document.getElementById('summary-payable').textContent = '₹' + payable;
}

function initPaymentLogic(order) {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const payable = parseInt(order.totalAmount.replace(/[^\d]/g, ''));
    const upiId = 'hostelmart@upi'; // Placeholder UPI ID
    const upiUrl = `upi://pay?pa=${upiId}&pn=HostelMart&am=${payable}&cu=INR&tr=${order.orderId}`;

    if (isMobile) {
        document.getElementById('mobile-view').style.display = 'block';
        setupMobileLinks(upiUrl);
    } else {
        document.getElementById('desktop-view').style.display = 'block';
        generateQR(upiUrl);
    }

    // After 10 seconds of being on the page, simulate a payment check
    // This allows the user to actually look at the QR or click a button
    setTimeout(() => {
        simulatePaymentStatus();
    }, 12000);
}

function setupMobileLinks(baseUpi) {
    const phonepeLink = baseUpi.replace('upi://', 'phonepe://');
    const gpayLink = baseUpi.replace('upi://', 'gpay://upi/');
    const paytmLink = baseUpi.replace('upi://', 'paytmmp://');

    document.getElementById('pay-phonepe').href = phonepeLink;
    document.getElementById('pay-gpay').href = gpayLink;
    document.getElementById('pay-paytm').href = paytmLink;
    document.getElementById('pay-generic').href = baseUpi;

    // Add click listeners to trigger simulation after clicking an app
    const buttons = document.querySelectorAll('.app-button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(simulatePaymentStatus, 2000);
        });
    });
}

function generateQR(url) {
    const qrContainer = document.getElementById('qr-code');
    new QRCode(qrContainer, {
        text: url,
        width: 220,
        height: 220,
        colorDark : "#3E2723",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    const display = document.getElementById('timer');
    
    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            alert('Payment session expired. Please try again.');
            window.location.href = 'PaymentMethod.html';
        }
    }, 1000);
}

async function simulatePaymentStatus() {
    const overlay = document.getElementById('simulation-overlay');
    const loadingState = document.getElementById('loading-state');
    const successState = document.getElementById('success-state');
    const checkmark = document.getElementById('checkmark');

    overlay.style.display = 'flex';
    
    // Simulate API check (wait 3 seconds)
    setTimeout(async () => {
        const orderData = JSON.parse(localStorage.getItem('pendingOrder'));
        
        try {
            // Save to database via API
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            const result = await response.json();

            if (result.success) {
                // Save order locally fallback
                let localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
                localOrders.unshift(orderData);
                localStorage.setItem('userOrders', JSON.stringify(localOrders));

                // Clear sensitive session data
                localStorage.removeItem('pendingOrder');
                localStorage.removeItem('checkoutItem');

                // Show success UI
                loadingState.style.display = 'none';
                successState.style.display = 'block';
                checkmark.style.display = 'flex';

                // Redirect to success page or home
                setTimeout(() => {
                    window.location.href = 'Orders.html?orderId=' + orderData.orderId + '&phone=' + orderData.phone;
                }, 3000);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error("Payment sync failed:", err);
            overlay.style.display = 'none';
            alert("Payment verification failed. Please try again or contact support.");
        }
    }, 5000);
}
