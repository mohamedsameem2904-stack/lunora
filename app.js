/* ==========================================================================
   VORTEX - FULL E-COMMERCE ENGINE & CATALOG ARCHITECTURE
   ========================================================================== */

// --- 1. Product Catalog Database ---
const products = [
  // PC Components
  {
    id: "comp-1",
    name: "NVIDIA GeForce RTX 4090 OC 24GB",
    category: "Components",
    price: 1599.99,
    badge: "HOT SALE",
    specs: "24GB GDDR6X | DLSS 3.5 | PCIe 4.0",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
    wattage: 450
  },
  {
    id: "comp-2",
    name: "Intel Core i9-14900KS Processor",
    category: "Components",
    price: 689.99,
    badge: "NEW",
    specs: "24 Cores (8P+16E) | Up to 6.2 GHz",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
    wattage: 253
  },
  {
    id: "comp-3",
    name: "Corsair Vengeance RGB DDR5 64GB (2x32GB)",
    category: "Components",
    price: 229.99,
    badge: "SALE",
    specs: "DDR5 6000MHz | CL30 | Dynamic RGB",
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
    wattage: 15
  },
  {
    id: "comp-4",
    name: "Samsung 990 PRO 2TB NVMe M.2 SSD",
    category: "Components",
    price: 179.99,
    badge: "BEST SELLER",
    specs: "Sequential Read up to 7450 MB/s",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80",
    wattage: 10
  },

  // Gaming Mice
  {
    id: "mouse-1",
    name: "VORTEX Apex Pro Wireless Mouse",
    category: "Mice",
    price: 129.99,
    badge: "NEW",
    specs: "49g Ultra-light | 30K Optical Sensor",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "mouse-2",
    name: "CyberGlide RGB Chroma Mouse",
    category: "Mice",
    price: 79.99,
    badge: "POPULAR",
    specs: "Ergonomic | 26K DPI | PTFE Skates",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80"
  },

  // Keyboards
  {
    id: "kb-1",
    name: "VORTEX CyberType Mechanical Keyboard",
    category: "Keyboards",
    price: 169.99,
    badge: "HOT SALE",
    specs: "75% Hot-Swappable | Gateron Yellow",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
  },

  // Pre-Built Systems
  {
    id: "pc-1",
    name: "VORTEX Titan X - RTX 4090 / i9-14900K",
    category: "Pre-Builts",
    price: 3499.99,
    badge: "ULTIMATE",
    specs: "RTX 4090 | 64GB DDR5 | 2TB Gen4 SSD",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
    wattage: 850
  },

  // Headsets & Setup Gear
  {
    id: "hs-1",
    name: "VORTEX Pulsar Wireless 7.1 Headset",
    category: "Headsets",
    price: 149.99,
    badge: "NEW",
    specs: "Spatial Audio | 50hr Battery | RGB",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chair-1",
    name: "VORTEX Ergonomic RGB Gaming Chair",
    category: "Setup Gear",
    price: 399.99,
    badge: "HOT SALE",
    specs: "Lumbar Support | 4D Armrests | Neon RGB",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80"
  }
];

// --- 2. State Management ---
let cart = JSON.parse(localStorage.getItem('vortex_cart')) || [];
let currentCategory = 'All';

// PC Builder Parts Selection State
let builderSelections = {
  cpu: null,
  gpu: null,
  ram: null,
  storage: null
};

// --- 3. App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  initPCBuilderSlots();
  lucide.createIcons();
});

