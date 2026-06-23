const quotes = [
  "Eu adoro a vida, ela é preciosa. É um milagre. Quero viver muito. - Gal Costa",
  "Pequenos passos todos os dias levam a grandes resultados.",
  "Organize seus pensamentos e o mundo ao seu redor se organiza.",
  "Cada dia é uma nova oportunidade de ser quem você quer ser.",
  "A vida é amiga da arte. - Gal Costa",
  "O segredo é começar. O resto vem com o tempo.",
  "Cuide de você com a mesma dedicação com que cuida de tudo.",
  "Progresso, não perfeição.",
  "Faça hoje o que seu eu do futuro vai agradecer.",
  "Você é capaz de muito mais do que imagina."
];

let quoteAtual = Math.floor(Math.random() * quotes.length);

function mostrarQuote(indice) {
  const el = document.getElementById('quote-texto');
  el.classList.add('saindo');

  setTimeout(() => {
    el.textContent = quotes[indice];
    el.classList.remove('saindo');
  }, 500); 
} 

mostrarQuote(quoteAtual);

setInterval(() => {
  quoteAtual = (quoteAtual + 1) % quotes.length;
  mostrarQuote(quoteAtual);
}, 180000);