/* =============================================
   BrownieVerse — Main JavaScript
   ============================================= */

'use strict';

// =============================================
// FLAVOR DATA (4 Brownie Bites)
// =============================================
const PRODUCTS = [
  {
    id: 'bv-001',
    name: 'Classic Brownie Bites',
    category: 'bites',
    description: 'Our signature fudgy dark chocolate brownie bites. Dense, gooey, and irresistibly rich — the bite that started it all.',
    image: 'c.jpg',  // ← Changed from genspark URL to local file
    badge: 'Classical',
    rating: 4.8,
    reviews: 128,
    emoji: '🍫',
  },
  {
    id: 'bv-002',
    name: 'Kaab Ghezal Bites',
    category: 'bites',
    description: 'A fusion Moroccan masterpiece — classic fudgy brownie bites crowned with a luxurious marble Kaab Ghezal swirl and Topped with Magical Sugary Dust. Moroccan-inspired elegance.',
    image: 'kz.jpg',  // ← Using your local Kaab Ghezal image
    badge: 'Speciality & Best Seller',
    rating: 5.0,
    reviews: 95,
    emoji: '🌙',
  },
  {
    id: 'bv-003',
    name: 'Oreo Bites',
    category: 'bites',
    description: 'Indulgent fudgy brownie bites crowned with Oreo cookies & cream frosting and a real Oreo cookie perched on top. Pure, unapologetic indulgence.',
    image: 'o.jpg',  // ← Using your local Oreo image
    badge: 'Fan Favourite',
    rating: 4.9,
    reviews: 72,
    emoji: '🍪',
  },
  {
    id: 'bv-004',
    name: 'Choco-Dubai Bites',
    category: 'bites',
    description: 'A Middle Eastern-inspired marvel — fudgy brownie base layered with pistachio cream filling and topped with golden, crispy kunaffa strands. Extraordinary.',
    image: 'k.jpg',  // ← Using your local Kunaffa image
    badge: 'Most Famous',
    rating: 4.9,
    reviews: 37,
    emoji: '🌿',
  },
];

// =============================================
// PACKS DATA (4 Pack Types)
// =============================================
const PACKS = [
  {
    id: 'pack-1',
    name: '1 Pack',
    subtitle: 'Classic Bites',
    price: 99,
    contents: ['Classic Brownie Bites'],
    badge: null,
    popular: false,
    emoji: '📦',
  },
  {
    id: 'pack-2',
    name: '2 Pack',
    subtitle: 'Classic & Kaab Ghezal',
    price: 175,
    contents: ['Classic Brownie Bites', 'Kaab Ghezal Bites'],
    badge: null,
    popular: false,
    emoji: '🎀',
  },
  {
    id: 'pack-3',
    name: 'Pack Moyen',
    subtitle: 'Classic, Kaab Ghezal & Oreo',
    price: 199,
    contents: ['Classic Brownie Bites', 'Kaab Ghezal Bites', 'Oreo Bites'],
    badge: '⭐ Most Popular',
    popular: true,
    emoji: '🎁',
  },
  {
    id: 'pack-4',
    name: 'Grand Pack',
    subtitle: 'All Flavors',
    price: 350,
    contents: ['Classic Brownie Bites', 'Kaab Ghezal Bites', 'Oreo Bites', 'Kunaffa Bites'],
    badge: '🏆 Best Value',
    popular: false,
    emoji: '👑',
  },
];

// =============================================
// CART STATE
// =============================================
let cart = [];

