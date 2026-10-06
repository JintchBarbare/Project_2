document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = JSON.parse(localStorage.getItem('logged_in_user'));
  if (!loggedInUser) {
    window.location.href = 'auth.html';
    return;
  }

  loadUserData(loggedInUser);
  renderOrders();
  renderAddresses();

  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }

  const profileForm = document.getElementById('profile-form') || document.querySelector('.profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', saveProfileInfo);
  }
});

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  const targetBtn = document.querySelector(`.tab-btn[onclick="switchTab('${tabName}')"]`);
  const targetContent = document.getElementById(`tab-${tabName}`);

  if (targetBtn) targetBtn.classList.add('active');
  if (targetContent) targetContent.classList.add('active');
}

function loadUserData(user) {
  if (!user) return;

  const firstNameInput = document.getElementById('prof-firstname');
  const lastNameInput = document.getElementById('prof-lastname');
  const emailInput = document.getElementById('prof-email');
  const phoneInput = document.getElementById('prof-phone');

  if (firstNameInput) firstNameInput.value = user.firstName || '';
  if (lastNameInput) lastNameInput.value = user.lastName || '';
  if (emailInput) emailInput.value = user.email || '';
  if (phoneInput) phoneInput.value = user.phone || '';

  const nameElem = document.getElementById('profile-user-name');
  const emailElem = document.getElementById('profile-user-email');

  if (nameElem) nameElem.textContent = `${user.firstName || ''} ${user.lastName || ''}`;
  if (emailElem) emailElem.textContent = user.email || '';
}

function saveProfileInfo(event) {
  if (event) event.preventDefault();

  let currentUser = JSON.parse(localStorage.getItem('logged_in_user'));
  if (!currentUser) return;

  const oldEmail = currentUser.email; 

  const updatedUser = {
    ...currentUser,
    firstName: document.getElementById('prof-firstname')?.value.trim() || '',
    lastName: document.getElementById('prof-lastname')?.value.trim() || '',
    email: document.getElementById('prof-email')?.value.trim().toLowerCase() || '',
    phone: document.getElementById('prof-phone')?.value.trim() || ''
  };

  localStorage.setItem('logged_in_user', JSON.stringify(updatedUser));

  let users = JSON.parse(localStorage.getItem('registered_users')) || [];
  const index = users.findIndex(u => u.email === oldEmail);
  
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem('registered_users', JSON.stringify(users));
  }

  loadUserData(updatedUser);
  alert('პროფილის მონაცემები წარმატებით განახლდა!');
}

function renderOrders() {
  const ordersContainer = document.getElementById('orders-list');
  if (!ordersContainer) return;

  const orders = JSON.parse(localStorage.getItem('orders_history')) || [];

  if (orders.length === 0) {
    ordersContainer.innerHTML = '<p style="color: #a0aec0; text-align: center; padding: 20px;">თქვენ ჯერ არ გაქვთ განხორციელებული შეკვეთები.</p>';
    return;
  }

  ordersContainer.innerHTML = '';
  orders.forEach(order => {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <div class="order-header">
        <div>
          <span class="order-id">#${order.id}</span>
          <span class="order-date"> (${order.date})</span>
        </div>
        <span class="order-status">${order.status}</span>
      </div>
      <div class="order-details-info">
        <span>პროდუქტები: ${order.items}</span>
        <strong>${order.total}</strong>
      </div>
    `;
    ordersContainer.appendChild(card);
  });
}

function renderAddresses() {
  const container = document.getElementById('addresses-list');
  if (!container) return;

  const addresses = JSON.parse(localStorage.getItem('user_addresses')) || [];

  if (addresses.length === 0) {
    container.innerHTML = '<p style="color: #a0aec0; text-align: center; grid-column: 1/-1;">შენახული მისამართები არ არის.</p>';
    return;
  }

  container.innerHTML = '';
  addresses.forEach(item => {
    const card = document.createElement('div');
    card.className = 'address-card';
    card.innerHTML = `
      <h3 class="address-title"><i class="fa-solid fa-location-dot"></i> ${item.title}</h3>
      <p class="address-text">${item.address}</p>
    `;
    container.appendChild(card);
  });
}

function addNewAddress() {
  const title = prompt('შეიყვანეთ მისამართის დასახელება (მაგ: სახლი, ოფისი):');
  if (!title) return;

  const address = prompt('შეიყვანეთ სრული მისამართი:');
  if (!address) return;

  let addresses = JSON.parse(localStorage.getItem('user_addresses')) || [];
  addresses.push({ title, address });
  localStorage.setItem('user_addresses', JSON.stringify(addresses));

  renderAddresses();
}

function logoutUser() {
  if (confirm('ნამდვილად გსურთ სისტემიდან გამოსვლა?')) {
    localStorage.removeItem('logged_in_user');
    window.location.href = 'auth.html';
  }
}