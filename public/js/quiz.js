// ==========================================
// 1. PERGUNTAS (10 perguntas com pontuação por estilo)
// ==========================================
const listaDeQuestoes = [
    { pergunta: "Como você escolhe uma roupa pela manhã?", alternativaA: "Peças atemporais", alternativaB: "Roupas largas e urbanas", alternativaC: "Cores neutras", alternativaD: "Conforto e tecnologia" },
    { pergunta: "Qual peça não pode faltar no seu guarda-roupa?", alternativaA: "Blazer", alternativaB: "Tênis de streetwear", alternativaC: "Camiseta básica", alternativaD: "Moletom" },
    { pergunta: "Que tipo de tecido você prefere?", alternativaA: "Lã e seda", alternativaB: "Jeans e moletom", alternativaC: "Algodão e linho", alternativaD: "Dry-fit" },
    { pergunta: "Como você monta um look para um jantar?", alternativaA: "Terno impecável", alternativaB: "Streetwear arrumado", alternativaC: "Peça única clean", alternativaD: "Alfaiataria clássica" },
    { pergunta: "Qual acessório combina com você?", alternativaA: "Relógio clássico", alternativaB: "Boné ou corrente", alternativaC: "Óculos discretos", alternativaD: "Brinco de impacto" },
    { pergunta: "Qual cor domina seu armário?", alternativaA: "Preto, branco e cinza", alternativaB: "Cores vibrantes", alternativaC: "Tons terrosos", alternativaD: "Tons claros" },
    { pergunta: "Como você se sente mais confortável?", alternativaA: "Bem arrumada", alternativaB: "Livre e autêntica", alternativaC: "Simples e prática", alternativaD: "Em movimento" },
    { pergunta: "Que tipo de calçado você usa mais?", alternativaA: "Sapato de couro", alternativaB: "Tênis chunky", alternativaC: "Mule ou sapatilha", alternativaD: "Tênis de corrida" },
    { pergunta: "Qual estilo te inspira?", alternativaA: "Chanel, Dior", alternativaB: "Balenciaga, Supreme", alternativaC: "COS, Uniqlo", alternativaD: "Nike, Adidas" },
    { pergunta: "Seu estilo em uma palavra:", alternativaA: "Sofisticado", alternativaB: "Urbano", alternativaC: "Essencial", alternativaD: "Ativo" }
];

// ==========================================
// 2. VARIÁVEIS DE CONTROLE
// ==========================================
let numeroDaQuestaoAtual = 0;
let quantidadeDeQuestoes = listaDeQuestoes.length;
let pontos = { "Elegante": 0, "Street": 0, "Minimalista": 0, "Clássico": 0, "Esportivo": 0 };

// ==========================================
// 3. INICIALIZAÇÃO
// ==========================================
function iniciarQuiz() {
    document.getElementById('pontuacao').style.display = "flex";
    document.getElementById('jogo').style.display = "flex";
    document.getElementById('btnIniciarQuiz').style.display = "none";
    document.getElementById('qtdQuestoes').innerHTML = quantidadeDeQuestoes;
    preencherHTMLcomQuestaoAtual(0);
    btnSubmeter.disabled = false;
    btnProx.disabled = true;
    btnTentarNovamente.disabled = true;
}

// ==========================================
// 4. PREENCHER PERGUNTA NA TELA
// ==========================================
function preencherHTMLcomQuestaoAtual(index) {
    habilitarAlternativas(true);
    desmarcarRadioButtons();
    limparCoresBackgroundOpcoes();
    
    const questaoAtual = listaDeQuestoes[index];
    numeroDaQuestaoAtual = index;
    
    document.getElementById("spanNumeroDaQuestaoAtual").innerHTML = index + 1;
    document.getElementById("spanQuestaoExibida").innerHTML = questaoAtual.pergunta;
    
    document.getElementById("textoOpcaoUm").innerHTML = questaoAtual.alternativaA;
    document.getElementById("textoOpcaoDois").innerHTML = questaoAtual.alternativaB;
    document.getElementById("textoOpcaoTres").innerHTML = questaoAtual.alternativaC;
    document.getElementById("textoOpcaoQuatro").innerHTML = questaoAtual.alternativaD;
    
    btnSubmeter.disabled = false;
    btnProx.disabled = true;
}

