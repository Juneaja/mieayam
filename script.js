// Data menu
const menuData = [
    {
        id: 1,
        name: "Nasi Goreng Spesial",
        price: 25000,
        category: "makanan",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3133?w=400&h=300&fit=crop",
        description: "Nasi goreng dengan telur, ayam, dan sayuran"
    },
    {
        id: 2,
        name: "Ayam Geprek",
        price: 22000,
        category: "makanan",
        image: "https://images.unsplash.com/photo-1579586140626-717308eb335e?w=400&h=300&fit=crop",
        description: "Ayam crispy dengan sambal pedas"
    },
    {
        id: 3,
        name: "Mie Goreng",
        price: 20000,
        category: "makanan",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
        description: "Mie goreng spesial dengan bumbu rahasia"
    },
    {
        id: 4,
        name: "Es Teh Manis",
        price: 8000,
        category: "minuman",
        image: "https://images.unsplash.com/photo-1623225866195-8b2d3f0a63c5?w=400&h=300&fit=crop",
        description: "Es teh manis segar"
    },
    {
        id: 5,
        name: "Jus Jeruk",
        price: 15000,
        category: "minuman",
        image: "https://images.unsplash.com/photo-1571933561358-d1b7f616b590?w=400&h=300&fit=crop",
        description: "Jus jeruk segar asli"
    },
    {
        id: 6,
        name: "Kopi Hitam",
        price: 12000,
        category: "minuman",
        image: "https://images.unsplash.com/photo-1494314671902-399b181aab93?w=400&h=300&fit=crop",
        description: "Kopi hitam pekat panas"
    },
    {
        id: 7,
        name: "Pisang Goreng",
        price: 10000,
        category: "snack",
        image: "https://images.unsplash.com/photo-1562440499-64b4a9a2c6b5?w=400&h=300&fit=crop",
        description: "Pisang goreng crispy"
    },
    {
        id: 8,
        name: "Martabak Manis",
        price: 35000,
        category: "snack",
        image: "https://images.unsplash.com/photo-1626074397566-0a1a205fcd73?w=400&h=300&fit=crop",
        description: "Martabak manis cokelat keju"
    }
];

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'all';

// Elements
const menuGrid = document.getElementById('menuGrid');
const cartModal = document.getElementById('cartModal');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const whatsappBtn = document.getElementById('whatsappBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const cartBtn = document.querySelector('.cart-btn');
const clearCartBtn = document.getElementById('clearCart');
const closeModal = document.querySelector('.close');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
    updateCart();
    setupEventListeners();
    smoothScroll();
});

// Setup event listeners
function setupEventListeners() {
    // Category filter
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderMenu();
        });
    });

    // Cart modal
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
        renderCart();
    });

    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    clearCartBtn.addEventListener('click', clearCart);

    // WhatsApp button
    whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sendToWhatsApp();
    });

    // Navbar mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

function renderMenu() {
    const filteredMenu = currentCategory === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);

    menuGrid.innerHTML = filteredMenu.map(item => `
        <div class="menu-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-price">Rp ${formatRupiah(item.price)}</div>
                <button class="add-to-cart" onclick="addToCart(${item.id})">
                    <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const item = menuData.find(menu => menu.id === id);
    const existingItem = cart.find(cartItem => cartItem.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    saveCart();
    updateCart();
    
    // Show notification
    showNotification(`${item.name} ditambahkan ke keranjang!`);
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Keranjang kosong</p>';
        cartTotal.textContent = 'Rp 0';
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">Rp ${formatRupiah(item.price)}</span>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                <span class="qty">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Rp ${formatRupiah(total)}`;
}

function changeQuantity(index, delta) {
    if (cart[index].quantity + delta <= 0) {
        removeFromCart(index);
        return;
    }
    
    cart[index].quantity += delta;
    saveCart();
    updateCart();
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
    renderCart();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCart();
    renderCart();
    cartModal.style.display = 'none';
    showNotification('Keranjang dikosongkan!');
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount).replace('Rp', '');
}

function sendToWhatsApp() {
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }

    const orderText = cart.map(item => 
        `• ${item.name} (${item.quantity}x) = Rp ${formatRupiah(item.price * item.quantity)}`
    ).join('\n');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `Halo! Saya ingin pesan:\n\n${orderText}\n\n*Total: Rp ${formatRupiah(total)}*\n\nTerima kasih! 😊`;

    const whatsappNumber = '6289602337878'; // Ganti dengan nomor WA Anda
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank');
    cartModal.style.display = 'none';
}

function showNotification(message) {
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Auto update cart count on page load
updateCart();
