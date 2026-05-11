document.addEventListener('DOMContentLoaded', () => {
    const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
    
    if (!pendingOrder) {
        window.location.href = 'PaymentMethod.html';
        return;
    }

    renderSummary(pendingOrder);
    initPaymentLogic(pendingOrder);
    startTimer(180); // 3 minutes = 180 seconds
});

function renderSummary(order) {
    const payable = parseInt(order.totalAmount.replace(/[^\d]/g, ''));
    const original = Math.round(payable / 0.9); // Reverse 10% discount
    const discount = original - payable;

    document.getElementById('order-id-label').textContent = order.orderId;
    document.getElementById('summary-total').textContent = '₹' + original;
    document.getElementById('summary-discount').textContent = '-₹' + discount;
    document.getElementById('summary-payable').textContent = payable.toLocaleString();
}

function initPaymentLogic(order) {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const payable = parseInt(order.totalAmount.replace(/[^\d]/g, ''));
    const upiId = 'hostelmart@upi';
    const upiUrl = `upi://pay?pa=${upiId}&pn=HostelMart&am=${payable}&cu=INR&tr=${order.orderId}`;

    if (isMobile) {
        document.getElementById('mobile-view').style.display = 'block';
        setupMobileLinks(upiUrl);
    } else {
        document.getElementById('desktop-view').style.display = 'block';
        generateQR(upiUrl);
    }
}

function setupMobileLinks(baseUpi) {
    const phonepeLink = baseUpi.replace('upi://', 'phonepe://');
    const gpayLink = baseUpi.replace('upi://', 'gpay://upi/');
    const paytmLink = baseUpi.replace('upi://', 'paytmmp://');

    const appBtns = [
        { id: 'pay-phonepe', link: phonepeLink },
        { id: 'pay-gpay', link: gpayLink },
        { id: 'pay-paytm', link: paytmLink }
    ];

    appBtns.forEach(app => {
        document.getElementById(app.id).addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = app.link;
            showMobileReturnPrompt();
        });
    });
}

function showMobileReturnPrompt() {
    document.getElementById('normal-actions').classList.add('hidden');
    document.getElementById('mobile-return-actions').classList.remove('hidden');
}

function resetMobileView() {
    document.getElementById('normal-actions').classList.remove('hidden');
    document.getElementById('mobile-return-actions').classList.add('hidden');
}

function generateQR(url) {
    const qrContainer = document.getElementById('qr-code');
    new QRCode(qrContainer, {
        text: url,
        width: 200,
        height: 200,
        colorDark : "#3E2723",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

let timerInterval;
function startTimer(duration) {
    let timer = duration, minutes, seconds;
    const display = document.getElementById('timer');
    
    timerInterval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            handleExpiry();
        }
    }, 1000);
}

function handleExpiry() {
    clearInterval(timerInterval);
    document.getElementById('timer-wrapper').style.background = '#FEE2E2';
    document.getElementById('timer-wrapper').style.color = '#B91C1C';
    document.getElementById('timer').textContent = "EXPIRED";
    
    // Disable UI
    document.getElementById('qr-container').classList.remove('qr-pulse');
    document.getElementById('qr-container').classList.add('qr-blur');
    document.getElementById('normal-actions').classList.add('hidden');
    document.getElementById('mobile-return-actions').classList.add('hidden');
    document.getElementById('expiry-actions').classList.remove('hidden');
}

function retryPayment() {
    window.location.reload();
}

function cancelPayment() {
    if (confirm("Are you sure you want to cancel this payment?")) {
        window.location.href = 'PaymentMethod.html';
    }
}

async function startVerification() {
    const overlay = document.getElementById('verifying-overlay');
    overlay.style.display = 'flex';
    
    // Simulate verification delay (3-5 seconds)
    const delay = Math.floor(Math.random() * 2000) + 3000;
    
    setTimeout(async () => {
        const orderData = JSON.parse(localStorage.getItem('pendingOrder'));
        
        try {
            // Save to database
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            const result = await response.json();

            if (result.success) {
                // Local save
                let localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
                localOrders.unshift(orderData);
                localStorage.setItem('userOrders', JSON.stringify(localOrders));

                // Clear session
                localStorage.removeItem('pendingOrder');
                localStorage.removeItem('checkoutItem');

                showSuccessState(orderData);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error("Verification error:", err);
            overlay.style.display = 'none';
            alert("Verification failed. If amount was debited, it will be refunded within 24 hours.");
        }
    }, delay);
}

function showSuccessState(orderData) {
    document.getElementById('verifying-overlay').style.display = 'none';
    const successOverlay = document.getElementById('success-overlay');
    successOverlay.style.display = 'flex';
    
    setTimeout(() => {
        window.location.href = 'Orders.html?orderId=' + orderData.orderId + '&phone=' + orderData.phone;
    }, 3000);
}
