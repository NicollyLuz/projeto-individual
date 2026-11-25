// ============================================================
// PERGUNTAS: cada alternativa soma 1 ponto pro estilo dela
// (não existe "certo/errado", é um teste de perfil)
// ============================================================
const listaDeQuestoes = [
  { pergunta: "Como você escolhe uma roupa pela manhã?", alternativas: [
    { texto: "Peças atemporais e alfaiataria",  estilo: "Clássico" },
    { texto: "Roupas largas e cultura urbana",  estilo: "Street" },
    { texto: "Menos é mais, cores neutras",     estilo: "Minimalista" },
    { texto: "Conforto e tecidos tecnológicos", estilo: "Esportivo" } ]},
  { pergunta: "Qual peça não pode faltar no seu guarda-roupa?", alternativas: [
    { texto: "Blazer bem cortado",             estilo: "Clássico" },
    { texto: "Tênis de streetwear",            estilo: "Street" },
    { texto: "Camiseta básica de algodão",     estilo: "Minimalista" },
    { texto: "Legging ou moletom",             estilo: "Esportivo" } ]},
  { pergunta: "Que tipo de tecido você prefere?", alternativas: [
    { texto: "Lã e seda",       estilo: "Elegante" },
    { texto: "Jeans e moletom", estilo: "Street" },
    { texto: "Algodão e linho", estilo: "Minimalista" },
    { texto: "Dry-fit e nylon", estilo: "Esportivo" } ]},
  { pergunta: "Como você monta um look para um jantar?", alternativas: [
    { texto: "Vestido ou terno impecável", estilo: "Elegante" },
    { texto: "Alfaiataria clássica",       estilo: "Clássico" },
    { texto: "Peça única clean",           estilo: "Minimalista" },
    { texto: "Streetwear arrumado",        estilo: "Street" } ]},
  { pergunta: "Qual acessório combina com você?", alternativas: [
    { texto: "Relógio clássico",           estilo: "Clássico" },
    { texto: "Boné ou corrente",           estilo: "Street" },
    { texto: "Óculos discretos",           estilo: "Minimalista" },
    { texto: "Brinco ou colar de impacto", estilo: "Elegante" } ]},
  { pergunta: "Qual cor domina seu armário?", alternativas: [
    { texto: "Preto, branco e cinza",      estilo: "Minimalista" },
    { texto: "Cores vibrantes e estampas", estilo: "Street" },
    { texto: "Tons terrosos e neutros",    estilo: "Clássico" },
    { texto: "Tons claros",                estilo: "Esportivo" } ]},
  { pergunta: "Como você se sente mais confortável?", alternativas: [
    { texto: "Bem arrumada e sofisticada", estilo: "Elegante" },
    { texto: "Livre e autêntica",          estilo: "Street" },
    { texto: "Simples e prática",          estilo: "Minimalista" },
    { texto: "Em movimento",               estilo: "Esportivo" } ]},
  { pergunta: "Que tipo de calçado você usa mais?", alternativas: [
    { texto: "Sapato de couro",   estilo: "Clássico" },
    { texto: "Tênis chunky",      estilo: "Street" },
    { texto: "Mule ou sapatilha", estilo: "Minimalista" },
    { texto: "Tênis de corrida",  estilo: "Esportivo" } ]},
  { pergunta: "Qual marca/estilo te inspira?", alternativas: [
    { texto: "Chanel, Dior",        estilo: "Elegante" },
    { texto: "Balenciaga, Supreme", estilo: "Street" },
    { texto: "COS, Uniqlo",         estilo: "Minimalista" },
    { texto: "Nike, Adidas",        estilo: "Esportivo" } ]},
  { pergunta: "Seu estilo em uma palavra?", alternativas: [
    { texto: "Sofisticado", estilo: "Elegante" },
    { texto: "Urbano",      estilo: "Street" },
    { texto: "Essencial",   estilo: "Minimalista" },
    { texto: "Ativo",       estilo: "Esportivo" } ]}
];

// ============================================================
// ESTADO DO QUIZ
// ============================================================
// Lista fixa de estilos possíveis (usada em várias partes)
const ESTILOS = ['Clássico', 'Street', 'Minimalista', 'Esportivo', 'Elegante'];

