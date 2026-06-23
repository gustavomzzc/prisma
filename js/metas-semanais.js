// ════════════════════════════════════════════════
// METAS SEMANAIS
// Usado pelo calendario.html
//
// Conceito: a semana vai de Domingo a Sábado.
// As metas ficam guardadas com uma "chave de semana"
// baseada na data do Domingo daquela semana.
// Quando vira uma nova semana (domingo), os dados
// antigos continuam salvos no histórico, mas a tela
// mostra automaticamente os cards vazios da semana nova.
// ════════════════════════════════════════════════

const DIAS_SEMANA_MS = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];

// Acha a data do domingo da semana de "data"
function obterDomingoDaSemana(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // volta até o domingo
  return d;
}

// Gera a chave única da semana, ex: "2026-06-14" (domingo daquela semana)
function chaveDaSemana(data) {
  const domingo = obterDomingoDaSemana(data);
  const y = domingo.getFullYear();
  const m = (domingo.getMonth() + 1).toString().padStart(2, '0');
  const d = domingo.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function carregarMS(chave, padrao) {
  try { const v = JSON.parse(prismaGet(chave)); return v !== null ? v : padrao; }
  catch { return padrao; }
}
function salvarMS(chave, valor) { prismaSet(chave, JSON.stringify(valor)); }

// ── Estado ──
// metasSemanaisTodas = { "2026-06-14": { 0: [{id,texto,concluida}], 1: [...], ... } }
let metasSemanaisTodas = carregarMS('prisma-metas-semanais', {});
let msDiaAbertoIndice = null;

// Pega (ou cria vazia) a semana atual
function obterSemanaAtual() {
  const chave = chaveDaSemana(new Date());
  if (!metasSemanaisTodas[chave]) {
    metasSemanaisTodas[chave] = { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[] };
    salvarMS('prisma-metas-semanais', metasSemanaisTodas);
  }
  return { chave, dados: metasSemanaisTodas[chave] };
}

// ── Abrir / fechar a tela ──
function abrirMetasSemanais() {
  document.getElementById('metas-semanais-tela').classList.add('aberta');
  document.body.style.overflow = 'hidden';
  renderMetasSemanais();
}

function fecharMetasSemanais() {
  document.getElementById('metas-semanais-tela').classList.remove('aberta');
  document.body.style.overflow = '';
}

// ── Renderiza os 7 cards de dia ──
function renderMetasSemanais() {
  const { chave, dados } = obterSemanaAtual();

  const domingo = new Date(chave + 'T00:00:00');
  const sabado = new Date(domingo);
  sabado.setDate(sabado.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  document.getElementById('ms-periodo-label').textContent =
    `Semana de ${fmt(domingo)} a ${fmt(sabado)}`;

  const hojeIndice = new Date().getDay();
  const container = document.getElementById('ms-conteudo');
  container.innerHTML = '';

  DIAS_SEMANA_MS.forEach((nomeDia, indice) => {
    const dataDoDia = new Date(domingo);
    dataDoDia.setDate(dataDoDia.getDate() + indice);
    const dataLabel = dataDoDia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    const itens = dados[indice] || [];
    const concluidas = itens.filter(i => i.concluida).length;

    const card = document.createElement('div');
    card.className = 'ms-dia-card';
    card.id = 'ms-dia-card-' + indice;

    card.innerHTML = `
      <div class="ms-dia-header" onclick="toggleMsDia(${indice})">
        <div class="ms-dia-nome-wrap">
          <span class="ms-dia-nome ${indice === hojeIndice ? 'hoje-destaque' : ''}">${nomeDia}</span>
          <span class="ms-dia-data">${dataLabel}</span>
        </div>
        <div class="ms-dia-resumo">
          ${itens.length > 0 ? `<span class="ms-dia-contagem">${concluidas}/${itens.length}</span>` : ''}
          <span class="ms-dia-seta">▼</span>
        </div>
      </div>
      <div class="ms-dia-conteudo">
        <ul class="ms-metas-lista" id="ms-metas-lista-${indice}">
          ${itens.length === 0
            ? '<li class="ms-dia-vazio">Nenhuma meta adicionada</li>'
            : itens.map(item => `
              <li class="ms-meta-item ${item.concluida ? 'concluida' : ''}" onclick="toggleMsMeta(${indice}, '${item.id}')">
                <div class="ms-meta-checkbox"></div>
                <span class="ms-meta-texto">${item.texto}</span>
                <button class="ms-meta-del" onclick="event.stopPropagation(); removerMsMeta(${indice}, '${item.id}')">✕</button>
              </li>
            `).join('')
          }
        </ul>
        <div class="ms-add-form">
          <input type="text" id="ms-input-${indice}" placeholder="Nova meta para ${nomeDia.toLowerCase()}..." maxlength="80"
                 onkeydown="if(event.key==='Enter') adicionarMsMeta(${indice})" />
          <button onclick="adicionarMsMeta(${indice})">＋</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Mantém o dia que estava aberto, se houver
  if (msDiaAbertoIndice !== null) {
    const el = document.getElementById('ms-dia-card-' + msDiaAbertoIndice);
    if (el) el.classList.add('aberto');
  }
}

function toggleMsDia(indice) {
  const card = document.getElementById('ms-dia-card-' + indice);
  const estavaAberto = card.classList.contains('aberto');

  // Fecha todos antes de abrir o novo (mantém a lista mais limpa)
  document.querySelectorAll('.ms-dia-card').forEach(c => c.classList.remove('aberto'));

  if (!estavaAberto) {
    card.classList.add('aberto');
    msDiaAbertoIndice = indice;
  } else {
    msDiaAbertoIndice = null;
  }
}

function adicionarMsMeta(indice) {
  const { dados } = obterSemanaAtual();
  const input = document.getElementById('ms-input-' + indice);
  const texto = input.value.trim();
  if (!texto) return;

  dados[indice].push({ id: Date.now().toString(), texto, concluida: false });
  salvarMS('prisma-metas-semanais', metasSemanaisTodas);

  msDiaAbertoIndice = indice;
  renderMetasSemanais();

  // Atualiza a home também, se as metas de hoje mudaram
  if (typeof renderizarMetasDoDia === 'function') renderizarMetasDoDia();
}

function toggleMsMeta(indice, metaId) {
  const { dados } = obterSemanaAtual();
  const meta = dados[indice].find(m => m.id === metaId);
  if (!meta) return;
  meta.concluida = !meta.concluida;
  salvarMS('prisma-metas-semanais', metasSemanaisTodas);

  msDiaAbertoIndice = indice;
  renderMetasSemanais();

  if (typeof renderizarMetasDoDia === 'function') renderizarMetasDoDia();
}

function removerMsMeta(indice, metaId) {
  const { dados } = obterSemanaAtual();
  dados[indice] = dados[indice].filter(m => m.id !== metaId);
  salvarMS('prisma-metas-semanais', metasSemanaisTodas);

  msDiaAbertoIndice = indice;
  renderMetasSemanais();

  if (typeof renderizarMetasDoDia === 'function') renderizarMetasDoDia();
}
