// ════════════════════════════════════════════════
// AUTENTICAÇÃO SIMPLES POR E-MAIL (PRISMA)
//
// Não existe servidor — tudo roda no localStorage do navegador.
// Cada e-mail cadastrado vira uma "conta" separada:
//   - prisma-contas: guarda { "ana@gmail.com": "senha123", ... }
//   - prisma-sessao: guarda o e-mail atualmente logado
//
// Todos os dados do app (metas, financeiro, estudos, etc.)
// usam prismaStorageKey() para isolar por conta — assim
// "ana@gmail.com" e "bia@gmail.com" nunca veem os dados uma da outra.
// ════════════════════════════════════════════════

// ── Helpers de contas ──
function carregarContas() {
  try { return JSON.parse(localStorage.getItem('prisma-contas')) || {}; }
  catch { return {}; }
}

function salvarContas(contas) {
  localStorage.setItem('prisma-contas', JSON.stringify(contas));
}

// Tenta logar: cria a conta se o e-mail for novo, ou valida a senha se já existir.
// Retorna { ok: true } ou { ok: false, motivo: '...' }
function tentarLogin(email, senha) {
  email = email.trim().toLowerCase();
  if (!email || !senha) {
    return { ok: false, motivo: 'Preencha e-mail e senha.' };
  }

  const contas = carregarContas();

  if (!contas[email]) {
    // E-mail novo: cria a conta automaticamente com essa senha
    contas[email] = senha;
    salvarContas(contas);
  } else if (contas[email] !== senha) {
    // E-mail já existe, mas a senha não confere
    return { ok: false, motivo: 'Senha incorreta para este e-mail.' };
  }

  // Login OK — guarda a sessão ativa
  localStorage.setItem('prisma-sessao', email);
  return { ok: true };
}

// ── Sessão ──
function obterEmailLogado() {
  return localStorage.getItem('prisma-sessao');
}

function estaLogado() {
  return !!obterEmailLogado();
}

function fazerLogout() {
  localStorage.removeItem('prisma-sessao');
  window.location.href = 'index.html';
}

// Protege uma página: se não houver sessão ativa, volta pro login.
// Chame isso no topo do <script> de cada página interna (home, financeiro, etc.)
function protegerPagina() {
  if (!estaLogado()) {
    window.location.href = 'index.html';
  }
}

// ════════════════════════════════════════════════
// ISOLAMENTO DE DADOS POR CONTA
// ════════════════════════════════════════════════
// Em vez de localStorage.setItem('prisma-metas-semanais', ...),
// as páginas devem usar prismaGet/prismaSet com a MESMA chave de antes.
// Por baixo dos panos, a função adiciona "::email" para separar os dados.

function prismaStorageKey(chaveOriginal) {
  const email = obterEmailLogado() || 'sem-sessao';
  return `${chaveOriginal}::${email}`;
}

function prismaGet(chave) {
  return localStorage.getItem(prismaStorageKey(chave));
}

function prismaSet(chave, valor) {
  localStorage.setItem(prismaStorageKey(chave), valor);
}

function prismaRemove(chave) {
  localStorage.removeItem(prismaStorageKey(chave));
}
