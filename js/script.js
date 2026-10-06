document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const profileBtn = e.target.closest('a[href*="profile"], a[href*="auth"], .icon-link[aria-label="პროფილი"]');

    if (profileBtn || e.target.classList.contains('fa-user')) {
      e.preventDefault();

      const isInSubfolder = window.location.pathname.includes('/html/');
      
      window.location.href = isInSubfolder ? 'auth.html' : 'html/auth.html';
    }
  });

  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');

      const icon = burgerBtn.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = burgerBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        const icon = burgerBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }
});

function logoutUser() {
  localStorage.removeItem('logged_in_user');
  alert('თქვენ გამოხვედით სისტემიდან');
  const isInSubfolder = window.location.pathname.includes('/html/');
  window.location.href = isInSubfolder ? '../index.html' : 'index.html';
}