// --- 4. Render Store Catalog ---
function renderProducts(itemsToRender = products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  if (itemsToRender.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No hardware found matching your criteria.</p>`;
    return;
  }

  itemsToRender.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <span class="product-badge">${product.badge}</span>
      <img src="${product.image}" alt="${product.name}" onclick="openQuickView('${product.id}')">
      <h3 class="product-title" onclick="openQuickView('${product.id}')">${product.name}</h3>
      <p class="product-specs">${product.specs}</p>
      <div class="product-bottom">
        <span class="product-price">$${product.price.toFixed(2)}</span>
        <button class="add-cart-btn" onclick="addToCart('${product.id}')">
          <i data-lucide="shopping-cart"></i> Add
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  lucide.createIcons();
}

// Filter Categories
function filterCategory(cat, element = null) {
  currentCategory = cat;
  
  if (element) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
  }

  document.getElementById('catalogTitle').innerText = `${cat.toUpperCase()} INVENTORY`;

  if (cat === 'All') {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === cat || (cat === 'Hot Sale' && p.badge.includes('HOT')));
    renderProducts(filtered);
  }
}

// Live Search Input Handler
function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.specs.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  renderProducts(filtered);
}

// --- 5. Cart Management & Storage ---
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`Added "${product.name}" to cart!`);
}

function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('vortex_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  document.getElementById('cartCount').innerText = totalCount;
  document.getElementById('cartHeaderCount').innerText = totalCount;

  // Render items
  const container = document.getElementById('cartItems');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = `<p style="text-align:center; color: var(--text-muted); margin-top: 40px;">Your cart is empty.</p>`;
  } else {
    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
          </div>
        </div>
      `;
      container.appendChild(el);
    });
  }

  // Subtotal calculation
  document.getElementById('cartSubtotal').innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById('cartTax').innerText = `$${tax.toFixed(2)}`;
  document.getElementById('cartTotal').innerText = `$${total.toFixed(2)}`;

  // Shipping Meter Calculation ($100 target)
  const target = 100;
  const progressFill = document.getElementById('shippingProgress');
  const statusText = document.getElementById('shippingStatus');

  if (subtotal >= target) {
    progressFill.style.width = '100%';
    statusText.innerText = "🎉 You unlocked FREE Global Express Shipping!";
  } else {
    const diff = target - subtotal;
    const pct = (subtotal / target) * 100;
    progressFill.style.width = `${pct}%`;
    statusText.innerText = `Add $${diff.toFixed(2)} more for FREE Global Express Shipping!`;
  }
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// --- 6. Custom PC Builder Engine ---
function initPCBuilderSlots() {
  const slotsContainer = document.getElementById('builderSlots');
  const builderCategories = ['Components'];

  const slots = [
    { label: 'Select Processor (CPU)', key: 'cpu' },
    { label: 'Select Graphics Card (GPU)', key: 'gpu' },
    { label: 'Select Memory (RAM)', key: 'ram' },
    { label: 'Select Storage (SSD)', key: 'storage' }
  ];

  slotsContainer.innerHTML = '';

  slots.forEach(slot => {
    const div = document.createElement('div');
    div.className = 'builder-slot';
    
    const availableItems = products.filter(p => p.category === 'Components');

    div.innerHTML = `
      <label>${slot.label}</label>
      <select onchange="updateBuilderSelection('${slot.key}', this.value)">
        <option value="">-- Choose Component --</option>
        ${availableItems.map(p => `<option value="${p.id}">${p.name} (+$${p.price})</option>`).join('')}
      </select>
    `;
    slotsContainer.appendChild(div);
  });
}

function updateBuilderSelection(key, productId) {
  builderSelections[key] = products.find(p => p.id === productId) || null;
  calculateBuilderStats();
}

function calculateBuilderStats() {
  let totalCost = 0;
  let totalWattage = 0;

  Object.values(builderSelections).forEach(item => {
    if (item) {
      totalCost += item.price;
      totalWattage += (item.wattage || 35);
    }
  });

  document.getElementById('builderTotalPrice').innerText = `$${totalCost.toFixed(2)}`;
  document.getElementById('builderWattage').innerText = `${totalWattage + 100} W`; // System base overhead
}

function openPCBuilder() {
  document.getElementById('builderModal').classList.add('open');
}

function addBuilderToCart() {
  const selectedItems = Object.values(builderSelections).filter(Boolean);
  if (selectedItems.length === 0) {
    showToast("Please select at least one component first!");
    return;
  }

  selectedItems.forEach(item => addToCart(item.id));
  closeModal('builderModal');
  toggleCart();
  showToast("Custom Gaming Rig components added to cart!");
}

// --- 7. Modals & Checkout Flow ---
function openQuickView(productId) {
  const p = products.find(item => item.id === productId);
  if (!p) return;

  const content = document.getElementById('quickViewContent');
  content.innerHTML = `
    <img src="${p.image}" alt="${p.name}">
    <div>
      <span class="product-badge">${p.badge}</span>
      <h2 style="font-family: var(--font-heading); margin: 10px 0;">${p.name}</h2>
      <p style="color: var(--text-muted); margin-bottom: 16px;">${p.specs}</p>
      <h3 style="font-family: var(--font-heading); color: var(--accent-purple); font-size: 1.8rem; margin-bottom: 20px;">$${p.price.toFixed(2)}</h3>
      <button class="glow-btn full-width" onclick="addToCart('${p.id}'); closeModal('quickViewModal');">ADD TO CART</button>
    </div>
  `;

  document.getElementById('quickViewModal').classList.add('open');
}

function openCheckout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  toggleCart();
  document.getElementById('checkoutModal').classList.add('open');
}

function handleCheckout(e) {
  e.preventDefault();
  cart = [];
  saveCart();
  updateCartUI();
  closeModal('checkoutModal');
  showToast("🚀 Order placed successfully! Confirmation sent to your email.");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

// Toast System
function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