// Índice da pergunta atual (0 = primeira)
let atual = 0;

// Objeto de pontos: { "Clássico": 0, "Street": 0, ... } via Object.fromEntries
let pontos = Object.fromEntries(ESTILOS.map(e => [e, 0]));

// ============================================================
// INICIALIZAÇÃO: roda quando a página carrega
// ============================================================
window.onload = () => {
  // Se não tem usuário logado, manda pro login
  if (!localStorage.getItem('idUsuario')) return location = 'login.html';

  // Mostra o jogo e escreve "1 de 10"
  jogo.style.display = "flex";
  qtdQuestoes.innerHTML = listaDeQuestoes.length;
  mostrar(0);  // carrega a primeira pergunta
};

// ============================================================
// mostrar(i): preenche a tela com a pergunta de índice i
// ============================================================
function mostrar(i) {
  atual = i;
  const q = listaDeQuestoes[i];

  // Cabeçalho: "Questão X" e o texto da pergunta
  spanNumeroDaQuestaoAtual.innerHTML = i + 1;
  spanQuestaoExibida.innerHTML = q.pergunta;

  // Injeta o texto das 4 alternativas nos spans correspondentes
  [textoOpcaoUm, textoOpcaoDois, textoOpcaoTres, textoOpcaoQuatro]
    .forEach((el, k) => el.innerHTML = q.alternativas[k].texto);

  // Reseta os radios (desmarca + reabilita) e tira a cor de "marcada"
  document.querySelectorAll('input[name="option"]').forEach(r => { r.checked = false; r.disabled = false; });
  document.querySelectorAll('.opcao-container').forEach(l => l.classList.remove('marcada'));

  // Submeter liberado, Avançar bloqueado (só libera depois de responder)
  btnSubmeter.disabled = false;
  btnProx.disabled = true;
}

// ============================================================
// submeter(): pega a alternativa marcada e soma 1 ponto pro estilo
// ============================================================
function submeter() {
  // Qual radio está marcado? Se nenhum, avisa e para
  const escolhida = document.querySelector('input[name="option"]:checked');
  if (!escolhida) return alert("Escolha uma opção antes de submeter.");

  // Pega o índice (0-3) e o estilo correspondente, soma +1
  pontos[listaDeQuestoes[atual].alternativas[Number(escolhida.value)].estilo]++;

  // Marca visualmente a opção + bloqueia os radios
  escolhida.closest('.opcao-container').classList.add('marcada');
  document.querySelectorAll('input[name="option"]').forEach(r => r.disabled = true);

  // Bloqueia Submeter e libera Avançar
  btnSubmeter.disabled = true;
  btnProx.disabled = false;
}

// ============================================================
// avancar(): vai pra próxima pergunta ou finaliza se for a última
// ============================================================
function avancar() {
  atual < listaDeQuestoes.length - 1 ? mostrar(atual + 1) : finalizar();
}

// ============================================================
// finalizar(): descobre o estilo vencedor e mostra o resultado
// ============================================================
function finalizar() {
  // Esconde o jogo e mostra a tela de resultado
  jogo.style.display = "none";
  pontuacaoFinalJogo.style.display = "block";

  // reduce: percorre ESTILOS e devolve o que tem mais pontos
  let vencedor = ESTILOS.reduce((a, e) => pontos[e] > pontos[a] ? e : a, ESTILOS[0]);

  // Mostra a mensagem e salva no banco
  msgFinal.innerHTML = `Seu estilo combina com: <strong>${vencedor}</strong>`;
  salvar(vencedor, pontos[vencedor]);
}

// Recarrega a página pra começar de novo
function tentarNovamente() { location.reload(); }

// ============================================================
// salvar(): envia o resultado pro backend (POST /quiz/salvar)
// ============================================================
function salvar(estilo, pontos) {
  const id = localStorage.getItem('idUsuario');
  if (!id) return;  // sem login, não salva

  fetch('/quiz/salvar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fk_usuario: id, estilo_escolhido: estilo, pontuacao: pontos })
  }).catch(e => console.error(e));
}