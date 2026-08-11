// ════════════════════════════════════════════════
// ROTINA SEMANAL — PRISMA
//
// Usado por:
//   - calendario.html (botão "Rotina semanal" + tela cheia)
//   - home.html (card de resumo da rotina de hoje)
//
// Storage: prismaGet/Set('prisma-rotina') → isolado por conta
// Estrutura:
//   { "2026-06-22": [{id, hora, nome}], "2026-06-23": [...] }
//   A chave é a data real (YYYY-MM-DD) do dia da semana,
//   calculada a partir do domingo da semana atual.
// ════════════════════════════════════════════════

const DIAS_ROTINA = [
  'Domingo','Segunda-feira','Terça-feira','Quarta-feira',
  'Quinta-feira','Sexta-feira','Sábado'
];

// ── Helpers de data ──
function domingoDestaRotina(data) {
  const d = new Date(data);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}
function dataFormatadaRotina(dataObj) {
  return dataObj.toISOString().split('T')[0]; // "YYYY-MM-DD"
}
function dataBR(iso) {
  const [y,m,d] = iso.split('-');
  return `${d}/${m}`;
}

// ── Storage ──
function carregarRotina() {
  try { return JSON.parse(prismaGet('prisma-rotina')) || {}; }
  catch { return {}; }
}
function salvarRotina(dados) {
  prismaSet('prisma-rotina', JSON.stringify(dados));
}

// Retorna os 7 dias da semana como objetos {indice, nome, chave, dataObj}
function getDiasDaSemana() {
  const domingo = domingoDestaRotina(new Date());
  const dias = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(domingo);
    d.setDate(d.getDate() + i);
    dias.push({
      indice: i,
      nome: DIAS_ROTINA[i],
      chave: dataFormatadaRotina(d),
      dataObj: d,
    });
  }
  return dias;
}

// Ordena tarefas por hora
function ordenarPorHora(tarefas) {
  return [...tarefas].sort((a, b) => a.hora.localeCompare(b.hora));
}

// Hora atual formatada como "HH:MM"
function horaAtualStr() {
  const agora = new Date();
  return agora.toTimeString().slice(0, 5);
}

// ══════════════════════════════════════
// TELA DE ROTINA (no calendário)
// ══════════════════════════════════════
let rotinaDiaAbertoIndice = null;

function abrirRotinaSemanal() {
  document.getElementById('rotina-tela').classList.add('aberta');
  document.body.style.overflow = 'hidden';
  renderRotinaTela();
}

function fecharRotinaSemanal() {
  document.getElementById('rotina-tela').classList.remove('aberta');
  document.body.style.overflow = '';
}