// =============================================
// DOM REFERENCES
// =============================================
const navbar           = document.getElementById('navbar');
const hamburger        = document.getElementById('hamburger');
const mobileNav        = document.getElementById('mobileNav');
const cartToggle       = document.getElementById('cartToggle');
const cartOverlay      = document.getElementById('cartOverlay');
const cartDrawer       = document.getElementById('cartDrawer');
const cartClose        = document.getElementById('cartClose');
const cartContinue     = document.getElementById('cartContinue');
const cartCount        = document.getElementById('cartCount');
const cartItems        = document.getElementById('cartItems');
const cartFooter       = document.getElementById('cartFooter');
const cartTotalDisplay = document.getElementById('cartTotalDisplay');
const cartCheckout     = document.getElementById('cartCheckout');
const toastContainer   = document.getElementById('toastContainer');
const productsGrid     = document.getElementById('productsGrid');
const packsGrid        = document.getElementById('packsGrid');
const orderForm        = document.getElementById('orderForm');
const communityForm    = document.getElementById('communityForm');
const orderProductSelector = document.getElementById('orderProductSelector');
// =============================================
// BUSINESS WHATSAPP CONFIG
// =============================================
const WHATSAPP_NUMBER = '212703920799'; // ← REPLACE with your business number (no +, no spaces)
// Example: '212612345678' for +212 612-345678

// =============================================
// PAGE LOADER
// =============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('page-loader').classList.add('hidden');
  }, 1400);
});

// =============================================
// NAVBAR SCROLL BEHAVIOR
// =============================================
const navScrollHandler = () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    document.getElementById('navOrderBtn').style.display = 'inline-flex';
  } else {
    navbar.classList.remove('scrolled');
    document.getElementById('navOrderBtn').style.display = 'none';
  }
};
window.addEventListener('scroll', navScrollHandler, { passive: true });

// Active nav link on scroll
const sections = ['hero', 'products', 'packs', 'about', 'order', 'community'];
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// =============================================
// MOBILE NAV
// =============================================
hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// =============================================
// SCROLL REVEAL
// =============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

const observeReveal = () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
};

// =============================================
// RENDER PRODUCTS (Flavors — no price)
// =============================================
function renderProducts() {
  productsGrid.innerHTML = PRODUCTS.map((p, idx) => `
    <article class="product-card reveal reveal-delay-${(idx % 4) + 1}"
             data-product-id="${p.id}"
             role="article"
             aria-label="${p.name}">
      <div class="product-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-category">Brownie Bites</div>
        <h3 class="product-name">${p.emoji} ${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <div class="product-rating" aria-label="${p.rating} stars, ${p.reviews} reviews">
            ${'★'.repeat(Math.floor(p.rating))}
            <span>(${p.reviews})</span>
          </div>
          <a href="#packs" class="btn btn-ghost" style="padding:0.5rem 1.2rem;font-size:0.68rem;">
            See Packs
          </a>
        </div>
      </div>
    </article>
  `).join('');

  observeReveal();
}

// =============================================
// RENDER PACKS
// =============================================
function renderPacks() {
  if (!packsGrid) return;
  packsGrid.innerHTML = PACKS.map((pack, idx) => `
    <div class="pack-card${pack.popular ? ' popular' : ''} reveal reveal-delay-${idx + 1}">
      ${pack.popular ? '<div class="pack-popular-ribbon">Most Popular</div>' : ''}
      ${pack.badge ? `<div class="pack-badge">${pack.badge}</div>` : ''}

      <div class="pack-name">${pack.name}</div>
      <div class="pack-subtitle">${pack.subtitle}</div>

      <div class="pack-divider"></div>

      <div class="pack-contents">
        ${pack.contents.map(item => `
          <div class="pack-item">
            <div class="pack-item-dot"></div>
            <span>${item}</span>
          </div>
        `).join('')}
      </div>

      <div class="pack-price">
        <span class="pack-price-num">${pack.price}</span>
        <span class="pack-price-currency">DH</span>
      </div>

      <a href="#order" class="pack-cta" onclick="preSelectPack('${pack.id}')">
        <i class="fas fa-shopping-bag"></i>
        Order This Pack
      </a>
    </div>
  `).join('');

  observeReveal();
}

