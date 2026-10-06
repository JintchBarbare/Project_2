document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartBadge();
});

function renderCart() {
  const cartContainer = document.getElementById('cart-items-container');
  const totalPriceElement = document.getElementById('cart-total-price');
  const subtotalPriceElement = document.getElementById('cart-subtotal-price');
  const clearCartBtn = document.getElementById('clear-cart-btn');

  if (!cartContainer) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-wrapper">
        <div class="empty-cart-icon"><i class="fa-solid fa-bag-shopping"></i></div>
        <h3>თქვენი კალათა ცარიელია</h3>
        <p>დაამატეთ გემრიელი კერძები მენიუდან</p>
        <a href="shop.html" class="btn-shop-now">მენიუს დათვალიერება</a>
      </div>
    `;
    if (totalPriceElement) totalPriceElement.textContent = '0.00';
    if (subtotalPriceElement) subtotalPriceElement.textContent = '0.00';
    if (clearCartBtn) clearCartBtn.style.display = 'none';
    return;
  }

  if (clearCartBtn) clearCartBtn.style.display = 'inline-flex';
  cartContainer.innerHTML = '';
  let grandTotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    grandTotal += itemTotal;

    const itemCard = document.createElement('div');
    itemCard.className = 'cart-item-card';

    itemCard.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.img || 'https://via.placeholder.com/100'}" alt="${item.title}">
      </div>
      <div class="cart-item-details">
        <h3 class="cart-item-title">${item.title}</h3>
        <p class="cart-item-price">თითოეული: ${item.price.toFixed(2)} ₾</p>
      </div>
      <div class="cart-item-qty-control">
        <button class="qty-btn" onclick="changeCartQuantity(${index}, -1)" aria-label="შემცირება">-</button>
        <span class="qty-val">${item.quantity}</span>
        <button class="qty-btn" onclick="changeCartQuantity(${index}, 1)" aria-label="გაზრდა">+</button>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-subtotal">${itemTotal.toFixed(2)} ₾</span>
        <button class="remove-btn" onclick="removeFromCart(${index})" title="წაშლა">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `;

    cartContainer.appendChild(itemCard);
  });

  if (totalPriceElement) totalPriceElement.textContent = grandTotal.toFixed(2);
  if (subtotalPriceElement) subtotalPriceElement.textContent = grandTotal.toFixed(2);
}

function changeCartQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartBadge();
  }
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartBadge();
}

function clearCart() {
  if (confirm('ნამდვილად გსურთ კალათის გასუფთავება?')) {
    localStorage.removeItem('cart');
    renderCart();
    updateCartBadge();
  }
}

function updateCartBadge() {
  const badgeElements = document.querySelectorAll('.cart-badge, #cart-count');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  badgeElements.forEach(badge => {
    badge.textContent = totalItemsCount;
  });
}

function handleCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('თქვენი კალათა ცარიელია!');
    return;
  }
  openCheckoutModal();
}

function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const modalTotal = document.getElementById('modal-total-price');
  const totalPriceElement = document.getElementById('cart-total-price');

  if (modalTotal && totalPriceElement) {
    modalTotal.textContent = totalPriceElement.textContent + ' ₾';
  }

  if (modal) {
    modal.classList.add('active');
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}


function submitOrder(event) {
  event.preventDefault();

  const name = document.getElementById('user-name').value;
  const phone = document.getElementById('user-phone').value;
  const address = document.getElementById('user-address').value;

  if (!name || !phone || !address) {
    alert('გთხოვთ შეავსოთ ყველა სავალდებულო ველი!');
    return;
  }

  alert(`გმადლობთ, ${name}! თქვენი შეკვეთა წარმატებით გაფორმდა.\nკურიერი დაგიკავშირდებათ ნომერზე: ${phone}`);

  // გასუფთავება
  localStorage.removeItem('cart');
  closeCheckoutModal();
  renderCart();
  updateCartBadge();
  document.getElementById('checkout-form').reset();
}


document.addEventListener('DOMContentLoaded', () => {
  const authModal = document.getElementById('auth-modal');
  const closeBtn = document.getElementById('auth-close-btn');
  const profileIcons = document.querySelectorAll('.icon-link[aria-label="პროფილი"], #auth-trigger-btn');

  profileIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        window.location.href = 'profile.html';
      } else {
        authModal.classList.add('active');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      authModal.classList.remove('active');
    });
  }


  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        authModal.classList.remove('active');
      }
    });
  }
});

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  
  // უბრალო სიმულაცია ავტორიზაციისთვის
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', email);
  
  alert('წარმატებით გაიარეთ ავტორიზაცია!');
  document.getElementById('auth-modal').classList.remove('active');
  
  window.location.href = 'profile.html';
}

function handleRegisterRedirect() {
  alert('შემდეგ ნაბიჯზე გადავდივართ რეგისტრაციის ფორმის შესავსებად!');
}