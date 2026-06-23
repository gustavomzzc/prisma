// ── CONFIGURAÇÕES ──
// Lógica da página configuracoes.html

// ════════════════════════════════════
// 1. NOME DE EXIBIÇÃO
// ════════════════════════════════════
// Salvo em 'prisma-nome-usuario', isolado por conta (prismaGet/Set).
// Outras páginas (ex: Home) podem ler para mostrar "Olá, Ana!".

function carregarNomeUsuario() {
  const nome = prismaGet('prisma-nome-usuario') || '';
  const input = document.getElementById('input-nome-usuario');
  if (input) input.value = nome;
}

function salvarNomeUsuario() {
  const input = document.getElementById('input-nome-usuario');
  const nome = input.value.trim();
  prismaSet('prisma-nome-usuario', nome);

  // Feedback visual rápido de "Salvo!"
  const feedback = document.getElementById('feedback-nome');
  feedback.classList.add('visivel');
  setTimeout(() => feedback.classList.remove('visivel'), 2000);
}

// ════════════════════════════════════
// 2. SOM DO POMODORO
// ════════════════════════════════════
// Salvo em 'prisma-pomo-som' ('on' ou 'off'), isolado por conta.
// O estudos.html lê essa chave antes de tocar o alarme.

function carregarToggleSomPomodoro() {
  const ligado = prismaGet('prisma-pomo-som') !== 'off'; // padrão: ligado
  document.getElementById('toggle-som-pomodoro').checked = ligado;
}

document.getElementById('toggle-som-pomodoro').addEventListener('change', (e) => {
  prismaSet('prisma-pomo-som', e.target.checked ? 'on' : 'off');
});

// ════════════════════════════════════
// 3. MODO ESCURO (toggle espelhado)
// ════════════════════════════════════
// IMPORTANTE: o tema continua GLOBAL (não isolado por conta),
// pois é uma preferência do navegador/dispositivo, não da pessoa.
// Por isso aqui continua usando localStorage direto, igual js/tema.js.

function carregarToggleModoEscuro() {
  const escuro = document.documentElement.classList.contains('dark');
  document.getElementById('toggle-modo-escuro').checked = escuro;
}

document.getElementById('toggle-modo-escuro').addEventListener('change', (e) => {
  // Reaproveita a função aplicarTema() já definida em js/tema.js
  aplicarTema(e.target.checked);
});

// ════════════════════════════════════
// 4. LIMPAR TODOS OS DADOS (só da conta atual)
// ════════════════════════════════════
function limparTodosOsDados() {
  const confirmacao = confirm(
    'Tem certeza que deseja apagar TODOS os seus dados do PRISMA?\n\n' +
    'Isso inclui metas, registros financeiros, investimentos, matérias, ' +
    'cronograma, eventos do calendário e projetos desta conta.\n\n' +
    'Essa ação não pode ser desfeita.'
  );
  if (!confirmacao) return;

  // Lista de todas as chaves de CONTEÚDO que o PRISMA usa.
  // Cada uma é isolada por e-mail via prismaRemove — então isso
  // apaga só os dados da conta logada, não de outras contas.
  const chaves = [
    'prisma-metas-semanais',
    'prisma-registros',
    'prisma-investimentos',
    'prisma-categorias',
    'prisma-cronograma',
    'prisma-materias',
    'prisma-pomo-config',
    'prisma-pomo-som',
    'prisma-eventos',
    'prisma-projetos',
    'prisma-nome-usuario',
  ];

  chaves.forEach(chave => prismaRemove(chave));

  alert('Todos os seus dados foram apagados. O PRISMA está limpo para começar de novo! 🌸');
  window.location.href = 'home.html';
}

// ════════════════════════════════════
// INICIALIZAÇÃO
// ════════════════════════════════════
carregarNomeUsuario();
carregarToggleSomPomodoro();
carregarToggleModoEscuro();