// ==========================================
// 5. SUBMETER (SOMAR PONTOS - SEM CERTO/ERRADO)
// ==========================================
function submeter() {
    const options = document.getElementsByName("option");
    let hasChecked = false;
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) { hasChecked = true; break; }
    }

    if (!hasChecked) {
        alert("Escolha uma opção antes de submeter.");
        return;
    }

    // Lógica de pontuação: dependendo da alternativa escolhida, soma ponto pro estilo
    const escolha = document.querySelector('input[name="option"]:checked').value;
    
    if (escolha === "alternativaA") pontos["Elegante"]++;       // Ex: Opção A puxa pro Elegante
    else if (escolha === "alternativaB") pontos["Street"]++;    // Ex: Opção B puxa pro Street
    else if (escolha === "alternativaC") pontos["Minimalista"]++; // Ex: Opção C puxa pro Minimalista
    else if (escolha === "alternativaD") pontos["Clássico"]++;  // Ex: Opção D puxa pro Clássico

    // Bloqueia botões e libera o "Avançar"
    btnSubmeter.disabled = true;
    btnProx.disabled = false;
    habilitarAlternativas(false);
}

// ==========================================
// 6. AVANÇAR PARA PRÓXIMA QUESTÃO
// ==========================================
function avancar() {
    if (numeroDaQuestaoAtual < quantidadeDeQuestoes - 1) {
        numeroDaQuestaoAtual++;
        preencherHTMLcomQuestaoAtual(numeroDaQuestaoAtual);
    } else {
        finalizarJogo();
    }
}

// ==========================================
// 7. FUNÇÕES AUXILIARES
// ==========================================
function habilitarAlternativas(status) {
    const opcaoEscolhida = !status; // Inverte o valor (true vira false)
    primeiraOpcao.disabled = opcaoEscolhida;
    segundaOpcao.disabled = opcaoEscolhida;
    terceiraOpcao.disabled = opcaoEscolhida;
    quartaOpcao.disabled = opcaoEscolhida;
}

function desmarcarRadioButtons() {
    const options = document.getElementsByName("option");
    for (let i = 0; i < options.length; i++) {
        options[i].checked = false;
    }
}

function limparCoresBackgroundOpcoes() {
    const labels = document.querySelectorAll('.opcao-container');
    labels.forEach(l => l.classList.remove("text-danger-with-bg", "text-success-with-bg"));
}

// ==========================================
// 8. FINALIZAR E MOSTRAR O RESULTADO
// ==========================================
function finalizarJogo() {
    document.getElementById('jogo').style.display = "none";
    document.getElementById('pontuacao').style.display = "none";
    document.getElementById('msgFinal').style.display = "block";
    
    // Descobre qual estilo teve a maior pontuação
    let estiloVencedor = "Clássico";
    let maiorPontuacao = -1;
    
    for (let estilo in pontos) {
        if (pontos[estilo] > maiorPontuacao) {
            maiorPontuacao = pontos[estilo];
            estiloVencedor = estilo;
        }
    }

    // Monta a mensagem final
    let texto = `Seu estilo é: <strong>${estiloVencedor}</strong>`;
    document.getElementById('msgFinal').innerHTML = texto;

    // Salva no banco (Conectado com a Dashboard)
    salvarNoBanco(estiloVencedor, maiorPontuacao);
}

function tentarNovamente() {
    window.location.reload();
}

// ==========================================
// 9. CONEXÃO COM O BANCO DE DADOS / DASHBOARD
// ==========================================
function salvarNoBanco(estilo, pontuacao) {
    const idUsuario = localStorage.getItem('idUsuario');
    
    // Se o usuário não estiver logado, avisa (mas não bloqueia o teste)
    if (!idUsuario) {
        console.warn("Aviso: Usuário não está logado. Salvando sem ID.");
    }

    fetch('/quiz/salvar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fk_usuario: idUsuario || 1, // Usa 1 se estiver testando sem login
            estilo_escolhido: estilo,
            pontuacao: pontuacao
        })
    })
    .then(r => {
        if(r.ok) console.log("✅ Salvo no banco com sucesso!");
    })
    .catch(e => console.error("❌ Erro ao conectar com o servidor:", e));
}