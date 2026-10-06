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