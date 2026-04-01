/* =============================================
   BrownieVerse — Main JavaScript
   PIRATE EDITION - Optimized for Two-Column Layout + Google Sheets
   ============================================= */

'use strict';

// =============================================
// FLAVOR DATA
// =============================================
const PRODUCTS = [
  {
    id: 'bv-001',
    name: 'Classic Brownie Bites',
    category: 'bites',
    description: 'Our signature fudgy dark chocolate brownie bites. Dense, gooey, and irresistibly rich — the bite that started it all.',
    image: 'c.jpg',
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
    image: 'kz.jpg',
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
    image: 'o.jpg',
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
    image: 'k.jpg',
    badge: 'Most Famous',
    rating: 4.9,
    reviews: 37,
    emoji: '🌿',
  },
];

// =============================================
// PACKS DATA (4 Pack Types) - WITH CIRCULAR IMAGES
// =============================================
const PACKS = [
  {
    id: 'pack-1',
    name: '🏴‍☠️ Pirate Starter Pack',
    subtitle: 'Classic Bites',
    price: 99,
    contents: ['Classic Brownie Bites'],
    badge: '🦜 New Crew Member?',
    popular: false,
    emoji: null,
    image: 'pack1.png',
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
    image: 'pack2.png',
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
    image: 'pack3.png',
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
    image: 'pack4.png',
  },
];

// =============================================
// CONFIG
// =============================================
const WHATSAPP_NUMBER = '212703920799';
const SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwyi-h7XOtPi5Ob_30zfFmWKGffkhOYu1JGHcr-OH3FnT0vOMBQEEbAIuI_AJ9MOLInqw/exec';

// =============================================
// STATE
// =============================================
let cart = [];
let orderSelections = {};
let soundsInitialized = false;
let isMuted = false;
let currentVolume = 0.5;
let communitySectionVisible = false;
let soundsLoaded = { ocean: false, parrot: false, coin: false, laugh: false, thunder: false, chest: false, ominous: false };

// =============================================
// DOM REFERENCES
// =============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const cartToggle = document.getElementById('cartToggle');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartClose = document.getElementById('cartClose');
const cartContinue = document.getElementById('cartContinue');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartTotalDisplay = document.getElementById('cartTotalDisplay');
const cartCheckout = document.getElementById('cartCheckout');
const toastContainer = document.getElementById('toastContainer');
const productsGrid = document.getElementById('productsGrid');
const packsGrid = document.getElementById('packsGrid');
const orderForm = document.getElementById('orderForm');
const orderProductSelector = document.getElementById('orderProductSelector');
const communitySection = document.getElementById('community');

// =============================================
// PIRATE SOUND SYSTEM
// =============================================
const PIRATE_SOUNDS = {
  ocean: 'ocean.mp3',
  parrot: 'parrot.mp3',
  coin: 'coin.mp3',
  laugh: 'laugh.mp3',
  thunder: 'thunder.mp3',
  chest: 'chest.mp3',
  ominous: 'ominous.mp3',
};

const audioElements = {};

function initPirateSounds() {
  if (soundsInitialized) return;
  
  let loadedCount = 0;
  const totalSounds = Object.keys(PIRATE_SOUNDS).length;
  
  Object.keys(PIRATE_SOUNDS).forEach(key => {
    try {
      audioElements[key] = new Audio(PIRATE_SOUNDS[key]);
      audioElements[key].loop = (key === 'ocean' || key === 'ominous');
      audioElements[key].volume = currentVolume;
      audioElements[key].preload = 'auto';
      
      audioElements[key].addEventListener('canplaythrough', () => {
        soundsLoaded[key] = true;
        loadedCount++;
      });
      
      audioElements[key].addEventListener('error', () => {
        soundsLoaded[key] = false;
      });
      
      audioElements[key].load();
    } catch (err) {
      soundsLoaded[key] = false;
    }
  });
  
  soundsInitialized = true;
  
  const enableSoundsOnInteraction = () => {
    if (audioElements.ocean && soundsLoaded.ocean) {
      audioElements.ocean.volume = 0.15;
      audioElements.ocean.play().catch(() => {});
    }
    document.removeEventListener('click', enableSoundsOnInteraction);
    document.removeEventListener('touchstart', enableSoundsOnInteraction);
  };
  
  document.addEventListener('click', enableSoundsOnInteraction, { once: true });
  document.addEventListener('touchstart', enableSoundsOnInteraction, { once: true });
}

