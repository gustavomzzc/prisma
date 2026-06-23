// ── ATALHO: O QUE ESTUDAR HOJE (HOME) ──
// Lê o mesmo localStorage que a página de Estudos usa (prisma-cronograma)
// e mostra na home só o que está planejado para o dia de hoje.
// Esta página NÃO permite editar — só visualizar. Para mudar, vai em Estudos → Cronograma.

function renderEstudarHojeNaHome() {
  const lista = document.getElementById('estudar-hoje-lista');
  if (!lista) return; // segurança: só roda se o elemento existir nesta página

  let cronograma;
  try {
    cronograma = JSON.parse(prismaGet('prisma-cronograma'));
  } catch {
    cronograma = null;
  }

  const hojeIndice = new Date().getDay(); // 0 = domingo ... 6 = sábado
  const itensHoje = (cronograma && cronograma[hojeIndice]) || [];

  if (itensHoje.length === 0) {
    lista.innerHTML = `
      <div class="estudar-hoje-vazio">
        Nada planejado para hoje.<br/>
        Organize seu cronograma em 📚 Estudos!
      </div>
    `;
    return;
  }

  lista.innerHTML = '';
  itensHoje.forEach(item => {
    const div = document.createElement('div');
    div.className = 'estudar-hoje-item';
    div.innerHTML = `
      <span class="estudar-hoje-materia">${item.materia}</span>
      <span class="estudar-hoje-tempo">${item.minutos} min</span>
    `;
    lista.appendChild(div);
  });
}

renderEstudarHojeNaHome();