function renderRotinaTela() {
  const dados = carregarRotina();
  const dias = getDiasDaSemana();
  const hojeIndice = new Date().getDay();
  const grid = document.getElementById('rotina-dias-grid');
  if (!grid) return;

  // Período da semana no label
  const labelEl = document.getElementById('rotina-semana-label');
  if (labelEl) {
    const dom = dias[0].dataObj;
    const sab = dias[6].dataObj;
    const fmt = d => d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
    labelEl.textContent = `${fmt(dom)} a ${fmt(sab)}`;
  }

  grid.innerHTML = '';

  dias.forEach(({ indice, nome, chave, dataObj }) => {
    const tarefas = ordenarPorHora(dados[chave] || []);
    const card = document.createElement('div');
    card.className = 'rotina-dia-card';
    card.id = `rotina-dia-card-${indice}`;

    card.innerHTML = `
      <div class="rotina-dia-header" onclick="toggleRotinaDia(${indice})">
        <div class="rotina-dia-nome-wrap">
          <span class="rotina-dia-nome ${indice === hojeIndice ? 'hoje-destaque' : ''}">${nome}</span>
          <span class="rotina-dia-data">${dataBR(chave)}</span>
        </div>
        <div class="rotina-dia-resumo">
          ${tarefas.length > 0 ? `<span class="rotina-dia-count">${tarefas.length} tarefa${tarefas.length > 1 ? 's' : ''}</span>` : ''}
          <span class="rotina-seta">▼</span>
        </div>
      </div>
      <div class="rotina-dia-corpo">
        <div class="rotina-tarefas-lista" id="rotina-lista-${indice}">
          ${tarefas.length === 0
            ? '<div class="rotina-vazio-txt">Nenhuma tarefa ainda</div>'
            : tarefas.map(t => `
              <div class="rotina-tarefa-item">
                <span class="rotina-tarefa-hora">${t.hora}</span>
                <span class="rotina-tarefa-nome">${t.nome}</span>
                <button class="rotina-tarefa-del"
                  onclick="removerTarefaRotina('${chave}', '${t.id}')">✕</button>
              </div>
            `).join('')
          }
        </div>
        <div class="rotina-add-form">
          <input type="time" id="rotina-hora-${indice}" value="08:00" />
          <input type="text" id="rotina-nome-${indice}"
            placeholder="Ex: Estudar matemática"
            maxlength="50"
            onkeydown="if(event.key==='Enter') adicionarTarefaRotina(${indice}, '${chave}')" />
          <button class="rotina-add-btn"
            onclick="adicionarTarefaRotina(${indice}, '${chave}')">＋</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Reabre o dia que estava aberto
  if (rotinaDiaAbertoIndice !== null) {
    const el = document.getElementById(`rotina-dia-card-${rotinaDiaAbertoIndice}`);
    if (el) el.classList.add('aberto');
  }
}

function toggleRotinaDia(indice) {
  const card = document.getElementById(`rotina-dia-card-${indice}`);
  const estavaAberto = card.classList.contains('aberto');
  document.querySelectorAll('.rotina-dia-card').forEach(c => c.classList.remove('aberto'));
  if (!estavaAberto) {
    card.classList.add('aberto');
    rotinaDiaAbertoIndice = indice;
  } else {
    rotinaDiaAbertoIndice = null;
  }
}

function adicionarTarefaRotina(indice, chave) {
  const hora = document.getElementById(`rotina-hora-${indice}`).value;
  const nome = document.getElementById(`rotina-nome-${indice}`).value.trim();
  if (!hora || !nome) return;

  const dados = carregarRotina();
  if (!dados[chave]) dados[chave] = [];

  dados[chave].push({ id: Date.now().toString(), hora, nome });
  salvarRotina(dados);

  document.getElementById(`rotina-nome-${indice}`).value = '';
  rotinaDiaAbertoIndice = indice;
  renderRotinaTela();
}

function removerTarefaRotina(chave, id) {
  const dados = carregarRotina();
  if (!dados[chave]) return;
  dados[chave] = dados[chave].filter(t => t.id !== id);
  salvarRotina(dados);
  renderRotinaTela();
}


// ══════════════════════════════════════
// CARD DE ROTINA NA HOME
// Mostra as próximas tarefas de hoje
// ══════════════════════════════════════
function renderRotinaHome() {
  const lista = document.getElementById('rotina-home-lista');
  const tagEl = document.getElementById('rotina-home-tag');
  if (!lista) return;

  const dados = carregarRotina();
  const hoje = dataFormatadaRotina(new Date());
  const tarefas = ordenarPorHora(dados[hoje] || []);
  const agora = horaAtualStr();

  if (tarefas.length === 0) {
    lista.innerHTML = `
      <div class="rotina-home-vazio">
        Nenhuma tarefa hoje.<br/>
        Configure sua rotina em 📅 Calendário!
      </div>
    `;
    if (tagEl) tagEl.style.display = 'none';
    return;
  }

  // Encontra a próxima tarefa (primeira que ainda não passou)
  const proxima = tarefas.find(t => t.hora >= agora);
  if (tagEl && proxima) {
    tagEl.textContent = `próxima às ${proxima.hora}`;
    tagEl.style.display = '';
  } else if (tagEl) {
    tagEl.style.display = 'none';
  }

  lista.innerHTML = '';
  // Mostra no máximo 4 tarefas no card da home
  tarefas.slice(0, 4).forEach(t => {
    const div = document.createElement('div');
    div.className = `rotina-home-item ${t.hora < agora ? 'passada' : ''}`;
    div.innerHTML = `
      <span class="rotina-home-hora">${t.hora}</span>
      <span class="rotina-home-nome">${t.nome}</span>
    `;
    lista.appendChild(div);
  });

  // Se tem mais de 4, mostra um aviso
  if (tarefas.length > 4) {
    const mais = document.createElement('div');
    mais.style.cssText = 'font-size:var(--texto-xs);color:var(--text-muted);text-align:center;padding:4px 0;';
    mais.textContent = `+ ${tarefas.length - 4} tarefas no total`;
    lista.appendChild(mais);
  }
}