// =============================================
// ORDER FORM — PACK SELECTOR
// =============================================
function renderOrderProductSelector() {
  orderProductSelector.innerHTML = PACKS.map(pack => `
    <div class="product-selector-item">
      <div class="psi-info">
        <input type="checkbox" class="psi-check" id="psi-${pack.id}" data-pack-id="${pack.id}"
               onchange="toggleOrderPack('${pack.id}', this.checked)" />
        <label for="psi-${pack.id}" style="cursor:pointer">
          <span class="psi-name">${pack.emoji} ${pack.name}</span>
          <span class="psi-price">&nbsp;— ${pack.price} DH</span>
        </label>
      </div>
      <div class="psi-qty" id="psi-qty-${pack.id}">
        <button type="button" class="qty-btn" onclick="changeOrderQty('${pack.id}', -1)">−</button>
        <span class="qty-val" id="psi-qty-val-${pack.id}">1</span>
        <button type="button" class="qty-btn" onclick="changeOrderQty('${pack.id}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

let orderSelections = {}; // { packId: qty }

function toggleOrderPack(packId, checked) {
  if (checked) {
    orderSelections[packId] = 1;
    document.getElementById(`psi-qty-${packId}`)?.classList.add('active');
  } else {
    delete orderSelections[packId];
    document.getElementById(`psi-qty-${packId}`)?.classList.remove('active');
  }
  updateOrderSummary();
}

function changeOrderQty(packId, delta) {
  if (!orderSelections[packId]) return;
  orderSelections[packId] = Math.max(1, orderSelections[packId] + delta);
  const valEl = document.getElementById(`psi-qty-val-${packId}`);
  if (valEl) valEl.textContent = orderSelections[packId];
  updateOrderSummary();
}

function updateOrderSummary() {
  const summaryBox = document.getElementById('orderSummary');
  const selected = Object.entries(orderSelections);

  if (selected.length === 0) {
    summaryBox.innerHTML = `<div class="os-row"><span>No pack selected</span><span></span></div>`;
    return;
  }

  let total = 0;
  let rows = '';
  selected.forEach(([pid, qty]) => {
    const p = PACKS.find(pk => pk.id === pid);
    if (!p) return;
    const lineTotal = p.price * qty;
    total += lineTotal;
    rows += `<div class="os-row"><span>${p.name} ×${qty}</span><span>${lineTotal} DH</span></div>`;
  });

  summaryBox.innerHTML = `
    ${rows}
    <div class="os-row os-total"><span>Total</span><span>${total} DH</span></div>
  `;
}

// Pre-select a pack when clicking "Order This Pack" from the menu
window.preSelectPack = function(packId) {
  // Uncheck all first
  PACKS.forEach(p => {
    const cb = document.getElementById(`psi-${p.id}`);
    if (cb) cb.checked = false;
    document.getElementById(`psi-qty-${p.id}`)?.classList.remove('active');
    delete orderSelections[p.id];
  });
  // Check the selected pack
  orderSelections[packId] = 1;
  const cb = document.getElementById(`psi-${packId}`);
  if (cb) cb.checked = true;
  document.getElementById(`psi-qty-${packId}`)?.classList.add('active');
  updateOrderSummary();
};

// =============================================
// CART — Add packs to cart
// =============================================
window.addPackToCart = function(packId, event) {
  event?.stopPropagation();
  const pack = PACKS.find(p => p.id === packId);
  if (!pack) return;

  const existing = cart.find(item => item.id === packId);
  if (existing) {
    existing.qty += 1;
    showToast(`${pack.emoji} Added another ${pack.name}`, 'success');
  } else {
    cart.push({ ...pack, qty: 1 });
    showToast(`${pack.emoji} ${pack.name} added to cart!`, 'success');
  }

  updateCartUI();
  syncCartToOrderForm();
};

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  syncCartToOrderForm();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCartUI();
  syncCartToOrderForm();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function updateCartUI() {
  const total = getCartTotal();
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.classList.add('visible');
  } else {
    cartCount.classList.remove('visible');
  }

  cartTotalDisplay.textContent = `${total} DH`;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your cart is empty.<br />Add some brownie bites!</p>
      </div>`;
    cartFooter.style.display = 'none';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img" style="background:var(--cream-dark);display:flex;align-items:center;justify-content:center;font-size:2rem;">
          ${item.emoji}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price} DH</div>
          <div class="cart-item-controls">
            <button class="ci-qty-btn" onclick="changeQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
            <span class="ci-qty">${item.qty}</span>
            <button class="ci-qty-btn" onclick="changeQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
            <button class="ci-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove ${item.name}">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        </div>
        <div class="cart-item-total">${item.price * item.qty} DH</div>
      </div>
    `).join('');
    cartFooter.style.display = 'block';
  }
}

// Cart drawer toggle
function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  cartOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartContinue.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

cartCheckout.addEventListener('click', () => {
  closeCart();
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
});

// Sync cart to order form
function syncCartToOrderForm() {
  PACKS.forEach(p => {
    const checkbox = document.getElementById(`psi-${p.id}`);
    if (!checkbox) return;
    const cartItem = cart.find(i => i.id === p.id);
    if (cartItem) {
      checkbox.checked = true;
      orderSelections[p.id] = cartItem.qty;
      document.getElementById(`psi-qty-${p.id}`)?.classList.add('active');
      const valEl = document.getElementById(`psi-qty-val-${p.id}`);
      if (valEl) valEl.textContent = cartItem.qty;
    } else {
      checkbox.checked = false;
      delete orderSelections[p.id];
      document.getElementById(`psi-qty-${p.id}`)?.classList.remove('active');
    }
  });
  updateOrderSummary();
}

// =============================================
// ORDER FORM SUBMISSION
// =============================================
// =============================================
// ORDER FORM SUBMISSION → WHATSAPP
// =============================================
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateOrderForm()) return;

  // Gather form data
  const name = document.getElementById('orderName').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const address = document.getElementById('orderAddress').value.trim();
  const notes = document.getElementById('orderNotes').value.trim();
  
  // Build order items string
  const orderItems = Object.entries(orderSelections).map(([pid, qty]) => {
    const pack = PACKS.find(p => p.id === pid);
    return `• ${pack?.name || pid} ×${qty} = ${pack?.price * qty} DH`;
  }).join('\n');
  
  const total = Object.entries(orderSelections).reduce((sum, [pid, qty]) => {
    const pack = PACKS.find(p => p.id === pid);
    return sum + (pack ? pack.price * qty : 0);
  }, 0);

  // Format WhatsApp message (URL-encoded)
  const message = `
🍫 *NEW ORDER — BrownieVerse* 🍫

👤 *Customer*: ${name}
📱 *Phone*: ${phone}
📍 *Address*: ${address}

📦 *Order Details*:
${orderItems}

💰 *Total*: ${total} DH

📝 *Notes*: ${notes || 'None'}

⏰ *Order Time*: ${new Date().toLocaleString('en-MA', { 
    timeZone: 'Africa/Casablanca',
    hour: '2-digit', 
    minute: '2-digit',
    day: '2-digit',
    month: 'short'
  })}

──────────────
Sent from BrownieVerse.ma
  `.trim();

  // Encode for URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  // Show confirmation before redirecting
  const submitBtn = document.getElementById('orderSubmitBtn');
  const originalBtnText = submitBtn.innerHTML;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';

  // Small delay for UX, then open WhatsApp
  setTimeout(() => {
    // Open WhatsApp (works on mobile app + desktop web)
    window.open(whatsappURL, '_blank');
    
    // Show success toast
    showToast('📱 Opening WhatsApp… Please send the message to confirm your order!', 'success');
    
    // Reset form after short delay
    setTimeout(() => {
      orderForm.reset();
      orderSelections = {};
      renderOrderProductSelector();
      updateOrderSummary();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }, 1500);
  }, 800);
});

function validateOrderForm() {
  const name  = document.getElementById('orderName').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const addr  = document.getElementById('orderAddress').value.trim();
  const hasProducts = Object.keys(orderSelections).length > 0;

  if (!name)  { showToast('Please enter your full name.', 'error'); document.getElementById('orderName').focus(); return false; }
  if (!phone) { showToast('Please enter your phone number.', 'error'); document.getElementById('orderPhone').focus(); return false; }
  if (!addr)  { showToast('Please enter your delivery address.', 'error'); document.getElementById('orderAddress').focus(); return false; }
  if (!hasProducts) { showToast('Please select at least one pack.', 'error'); return false; }
  return true;
}

// =============================================
// COMMUNITY FORM SUBMISSION
// =============================================
communityForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name  = document.getElementById('communityName').value.trim();
  const email = document.getElementById('communityEmail').value.trim();
  const phone = document.getElementById('communityPhone').value.trim();

  if (!name)  { showToast('Please enter your name, Captain!', 'error'); return; }
  if (!email || !email.includes('@')) { showToast('Please enter a valid email address.', 'error'); return; }

  const submitBtn = document.getElementById('communitySubmitBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';

  try {
    const res = await fetch('tables/brownieverse_community', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, source: 'website_waitlist', status: 'pending' }),
    });

    if (!res.ok) throw new Error('Community join failed');

    communityForm.reset();
    showSuccessOverlay('communitySuccess');
    updatePirateCount();
  } catch (err) {
    console.error('Community error:', err);
    showToast('Something went wrong. Please try again!', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-skull-crossbones"></i> Join the Pirates';
  }
});

// Update pirate count dynamically
async function updatePirateCount() {
  try {
    const res = await fetch('tables/brownieverse_community?limit=1');
    const data = await res.json();
    const count = (data.total || 0) + 200;
    const el = document.getElementById('pirateCount');
    if (el) el.textContent = `Join ${count}+ Pirates already aboard`;
  } catch (_) { /* silent fail */ }
}

// =============================================
// TOAST NOTIFICATIONS
// =============================================
function showToast(message, type = '') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span>${icon}</span> ${message}`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-out 0.4s var(--ease-in) forwards';
    toast.addEventListener('animationend', () => toast.remove());
  }, 3500);
}

