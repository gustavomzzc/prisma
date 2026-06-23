// ── EFEITO SCROLL NA TOPBAR ──
// Quando a pessoa rola a página, a topbar ganha um fundo
// com sombra e a hora pequena aparece (ver .topbar.scrolled no CSS)
const topbar = document.getElementById('topbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    topbar.classList.add('scrolled');
  } else {
    topbar.classList.remove('scrolled');
  }
});
