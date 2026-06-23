// ── 1. MODO ESCURO ──
// Verifica se já havia preferência salva
const btnTema = document.getElementById('btn-tema');
const icone   = btnTema.querySelector('.icone-tema');
const htmlEl  = document.documentElement; // o <html>

function aplicarTema(escuro) {
  if (escuro) {
    htmlEl.classList.add('dark');
    icone.textContent = '☀️';       // no escuro mostra sol (para voltar ao claro)
  } else {
    htmlEl.classList.remove('dark');
    icone.textContent = '🌙';       // no claro mostra lua (para ativar escuro)
  }
  localStorage.setItem('prisma-tema', escuro ? 'dark' : 'light');
}

// Carrega preferência salva
const temaSalvo = localStorage.getItem('prisma-tema');
aplicarTema(temaSalvo === 'dark');

// Alterna ao clicar
btnTema.addEventListener('click', () => {
  const estaEscuro = htmlEl.classList.contains('dark');
  aplicarTema(!estaEscuro);
});