function playPirateSound(soundName, volume = 1, loop = false) {
  if (!soundsInitialized || isMuted || !audioElements[soundName] || !soundsLoaded[soundName]) return;
  
  const audio = audioElements[soundName];
  if (audio.readyState < 2) return;
  
  try {
    audio.currentTime = 0;
    audio.volume = currentVolume * volume;
    audio.loop = loop;
    audio.play().catch(() => {});
  } catch (err) {}
}

function stopPirateSound(soundName) {
  if (audioElements[soundName]) {
    audioElements[soundName].pause();
    audioElements[soundName].currentTime = 0;
  }
}

function createSoundToggle() {
  const toggle = document.createElement('button');
  toggle.className = 'sound-toggle';
  toggle.innerHTML = '<div class="sound-wave"></div><div class="sound-wave"></div>';
  toggle.setAttribute('aria-label', 'Toggle sound effects');
  toggle.title = 'Toggle Pirate Sounds';
  
  toggle.addEventListener('click', () => {
    isMuted = !isMuted;
    toggle.classList.toggle('muted', isMuted);
    
    Object.keys(audioElements).forEach(key => {
      if (audioElements[key].loop && soundsLoaded[key]) {
        isMuted ? audioElements[key].pause() : audioElements[key].play().catch(() => {});
      }
    });
    
    showVolumeIndicator(isMuted ? '🔇 Muted' : '🔊 Sounds On');
    
    if (!isMuted && soundsLoaded.coin) {
      setTimeout(() => playPirateSound('coin', 0.5), 100);
    }
  });
  
  document.body.appendChild(toggle);
  return toggle;
}

function showVolumeIndicator(text) {
  let indicator = document.querySelector('.volume-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'volume-indicator';
    document.body.appendChild(indicator);
  }
  
  indicator.textContent = text;
  indicator.classList.add('visible');
  setTimeout(() => indicator.classList.remove('visible'), 2000);
}

function setupAllSoundTriggers() {
  document.querySelectorAll('.gold-coin, .treasure-gem, .ancient-key').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (!isMuted) playPirateSound('coin', 0.3);
    });
  });
  
  document.querySelectorAll('.treasure-marker').forEach(marker => {
    marker.addEventListener('click', () => {
      if (!isMuted) playPirateSound('coin', 0.5);
    });
  });
  
  const googleFormBtn = document.getElementById('googleFormBtn');
  if (googleFormBtn) {
    googleFormBtn.addEventListener('click', () => {
      if (!isMuted) playPirateSound('coin', 0.4);
      showToast('🏴‍️ Opening Google Form… Welcome aboard, Pirate!', 'success');
    });
  }
  
  if (orderForm) {
    orderForm.addEventListener('submit', () => {
      if (!isMuted) {
        playPirateSound('chest', 0.6);
        setTimeout(() => playPirateSound('laugh', 0.4), 500);
      }
    });
  }
}

// =============================================
// COMMUNITY SECTION
// =============================================
function initCommunitySectionSounds() {
  if (!communitySection) return;
  
  const communityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !communitySectionVisible) {
        communitySectionVisible = true;
        if (!isMuted) {
          playPirateSound('ominous', 0.2, true);
          setTimeout(() => { if (!isMuted) playPirateSound('laugh', 0.5); }, 1500);
        }
      } else if (!entry.isIntersecting && communitySectionVisible) {
        communitySectionVisible = false;
        stopPirateSound('ominous');
      }
    });
  }, { threshold: 0.3 });
  
  communityObserver.observe(communitySection);
  setupAllSoundTriggers();
}

// =============================================
// DAY/NIGHT MODE
// =============================================
function initDayNightMode() {
  if (!communitySection) return;
  
  const toggle = document.createElement('button');
  toggle.className = 'day-night-toggle sun-mode';
  toggle.setAttribute('aria-label', 'Toggle day/night mode');
  toggle.title = 'Switch to Night Mode';
  
  toggle.addEventListener('click', () => {
    const isNight = communitySection.classList.toggle('night-mode');
    toggle.classList.toggle('moon-mode', isNight);
    toggle.classList.toggle('sun-mode', !isNight);
    toggle.title = isNight ? 'Switch to Day Mode' : 'Switch to Night Mode';
    
    if (!isMuted) playPirateSound('thunder', 0.4);
    localStorage.setItem('brownieverse-night-mode', isNight);
    
    if (isNight) {
      createStars();
      createMoon();
      createNightClouds();
    }
  });
  
  communitySection.insertBefore(toggle, communitySection.firstChild);
  
  const savedMode = localStorage.getItem('brownieverse-night-mode');
  if (savedMode === 'true') {
    communitySection.classList.add('night-mode');
    toggle.classList.add('moon-mode');
    toggle.classList.remove('sun-mode');
    createStars();
    createMoon();
    createNightClouds();
  }
}

