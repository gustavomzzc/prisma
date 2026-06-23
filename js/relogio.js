// ── 2. RELÓGIO E DATA ──
function atualizarRelogio() {
  const agora = new Date();

  const hora = agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const diaSemana = agora.toLocaleDateString('pt-BR', { weekday: 'long' });
  const diaNum    = agora.getDate();
  const mes       = agora.toLocaleDateString('pt-BR', { month: 'long' });
  const dataFormatada = `${diaSemana}, ${diaNum} de ${mes}`;

  document.getElementById('hora-grande').textContent = hora;
  document.getElementById('topbar-hora').textContent = hora;
  document.getElementById('data-hoje').textContent   = dataFormatada;
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);
