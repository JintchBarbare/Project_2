const BASE_URL = 'https://restaurant.stepprojects.ge';

let activeFilters = {
  categoryId: '',
  spiciness: '',
  nuts: false,
  vegeterian: false
};

async function loadCategories() {
  try {
    const res = await fetch(`${BASE_URL}/api/Categories/GetAll`);
    if (!res.ok) return;
    const categories = await res.json();

    const container = document.querySelector('.categories-bar');
    if (!container) return;

    // ვასუფთავებთ სტატიკურ ღილაკებს და ვამატებთ "ყველას"
    container.innerHTML = `<button class="category-btn active" data-id="">ყველა</button>`;

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.dataset.id = cat.id;
      btn.textContent = cat.name;
      container.appendChild(btn);
    });

    setupCategoryListeners();
  } catch (err) {
    console.error('კატეგორიების ჩატვირთვა ვერ მოხერხდა:', err);
  }
}

async function fetchProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;
  
  container.innerHTML = '<p class="loading">პროდუქტები იტვირთება...</p>';

  try {
    const queryParams = new URLSearchParams();

    if (activeFilters.categoryId) queryParams.append('categoryId', activeFilters.categoryId);
    if (activeFilters.spiciness !== '' && activeFilters.spiciness !== null) {
      queryParams.append('spiciness', activeFilters.spiciness);
    }
    if (activeFilters.nuts) queryParams.append('nuts', 'true');
    if (activeFilters.vegeterian) queryParams.append('vegeterian', 'true');

    const hasFilters = Array.from(queryParams.keys()).length > 0;
    const endpoint = hasFilters 
      ? `/api/Products/GetFiltered?${queryParams.toString()}` 
      : '/api/Products/GetAll';

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Accept': 'text/json' }
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);

    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error('შეცდომა:', err);
    container.innerHTML = '<p class="loading" style="color: #ef4444;">მონაცემების ჩატვირთვა ვერ მოხერხდა.</p>';
  }
}

function renderProducts(products) {
  const container = document.getElementById('products-container');
  if (!container) return;
  
  container.innerHTML = '';

  if (!products || products.length === 0) {
    container.innerHTML = '<p class="loading">პროდუქტები ვერ მოიძებნა.</p>';
    return;
  }

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <div class="card-img-wrapper" onclick="goToDetails(${p.id})" style="cursor: pointer;">
        <img src="${p.image || 'https://via.placeholder.com/200'}" alt="${p.name}">
      </div>
      <div>
        <div class="card-header" onclick="goToDetails(${p.id})" style="cursor: pointer;">
          <span class="product-title">${p.name}</span>
          <span class="product-price">${Number(p.price).toFixed(2)} ₾</span>
        </div>
        <div class="tags-bar">
          <span class="tag-badge">🌶️ ${p.spiciness ?? 0}/4</span>
          <span class="tag-badge">🥜 ${p.nuts ? 'კი' : 'არა'}</span>
          ${p.vegeterian ? '<span class="tag-badge">🌱 ვეგეტარიანული</span>' : ''}
        </div>
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${p.id})">კალათაში დამატება</button>
    `;

    container.appendChild(card);
  });
}

function setupCategoryListeners() {
  const buttons = document.querySelectorAll('.category-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.categoryId = btn.dataset.id || '';
      fetchProducts();
    });
  });
}

function goToDetails(productId) {
  window.location.href = `product-details.html?id=${productId}`;
}

async function addToCart(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/Products/GetAll`);
    const products = await res.json();
    const product = products.find(p => p.id == id);

    if (!product) {
      alert('პროდუქტი ვერ მოიძებნა!');
      return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex(item => item.id == id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.name,
        price: Number(product.price) || 0,
        img: product.image || '',
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`„${product.name}“ დაემატა კალათაში!`);

    if (typeof updateCartBadge === 'function') {
      updateCartBadge();
    }
  } catch (err) {
    console.error('კალათაში დამატების შეცდომა:', err);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  fetchProducts();

  const rangeInput = document.getElementById('spiciness-range');
  const spicyVal = document.getElementById('spiciness-value');

  if (rangeInput && spicyVal) {
    rangeInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val === '-1') {
        spicyVal.textContent = 'ყველა';
        activeFilters.spiciness = '';
      } else {
        spicyVal.textContent = val;
        activeFilters.spiciness = val;
      }
      fetchProducts();
    });
  }


  const nutsCb = document.getElementById('nuts-checkbox');
  const vegCb = document.getElementById('veg-checkbox');

  if (nutsCb) {
    nutsCb.addEventListener('change', (e) => {
      activeFilters.nuts = e.target.checked;
      fetchProducts();
    });
  }

  if (vegCb) {
    vegCb.addEventListener('change', (e) => {
      activeFilters.vegeterian = e.target.checked;
      fetchProducts();
    });
  }

  // გასუფთავების ღილაკი
  const resetBtn = document.getElementById('reset-filters-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeFilters = { categoryId: '', spiciness: '', nuts: false, vegeterian: false };
      
      if (rangeInput) rangeInput.value = '-1';
      if (spicyVal) spicyVal.textContent = 'ყველა';
      if (nutsCb) nutsCb.checked = false;
      if (vegCb) vegCb.checked = false;

      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.category-btn[data-id=""]')?.classList.add('active');

      fetchProducts();
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      navMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }
});