function createStars() {
  if (!communitySection) return;
  const skyElements = communitySection.querySelector('.night-sky-elements');
  if (!skyElements || skyElements.querySelectorAll('.star').length > 0) return;
  
  for (let i = 0; i < 20; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = Math.random() * 40 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.width = (Math.random() * 3 + 2) + 'px';
    star.style.height = star.style.width;
    skyElements.appendChild(star);
  }
}

function createMoon() {
  if (!communitySection) return;
  const skyElements = communitySection.querySelector('.night-sky-elements');
  if (!skyElements || skyElements.querySelector('.moon')) return;
  
  const moon = document.createElement('div');
  moon.className = 'moon';
  skyElements.appendChild(moon);
}

function createNightClouds() {
  if (!communitySection) return;
  const skyElements = communitySection.querySelector('.night-sky-elements');
  if (!skyElements || skyElements.querySelectorAll('.night-cloud').length > 0) return;
  
  const cloud1 = document.createElement('div');
  cloud1.className = 'night-cloud night-cloud-1';
  skyElements.appendChild(cloud1);
  
  const cloud2 = document.createElement('div');
  cloud2.className = 'night-cloud night-cloud-2';
  skyElements.appendChild(cloud2);
}

// =============================================
// PAGE LOADER & NAV
// =============================================
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('page-loader')?.classList.add('hidden'), 1400);
});

const navScrollHandler = () => {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
    document.getElementById('navOrderBtn').style.display = 'inline-flex';
  } else {
    navbar?.classList.remove('scrolled');
    document.getElementById('navOrderBtn').style.display = 'none';
  }
};
window.addEventListener('scroll', navScrollHandler, { passive: true });

const sections = ['hero', 'products', 'packs', 'schedule', 'about', 'order', 'community'];
const navLinks = document.querySelectorAll('.nav-link');

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

hamburger?.addEventListener('click', () => {
  const isOpen = mobileNav?.classList.toggle('open');
  hamburger?.classList.toggle('open', isOpen);
  hamburger?.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav?.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
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
// RENDER FUNCTIONS
// =============================================
function renderProducts() {
  if (!productsGrid) return;
  
  productsGrid.innerHTML = PRODUCTS.map((p, idx) => `
    <article class="product-card reveal reveal-delay-${(idx % 4) + 1}" data-product-id="${p.id}" role="article" aria-label="${p.name}">
      <div class="product-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='images/placeholder.jpg'; this.onerror=null;" />
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-category">Brownie Bites</div>
        <h3 class="product-name">${p.emoji} ${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <div class="product-rating" aria-label="${p.rating} stars, ${p.reviews} reviews">
            ${'★'.repeat(Math.floor(p.rating))}<span>(${p.reviews})</span>
          </div>
          <a href="#packs" class="btn btn-ghost" style="padding:0.5rem 1.2rem;font-size:0.68rem;">See Packs</a>
        </div>
      </div>
    </article>
  `).join('');
  observeReveal();
}

function renderPacks() {
  if (!packsGrid) return;
  
  packsGrid.innerHTML = PACKS.map((pack, idx) => `
    <div class="pack-card${pack.popular ? ' popular' : ''} reveal reveal-delay-${idx + 1}">
      ${pack.popular ? '<div class="pack-popular-ribbon">Most Popular</div>' : ''}
      ${pack.badge ? `<div class="pack-badge">${pack.badge}</div>` : ''}
      
      <!-- Pack Image - CIRCULAR FRAME -->
      <div class="pack-img pack-img-circle">
        <img src="${pack.image}" alt="${pack.name}" loading="lazy" 
             onerror="this.src='images/placeholder-pack.jpg'; this.onerror=null;" />
      </div>
      
      <div class="pack-name">${pack.emoji ? pack.emoji + ' ' : ''}${pack.name}</div>
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

function renderOrderProductSelector() {
  if (!orderProductSelector) return;
  
  orderProductSelector.innerHTML = PACKS.map(pack => `
    <div class="product-selector-item">
      <div class="psi-info">
        <input type="checkbox" class="psi-check" id="psi-${pack.id}" data-pack-id="${pack.id}" onchange="toggleOrderPack('${pack.id}', this.checked)" />
        <label for="psi-${pack.id}" style="cursor:pointer">
          <span class="psi-name">${pack.emoji ? pack.emoji + ' ' : ''}${pack.name}</span>
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
  if (!summaryBox) return;
  
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

  summaryBox.innerHTML = `${rows}<div class="os-row os-total"><span>Total</span><span>${total} DH</span></div>`;
}

window.preSelectPack = function(packId) {
  PACKS.forEach(p => {
    const cb = document.getElementById(`psi-${p.id}`);
    if (cb) cb.checked = false;
    document.getElementById(`psi-qty-${p.id}`)?.classList.remove('active');
    delete orderSelections[p.id];
  });
  orderSelections[packId] = 1;
  const cb = document.getElementById(`psi-${packId}`);
  if (cb) cb.checked = true;
  document.getElementById(`psi-qty-${packId}`)?.classList.add('active');
  updateOrderSummary();
};

// =============================================
// CART
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
    cartItems.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty.<br />Add some brownie bites!</p></div>`;
    cartFooter.style.display = 'none';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img" style="background:var(--cream-dark);display:flex;align-items:center;justify-content:center;font-size:2rem;">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price} DH</div>
          <div class="cart-item-controls">
            <button class="ci-qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
            <span class="ci-qty">${item.qty}</span>
            <button class="ci-qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
            <button class="ci-remove" onclick="removeFromCart('${item.id}')"><i class="fas fa-trash"></i> Remove</button>
          </div>
        </div>
        <div class="cart-item-total">${item.price * item.qty} DH</div>
      </div>
    `).join('');
    cartFooter.style.display = 'block';
  }
}

