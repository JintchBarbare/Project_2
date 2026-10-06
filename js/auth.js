function handleProfileNavigation(event) {
  if (event) event.preventDefault();
  
  const loggedInUser = localStorage.getItem('logged_in_user');
  if (loggedInUser) {
    window.location.href = './profile.html';
  } else {
    window.location.href = './auth.html';
  }
}

function handleRegister(event) {
  if (event) event.preventDefault();

  const firstName = document.getElementById('reg-firstname')?.value.trim();
  const lastName = document.getElementById('reg-lastname')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim().toLowerCase();
  const password = document.getElementById('reg-password')?.value;
  const phone = document.getElementById('reg-phone')?.value.trim() || '';
  const errorElement = document.getElementById('register-error');

  if (errorElement) errorElement.textContent = '';

  if (!firstName || !lastName || !email || !password) {
    if (errorElement) errorElement.textContent = 'გთხოვთ შეავსოთ ყველა აუცილებელი ველი!';
    return;
  }

  let users = JSON.parse(localStorage.getItem('registered_users')) || [];

  if (users.some(u => u.email === email)) {
    if (errorElement) errorElement.textContent = 'ამ ელფოსტით მომხმარებელი უკვე არსებობს!';
    return;
  }

  const newUser = { firstName, lastName, email, password, phone };
  users.push(newUser);
  localStorage.setItem('registered_users', JSON.stringify(users));

  localStorage.setItem('logged_in_user', JSON.stringify(newUser));
  window.location.href = './profile.html';
}

function handleLogin(event) {
  if (event) event.preventDefault();

  const email = document.getElementById('login-email')?.value.trim().toLowerCase();
  const password = document.getElementById('login-password')?.value;
  const errorElement = document.getElementById('login-error');

  if (errorElement) errorElement.textContent = '';

  if (!email || !password) {
    if (errorElement) errorElement.textContent = 'გთხოვთ შეიყვანოთ ელფოსტა და პაროლი!';
    return;
  }

  let users = JSON.parse(localStorage.getItem('registered_users')) || [];

  const foundUser = users.find(u => u.email === email && u.password === password);

  if (!foundUser) {
    if (errorElement) errorElement.textContent = 'ელფოსტა ან პაროლი არასწორია!';
    return;
  }

  localStorage.setItem('logged_in_user', JSON.stringify(foundUser));
  window.location.href = './profile.html';
}

function showRegisterView(isBack = false) {
  const loginView = document.getElementById('login-view');
  const registerView = document.getElementById('register-view');
  const regError = document.getElementById('register-error');

  if (loginView) loginView.style.display = 'none';
  if (registerView) registerView.style.display = 'block';
  if (regError) regError.textContent = '';

  if (!isBack) history.pushState({ view: 'register' }, '', '#register');
}

function showLoginView(isBack = false) {
  const loginView = document.getElementById('login-view');
  const registerView = document.getElementById('register-view');
  const loginError = document.getElementById('login-error');

  if (registerView) registerView.style.display = 'none';
  if (loginView) loginView.style.display = 'block';
  if (loginError) loginError.textContent = '';

  if (!isBack) history.pushState({ view: 'login' }, '', '#login');
}

window.addEventListener('popstate', (e) => {
  if (e.state && e.state.view === 'register') {
    showRegisterView(true);
  } else {
    showLoginView(true);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = localStorage.getItem('logged_in_user');
  
  if (loggedInUser && window.location.pathname.includes('auth.html')) {
    window.location.href = './profile.html';
    return;
  }

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (registerForm) registerForm.addEventListener('submit', handleRegister);
});