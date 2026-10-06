const BASE_URL = 'https://restaurant.stepprojects.ge';

let currentPrice = 0;
let currentQuantity = 1;

function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

async function fetchProductDetails() {
  const productId = getProductIdFromUrl();
  const container = document.getElementById('details-container');

  if (!productId) {
    container.innerHTML = '<p class="loading">პროდუქტი ვერ მოიძებნა.</p>';
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/Products/GetAll`);

    if (!response.ok) {
      throw new Error(`HTTP შეცდომა! სტატუსი: ${response.status}`);
    }

    const allProducts = await response.json();
    const product = allProducts.find(p => p.id == productId);

    if (!product) {
      container.innerHTML = '<p class="loading">ასეთი ID-ით პროდუქტი ვერ მოიძებნა.</p>';
      return;
    }

    renderProductDetails(product);
  } catch (error) {
    console.error('დეტალების წამოღების შეცდომა:', error);
    container.innerHTML = '<p class="loading">მონაცემების ჩატვირთვა ვერ მოხერხდა.</p>';
  }
}

function renderProductDetails(product) {
  const container = document.getElementById('details-container');
  currentPrice = Number(product.price) || 0;
  currentQuantity = 1;

  container.innerHTML = `
    <div class="product-details-wrapper">
      <div class="details-image-box">
        <img src="${product.image || 'https://via.placeholder.com/400'}" alt="${product.name}">
      </div>

      <div class="details-info-box">
        <h1 class="details-title">${product.name}</h1>
        <div class="details-price-single">${currentPrice.toFixed(2)} ₾</div>

        <p class="details-description">
          ${product.description || 'გემრიელი და ახლად მომზადებული კერძი ჩვენი შეფ-მზარეულისგან.'}
        </p>

        <div class="details-tags">
          <span class="tag-badge spicy-badge">🌶️ სიცხარე: ${product.spiciness ?? 0}/4</span>
          <span class="tag-badge nut-badge">🥜 ნიგოზი: ${product.nuts ? 'კი' : 'არა'}</span>
          ${product.vegeterian ? '<span class="tag-badge veg-badge">🌱 ვეგეტარიანული</span>' : ''}
        </div>

        <div class="quantity-section">
          <label class="quantity-label">რაოდენობა</label>
          <div class="quantity-control">
            <button type="button" class="qty-btn" onclick="updateQuantity(-1)">-</button>
            <span id="qty-value" class="qty-number">1</span>
            <button type="button" class="qty-btn" onclick="updateQuantity(1)">+</button>
          </div>
        </div>

        <div class="total-price-section">
          <span class="total-label">ჯამი</span>
          <div class="total-amount"><span id="total-price-value">${currentPrice.toFixed(2)}</span> ₾</div>
        </div>

        <button class="add-to-cart-submit-btn" onclick="addToCart(${product.id})">
          კალათაში დამატება
        </button>
      </div>
    </div>
  `;
}

function updateQuantity(change) {
  if (currentQuantity + change < 1) return;
  
  currentQuantity += change;
  document.getElementById('qty-value').textContent = currentQuantity;
  
  const totalPrice = currentPrice * currentQuantity;
  document.getElementById('total-price-value').textContent = totalPrice.toFixed(2);
}

async function addToCart(productId) {
  try {
    const response = await fetch(`${BASE_URL}/api/Products/GetAll`);
    const allProducts = await response.json();
    const product = allProducts.find(p => p.id == productId);

    if (!product) {
      alert('პროდუქტი ვერ მოიძებნა!');
      return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex(item => item.id == productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += currentQuantity;
    } else {
      cart.push({
        id: product.id,
        title: product.name,
        price: Number(product.price) || 0,
        img: product.image || '',
        quantity: currentQuantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`„${product.name}“ (${currentQuantity} ცალი) დაემატა კალათაში!`);

    if (typeof updateCartBadge === 'function') {
      updateCartBadge();
    }
  } catch (error) {
    console.error('კალათაში დამატების შეცდომა:', error);
  }
}

document.addEventListener('DOMContentLoaded', fetchProductDetails);