function openCart() {
  cartDrawer?.classList.add('open');
  cartOverlay?.classList.add('open');
  cartDrawer?.setAttribute('aria-hidden', 'false');
  cartOverlay?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer?.classList.remove('open');
  cartOverlay?.classList.remove('open');
  cartDrawer?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

cartToggle?.addEventListener('click', openCart);
cartClose?.addEventListener('click', closeCart);
cartContinue?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);
cartCheckout?.addEventListener('click', () => { closeCart(); document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' }); });

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
// ORDER FORM → GOOGLE SHEETS + WHATSAPP
// =============================================
orderForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateOrderForm()) return;

  const name = document.getElementById('orderName')?.value.trim();
  const phone = document.getElementById('orderPhone')?.value.trim();
  const address = document.getElementById('orderAddress')?.value.trim();
  const notes = document.getElementById('orderNotes')?.value.trim();
  
  // Get selected packs
  const selectedPacks = Object.entries(orderSelections).map(([pid, qty]) => {
    const pack = PACKS.find(p => p.id === pid);
    return {
      name: pack?.name || pid,
      price: pack?.price || 0,
      quantity: qty,
      total: (pack?.price || 0) * qty
    };
  });
  
  const total = selectedPacks.reduce((sum, item) => sum + item.total, 0);
  
  // Format order items for display
  const orderItems = selectedPacks.map(item => 
    `• ${item.name} ×${item.quantity} = ${item.total} DH`
  ).join('\n');
  
  // Prepare data for Google Sheets
  const sheetData = {
    name,
    phone,
    address,
    pack: selectedPacks.map(p => p.name).join(', '),
    quantity: selectedPacks.reduce((sum, p) => sum + p.quantity, 0),
    total,
    notes,
    timestamp: new Date().toISOString()
  };
  
  // ✅ SEND TO GOOGLE SHEETS (Fixed: text/plain + no mode: 'no-cors')
  fetch(SHEETS_WEBHOOK_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify(sheetData)
  })
  .then(response => {
    console.log('✅ Google Sheets logged order');
  })
  .catch(err => {
    console.log('⚠️ Sheets error (non-critical - WhatsApp still works):', err);
  });
  
  // Prepare WhatsApp message
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

  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  // Show loading state
  const submitBtn = document.getElementById('orderSubmitBtn');
  const originalBtnText = submitBtn.innerHTML;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Order...';

  // Open WhatsApp after short delay
  setTimeout(() => {
    window.open(whatsappURL, '_blank');
    showToast('📱 Order sent to WhatsApp! Please confirm with us.', 'success');
    
    // Reset form
    setTimeout(() => {
      orderForm?.reset();
      orderSelections = {};
      renderOrderProductSelector();
      updateOrderSummary();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }, 1500);
  }, 800);
});

