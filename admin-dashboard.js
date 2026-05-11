// State management
let currentView = 'dashboard';
let products = [];
let orders = [];
let editingProductId = null;

// DOM Elements
const views = {
    dashboard: document.getElementById('view-dashboard'),
    products: document.getElementById('view-products'),
    orders: document.getElementById('view-orders')
};

// Initialization
async function init() {
    await fetchStats();
    await fetchProducts();
    await fetchOrders();
    renderDashboard();
    setupEventListeners();
}

// Data Fetching
async function fetchStats() {
    try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
            document.getElementById('stat-revenue').textContent = `₹${data.stats.revenue}`;
            document.getElementById('stat-orders').textContent = data.stats.orders;
            document.getElementById('stat-products').textContent = data.stats.products;
        }
    } catch (err) { console.error('Error fetching stats:', err); }
}

async function fetchProducts() {
    try {
        const res = await fetch('/api/products');
        products = await res.json();
        renderProducts();
    } catch (err) { console.error('Error fetching products:', err); }
}

async function fetchOrders() {
    try {
        const res = await fetch('/api/orders/track?phone=all');
        const data = await res.json();
        if (data.success) {
            orders = data.orders;
            renderOrders();
        }
    } catch (err) { console.error('Error fetching orders:', err); }
}

// Rendering
function switchView(viewName) {
    Object.keys(views).forEach(v => {
        views[v].style.display = v === viewName ? 'block' : 'none';
        document.querySelector(`[data-view="${v}"]`).classList.toggle('active', v === viewName);
    });
    currentView = viewName;
}

function renderProducts() {
    const container = document.getElementById('products-table-body');
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    container.innerHTML = filteredProducts.map(p => `
        <tr class="animate-fade">
            <td>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${p.image}" class="product-img" alt="">
                    <span>${p.name}</span>
                </div>
            </td>
            <td>${p.category}</td>
            <td>₹${p.price.toLocaleString('en-IN')}</td>
            <td>
                <span class="badge ${p.stock > 10 ? 'badge-success' : 'badge-warning'}">
                    ${p.stock} in stock
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-ghost" onclick="openEditModal('${p._id}')"><ion-icon name="create-outline"></ion-icon></button>
                    <button class="btn btn-danger" onclick="deleteProduct('${p._id}')"><ion-icon name="trash-outline"></ion-icon></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderOrders() {
    const container = document.getElementById('orders-table-body');
    const searchTerm = (document.getElementById('global-search').value || '').toLowerCase();
    
    const filteredOrders = orders.filter(o => {
        return o._id.toLowerCase().includes(searchTerm) || 
               o.userId.toLowerCase().includes(searchTerm) ||
               o.orderStatus.toLowerCase().includes(searchTerm);
    });

    container.innerHTML = filteredOrders.map(o => `
        <tr class="animate-fade">
            <td>#${o._id.slice(-6)}</td>
            <td>${o.userId}</td>
            <td>₹${o.totalAmount.toLocaleString('en-IN')}</td>
            <td><span class="badge badge-success">${o.paymentMethod}</span></td>
            <td>
                <select onchange="updateOrderStatus('${o._id}', this.value)" class="badge ${getStatusClass(o.orderStatus)}">
                    <option value="Processing" ${o.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${o.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${o.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>${new Date(o.createdAt).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    switch (status) {
        case 'Delivered': return 'badge-success';
        case 'Processing': return 'badge-warning';
        case 'Cancelled': return 'badge-danger';
        default: return 'badge-warning';
    }
}

// Product Actions
async function handleProductSubmit(e) {
    e.preventDefault();
    const formData = {
        name: document.getElementById('p-name').value,
        description: document.getElementById('p-desc').value,
        category: document.getElementById('p-category').value,
        price: parseFloat(document.getElementById('p-price').value),
        stock: parseInt(document.getElementById('p-stock').value),
        image: document.getElementById('p-image').value || 'https://via.placeholder.com/150'
    };

    try {
        const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
        const method = editingProductId ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (res.ok) {
            closeModal();
            fetchProducts();
            fetchStats();
        }
    } catch (err) { console.error('Error saving product:', err); }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchProducts();
            fetchStats();
        }
    } catch (err) { console.error('Error deleting product:', err); }
}

async function updateOrderStatus(id, status) {
    try {
        const res = await fetch(`/api/orders/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (res.ok) fetchOrders();
    } catch (err) { console.error('Error updating order:', err); }
}

// UI Helpers
function openAddModal() {
    editingProductId = null;
    document.getElementById('modal-title').textContent = 'Add New Product';
    document.getElementById('product-form').reset();
    document.getElementById('modal-overlay').style.display = 'flex';
}

function openEditModal(id) {
    const p = products.find(prod => prod._id === id);
    if (!p) return;
    editingProductId = id;
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('p-name').value = p.name;
    document.getElementById('p-desc').value = p.description;
    document.getElementById('p-category').value = p.category;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-stock').value = p.stock;
    document.getElementById('p-image').value = p.image;
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

function setupEventListeners() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            if (link.dataset.view) {
                switchView(link.dataset.view);
            }
        };
    });

    document.getElementById('global-search').oninput = (e) => {
        const val = e.target.value;
        if (currentView === 'products') {
            document.getElementById('product-search').value = val;
            renderProducts();
        } else if (currentView === 'orders') {
            renderOrders();
        }
    };

    document.getElementById('product-search').oninput = renderProducts;
    document.getElementById('category-filter').onchange = renderProducts;
    document.getElementById('product-form').onsubmit = handleProductSubmit;
}

function renderDashboard() {
    // Simple overview or recent items
}

// Start app
init();
