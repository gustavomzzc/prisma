// ── METAS DO DIA (HOME) ──
// IMPORTANTE: as metas que aparecem aqui NÃO são uma lista própria.
// Elas vêm das "Metas semanais" organizadas no Calendário.
// Esta página apenas lê e marca como concluída a meta do dia de hoje.
// Para adicionar/remover metas, é preciso ir em Calendário → Metas da semana.

// Acha o domingo da semana de uma data (mesma lógica do calendário)
function obterDomingoDaSemanaHome(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function chaveDaSemanaHome(data) {
  const domingo = obterDomingoDaSemanaHome(data);
  const y = domingo.getFullYear();
  const m = (domingo.getMonth() + 1).toString().padStart(2, '0');
  const d = domingo.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function carregarMetasSemanaisHome() {
  try { return JSON.parse(prismaGet('prisma-metas-semanais')) || {}; }
  catch { return {}; }
}

function salvarMetasSemanaisHome(dados) {
  prismaSet('prisma-metas-semanais', JSON.stringify(dados));
}

// Pega as metas de HOJE dentro da semana atual
function obterMetasDeHoje() {
  const todas = carregarMetasSemanaisHome();
  const chaveSemana = chaveDaSemanaHome(new Date());
  const diaIndice = new Date().getDay(); // 0 = domingo ... 6 = sábado

  if (!todas[chaveSemana]) {
    todas[chaveSemana] = { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[] };
    salvarMetasSemanaisHome(todas);
  }

  return { todas, chaveSemana, diaIndice, metasHoje: todas[chaveSemana][diaIndice] };
}

// Renderiza a lista de metas de hoje na home
function renderizarMetasDoDia() {
  const { metasHoje } = obterMetasDeHoje();
  const lista = document.getElementById('metas-lista');
  lista.innerHTML = '';

  if (!metasHoje || metasHoje.length === 0) {
    lista.innerHTML = `
      <li class="meta-vazia-aviso" style="list-style:none; font-size: var(--texto-sm); color: var(--text-muted); text-align:center; padding: 0.5rem 0;">
        Nenhuma meta para hoje.<br/>Organize sua semana no 📅 Calendário!
      </li>
    `;
    atualizarProgressoMetasHome([]);
    return;
  }

  metasHoje.forEach((meta) => {
    const li = document.createElement('li');
    li.className = 'meta-item' + (meta.concluida ? ' concluida' : '');
    li.innerHTML = `
      <div class="meta-checkbox"></div>
      <span class="meta-texto">${meta.texto}</span>
    `;
    li.addEventListener('click', () => {
      // Busca os dados FRESCOS do localStorage e altera o mesmo objeto que será salvo
      const todas = carregarMetasSemanaisHome();
      const chaveSemana = chaveDaSemanaHome(new Date());
      const diaIndice = new Date().getDay();
      const metaNoStorage = todas[chaveSemana][diaIndice].find(m => m.id === meta.id);
      if (metaNoStorage) {
        metaNoStorage.concluida = !metaNoStorage.concluida;
        salvarMetasSemanaisHome(todas);
      }
      renderizarMetasDoDia();
    });
    lista.appendChild(li);
  });

  atualizarProgressoMetasHome(metasHoje);
}

function atualizarProgressoMetasHome(metasHoje) {
  const total      = metasHoje.length;
  const concluidas = metasHoje.filter(m => m.concluida).length;
  const pct        = total > 0 ? (concluidas / total) * 100 : 0;

  document.getElementById('barra-fill').style.width      = pct + '%';
  document.getElementById('progresso-label').textContent = `${concluidas} / ${total}`;
}

// O botão "Adicionar meta" na home agora também salva direto na semana de hoje
const btnAdd    = document.getElementById('btn-add-meta');
const inputNova = document.getElementById('input-nova-meta');

btnAdd.addEventListener('click', () => {
  inputNova.classList.add('visivel');
  inputNova.focus();
});

inputNova.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const texto = inputNova.value.trim();
    if (texto) {
      const { todas, chaveSemana, diaIndice } = obterMetasDeHoje();
      todas[chaveSemana][diaIndice].push({
        id: Date.now().toString(),
        texto,
        concluida: false
      });
      salvarMetasSemanaisHome(todas);

      inputNova.value = '';
      inputNova.classList.remove('visivel');
      renderizarMetasDoDia();
    }
  }
  if (e.key === 'Escape') {
    inputNova.classList.remove('visivel');
    inputNova.value = '';
  }
});

renderizarMetasDoDia();