function validateOrderForm() {
  const name = document.getElementById('orderName')?.value.trim();
  const phone = document.getElementById('orderPhone')?.value.trim();
  const addr = document.getElementById('orderAddress')?.value.trim();
  const hasProducts = Object.keys(orderSelections).length > 0;

  if (!name) { showToast('Please enter your full name.', 'error'); document.getElementById('orderName')?.focus(); return false; }
  if (!phone) { showToast('Please enter your phone number.', 'error'); document.getElementById('orderPhone')?.focus(); return false; }
  if (!addr) { showToast('Please enter your delivery address.', 'error'); document.getElementById('orderAddress')?.focus(); return false; }
  if (!hasProducts) { showToast('Please select at least one pack.', 'error'); return false; }
  return true;
}

// =============================================
// TOAST & UTILS
// =============================================
function showToast(message, type = '') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span>${icon}</span> ${message}`;
  toastContainer?.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-out 0.4s var(--ease-in) forwards';
    toast.addEventListener('animationend', () => toast.remove());
  }, 3500);
}

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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
    document.querySelectorAll('.success-overlay').forEach(o => o.classList.remove('active'));
    document.body.style.overflow = '';
  }
});

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

document.querySelectorAll('.flavor-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// =============================================
// ANIMATIONS
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

window.addEventListener('scroll', () => {
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && window.innerWidth > 900) {
    const scrollY = window.scrollY;
    heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
  }
}, { passive: true });

function highlightScheduleDays() {
  if (!document.getElementById('schedule')) return;
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = days[new Date().getDay()];
  
  document.querySelectorAll('.schedule-days .day').forEach(dayEl => {
    const dayText = dayEl.textContent.toLowerCase();
    if (dayText === today.substring(0, 3)) {
      dayEl.style.boxShadow = '0 0 0 2px var(--brown-deep), 0 4px 12px rgba(59,26,10,0.2)';
      dayEl.style.transform = 'scale(1.05)';
      dayEl.style.fontWeight = '800';
    }
  });
}

// =============================================
// TREASURE MAP (Mobile Only)
// =============================================
function initTreasureMap() {
  if (!communitySection) return;
  
  // Only create treasure map on mobile (CSS hides it on desktop)
  if (window.innerWidth > 900) return;
  
  const mapContainer = document.createElement('div');
  mapContainer.className = 'treasure-map-container reveal reveal-delay-3';
  
  mapContainer.innerHTML = `
    <div class="treasure-map-header">
      <h3>🗺️ Treasure Map of Perks</h3>
      <p>Click the X marks to discover hidden pirate treasures!</p>
    </div>
    <div class="treasure-map" id="treasureMap">
      <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;">
        <path class="map-path" d="M 120 80 Q 200 120 280 100 T 400 180" />
        <path class="map-path" d="M 120 80 Q 100 180 150 280" style="animation-delay:1.5s"/>
        <path class="map-path" d="M 280 100 Q 320 200 300 250" style="animation-delay:2s"/>
      </svg>
      <div class="treasure-marker marker-1" data-perk="0" title="Click to reveal!">💰</div><div class="x-spot" style="top:17%;left:22%;">X</div>
      <div class="treasure-marker marker-2" data-perk="1" title="Click to reveal!">💎</div><div class="x-spot" style="top:27%;right:27%;">X</div>
      <div class="treasure-marker marker-3" data-perk="2" title="Click to reveal!">🎁</div><div class="x-spot" style="top:47%;left:17%;">X</div>
      <div class="treasure-marker marker-4" data-perk="3" title="Click to reveal!">🏴‍️</div><div class="x-spot" style="top:57%;right:22%;">X</div>
      <div class="treasure-marker marker-5" data-perk="4" title="Click to reveal!">⚓</div><div class="x-spot" style="top:72%;left:32%;">X</div>
      <div class="perk-popup" id="perkPopup0"><div class="perk-popup-icon">💰</div><div class="perk-popup-title">Exclusive Discounts</div><div class="perk-popup-desc">Get 20% off your first order as a crew member!</div></div>
      <div class="perk-popup" id="perkPopup1"><div class="perk-popup-icon">💎</div><div class="perk-popup-title">Limited Editions</div><div class="perk-popup-desc">First access to rare & seasonal flavors before anyone else!</div></div>
      <div class="perk-popup" id="perkPopup2"><div class="perk-popup-icon">🎁</div><div class="perk-popup-title">Birthday Treasure</div><div class="perk-popup-desc">Free brownie bites on your birthday! Arrr, happy birthday!</div></div>
      <div class="perk-popup" id="perkPopup3"><div class="perk-popup-icon">🏴‍️</div><div class="perk-popup-title">Pirate Events</div><div class="perk-popup-desc">Invite-only tastings & treasure hunt parties in Salé!</div></div>
      <div class="perk-popup" id="perkPopup4"><div class="perk-popup-icon">⚓</div><div class="perk-popup-title">Captain's Direct Line</div><div class="perk-popup-desc">Priority WhatsApp support from the BrownieVerse crew!</div></div>
      <div class="map-compass-rose">🧭</div><div class="map-scale">Scale: 1 inch = 1 delicious bite</div>
    </div>
    <div class="map-instructions"><i class="fas fa-mouse-pointer"></i> Click on the bouncing markers to reveal hidden perks!</div>
  `;
  
  const formCard = communitySection.querySelector('#communityFormCard');
  
  if (formCard && formCard.parentElement === communitySection.querySelector('.community-inner')) {
    communitySection.querySelector('.community-inner').insertBefore(mapContainer, formCard);
  } else {
    const inner = communitySection.querySelector('.community-inner');
    if (inner) inner.appendChild(mapContainer);
  }
  
  setTimeout(() => {
    document.querySelectorAll('.treasure-marker').forEach(marker => {
      marker.addEventListener('click', (e) => {
        const perkIndex = marker.getAttribute('data-perk');
        revealPerk(perkIndex, marker);
        if (!isMuted) playPirateSound('coin', 0.5);
      });
    });
  }, 100);
}

function revealPerk(index, marker) {
  document.querySelectorAll('.perk-popup').forEach(popup => popup.classList.remove('visible'));
  const popup = document.getElementById(`perkPopup${index}`);
  if (popup) {
    const markerRect = marker.getBoundingClientRect();
    const mapRect = marker.closest('.treasure-map')?.getBoundingClientRect();
    if (mapRect) {
      popup.style.left = (markerRect.left - mapRect.left - 50) + 'px';
      popup.style.top = (markerRect.top - mapRect.top - 120) + 'px';
    }
    popup.classList.add('visible');
    marker.classList.add('revealed');
    createTreasureChest(marker);
    setTimeout(() => popup.classList.remove('visible'), 5000);
  }
}

function createTreasureChest(marker) {
  const chest = document.createElement('div');
  chest.className = 'treasure-chest-open';
  chest.textContent = '📦';
  chest.style.left = marker.style.left || '50%';
  chest.style.top = marker.style.top || '50%';
  marker.parentElement?.appendChild(chest);
  setTimeout(() => chest.remove(), 2000);
}

// =============================================
// PIRATE COUNT
// =============================================
function updatePirateCount() {
  const el = document.getElementById('pirateCount');
  if (el && !el.dataset.static && !el.textContent.includes('200+')) {
    el.textContent = 'Join 200+ Pirates already aboard';
  }
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initPirateSounds();
  createSoundToggle();
  
  renderProducts();
  renderPacks();
  renderOrderProductSelector();
  updateCartUI();
  updatePirateCount();
  observeReveal();
  
  highlightScheduleDays();
  const scheduleObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      highlightScheduleDays();
      scheduleObserver.disconnect();
    }
  }, { threshold: 0.3 });
  const scheduleSection = document.getElementById('schedule');
  if (scheduleSection) scheduleObserver.observe(scheduleSection);
  
  initDayNightMode();
  initTreasureMap();
  initCommunitySectionSounds();
});

// Fallback for already-loaded pages
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initPirateSounds();
  createSoundToggle();
  renderProducts();
  renderPacks();
  renderOrderProductSelector();
  updateCartUI();
  updatePirateCount();
  observeReveal();
  highlightScheduleDays();
  initDayNightMode();
  initTreasureMap();
  initCommunitySectionSounds();
}

// Global functions
window.removeFromCart = removeFromCart;
window.changeQty = changeQty;
window.toggleOrderPack = toggleOrderPack;
window.changeOrderQty = changeOrderQty;
window.preSelectPack = preSelectPack;
window.addPackToCart = addPackToCart;
window.closeSuccess = closeSuccess;
