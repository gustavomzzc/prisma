// ── SIDEBAR (menu lateral) ──
// Compartilhado por todas as páginas do PRISMA.
// Depende de existir no HTML:
//   - elemento com id="sidebar-overlay"
//   - elemento com id="sidebar"
//   - a logo da topbar com id="logo-abre-sidebar"

function abrirSidebar() {
  document.getElementById('sidebar-overlay').classList.add('aberta');
  document.getElementById('sidebar').classList.add('aberta');
  document.body.style.overflow = 'hidden';
}

function fecharSidebar() {
  document.getElementById('sidebar-overlay').classList.remove('aberta');
  document.getElementById('sidebar').classList.remove('aberta');
  document.body.style.overflow = '';
}

// Liga o clique na logo para abrir a sidebar
const logoAbreSidebar = document.getElementById('logo-abre-sidebar');
if (logoAbreSidebar) {
  logoAbreSidebar.addEventListener('click', abrirSidebar);
}

// Fecha ao clicar no fundo escurecido
const overlaySidebar = document.getElementById('sidebar-overlay');
if (overlaySidebar) {
  overlaySidebar.addEventListener('click', fecharSidebar);
}

// Ação: Sair / Logout
// fazerLogout() está em js/auth.js — remove a sessão ativa
// (a conta continua salva, só desconecta) e volta pro login.
function sidebarSair() {
  if (confirm('Deseja realmente sair?')) {
    fazerLogout();
  }
}

// Ação: Sobre o app
function sidebarSobre() {
  alert('PRISMA 💎\nSeu espaço de organização pessoal.\n\nFeito com 💜 para te ajudar a organizar estudos, finanças, projetos e metas.');
}