// =============================================
// SUCCESS OVERLAYS
// =============================================
function showSuccessOverlay(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

window.closeSuccess = function(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

document.querySelectorAll('.success-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSuccess(overlay.id);
  });
});

// =============================================
// KEYBOARD ACCESSIBILITY
// =============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
    document.querySelectorAll('.success-overlay').forEach(o => o.classList.remove('active'));
    document.body.style.overflow = '';
  }
});

// =============================================
// SMOOTH SCROLL for hash links
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// =============================================
// FLAVOR STRIP — CLICK SCROLL
// =============================================
document.querySelectorAll('.flavor-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });
});

// =============================================
// ANIMATE NUMBERS (stats)
// =============================================
function animateNumber(el, target, suffix = '') {
  let current = 0;
  const increment = Math.ceil(target / 60);
  const interval = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(interval);
  }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEls = entry.target.querySelectorAll('.stat-num');
      const values = [500, 4, 100];
      const suffixes = ['+', '', '%'];
      numEls.forEach((el, i) => animateNumber(el, values[i], suffixes[i]));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// =============================================
// PARALLAX HERO EFFECT
// =============================================
window.addEventListener('scroll', () => {
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && window.innerWidth > 900) {
    const scrollY = window.scrollY;
    heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
  }
}, { passive: true });

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderPacks();
  renderOrderProductSelector();
  updateCartUI();
  updatePirateCount();
  observeReveal();
// =============================================
// SCHEDULE: HIGHLIGHT TODAY
// =============================================
function highlightScheduleDays() {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = days[new Date().getDay()];
  
  document.querySelectorAll('.schedule-days .day').forEach(dayEl => {
    const dayText = dayEl.textContent.toLowerCase();
    if (dayText === today.substring(0, 3)) {
      dayEl.style.boxShadow = '0 0 0 2px var(--brown-deep), 0 4px 12px rgba(59,26,10,0.2)';
      dayEl.style.transform = 'scale(1.05)';
    }
  });
}

// Run on load + when section scrolls into view
if (document.getElementById('schedule')) {
  highlightScheduleDays();
  
  const scheduleObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      highlightScheduleDays();
      scheduleObserver.disconnect();
    }
  }, { threshold: 0.3 });
  
  scheduleObserver.observe(document.getElementById('schedule'));
}
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderProducts();
  renderPacks();
  renderOrderProductSelector();
  updateCartUI();
  updatePirateCount();
  observeReveal();
}

// window globals for inline onclick
window.removeFromCart  = removeFromCart;
window.changeQty       = changeQty;
window.toggleOrderPack = toggleOrderPack;
window.changeOrderQty  = changeOrderQty;
