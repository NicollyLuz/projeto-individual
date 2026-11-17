// 1. PERGUNTAS ADAPTADAS PARA O TEMA
const listaDeQuestoes = [
    { pergunta: "Qual estilo prioriza peças atemporais e alfaiataria?", alternativaA: "Street", alternativaB: "Clássico", alternativaC: "Minimalista", alternativaD: "Esportivo", alternativaCorreta: "alternativaB" },
    { pergunta: "Qual estilo é marcado por roupas largas e cultura urbana?", alternativaA: "Elegante", alternativaB: "Minimalista", alternativaC: "Street", alternativaD: "Clássico", alternativaCorreta: "alternativaC" },
    { pergunta: "Qual estilo foca no 'menos é mais' e cores neutras?", alternativaA: "Minimalista", alternativaB: "Esportivo", alternativaC: "Street", alternativaD: "Elegante", alternativaCorreta: "alternativaA" },
    { pergunta: "Qual estilo une conforto e tecidos tecnológicos?", alternativaA: "Clássico", alternativaB: "Elegante", alternativaC: "Minimalista", alternativaD: "Esportivo", alternativaCorreta: "alternativaD" },
    { pergunta: "Qual estilo valoriza sofisticação e tecidos nobres?", alternativaA: "Street", alternativaB: "Esportivo", alternativaC: "Elegante", alternativaD: "Clássico", alternativaCorreta: "alternativaC" }
];

let numeroDaQuestaoAtual = 0;
let pontuacaoFinal = 0;
let tentativaIncorreta = 0;
let certas = 0;
let erradas = 0;
let quantidadeDeQuestoes = listaDeQuestoes.length;

function onloadEsconder() {
    document.getElementById('pontuacao').style.display = "none";
    document.getElementById('jogo').style.display = "none";
}

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

function preencherHTMLcomQuestaoAtual(index) {
    habilitarAlternativas(true);
    const questaoAtual = listaDeQuestoes[index];
    numeroDaQuestaoAtual = index;
    document.getElementById("spanNumeroDaQuestaoAtual").innerHTML = Number(index) + 1;
    document.getElementById("spanQuestaoExibida").innerHTML = questaoAtual.pergunta;
    document.getElementById("labelOpcaoUm").innerHTML = questaoAtual.alternativaA;
    document.getElementById("labelOpcaoDois").innerHTML = questaoAtual.alternativaB;
    document.getElementById("labelOpcaoTres").innerHTML = questaoAtual.alternativaC;
    document.getElementById("labelOpcaoQuatro").innerHTML = questaoAtual.alternativaD;
}

function submeter() {
    const options = document.getElementsByName("option");
    let hasChecked = false;
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) { hasChecked = true; break; }
    }

    if (!hasChecked) {
        alert("Não há alternativas escolhidas. Escolha uma opção.");
    } else {
        btnSubmeter.disabled = true;
        btnProx.disabled = false;
        habilitarAlternativas(false);
        checarResposta();
    }
}

function habilitarAlternativas(trueOrFalse) {
    let opcaoEscolhida = trueOrFalse ? false : true;
    primeiraOpcao.disabled = opcaoEscolhida;
    segundaOpcao.disabled = opcaoEscolhida;
    terceiraOpcao.disabled = opcaoEscolhida;
    quartaOpcao.disabled = opcaoEscolhida;
}

function avancar() {
    btnProx.disabled = true;
    btnSubmeter.disabled = false;
    desmarcarRadioButtons();

    if (numeroDaQuestaoAtual < quantidadeDeQuestoes - 1) {
        preencherHTMLcomQuestaoAtual(numeroDaQuestaoAtual);
    } else if (numeroDaQuestaoAtual == quantidadeDeQuestoes - 1) {
        alert("Atenção... a próxima é a ultima questão!");
        preencherHTMLcomQuestaoAtual(numeroDaQuestaoAtual);
    } else {
        finalizarJogo();
    }
    limparCoresBackgroundOpcoes();
}

function tentarNovamente() {
    window.location.reload();
}

function checarResposta() {
    const questaoAtual = listaDeQuestoes[numeroDaQuestaoAtual];
    const respostaQuestaoAtual = questaoAtual.alternativaCorreta;
    const options = document.getElementsByName("option");
    let alternativaCorreta = null;

    options.forEach((option) => {
        if (option.value === respostaQuestaoAtual) {
            alternativaCorreta = option.labels[0].id;
        }
    });

    options.forEach((option) => {
        if (option.checked === true && option.value === respostaQuestaoAtual) {
            document.getElementById(alternativaCorreta).classList.add("text-success-with-bg");
            pontuacaoFinal++;
            certas++;
            document.getElementById("spanCertas").innerHTML = certas;
            numeroDaQuestaoAtual++;
        } else if (option.checked && option.value !== respostaQuestaoAtual) {
            const wrongLabelId = option.labels[0].id;
            document.getElementById(wrongLabelId).classList.add("text-danger-with-bg");
            document.getElementById(alternativaCorreta).classList.add("text-success-with-bg");
            tentativaIncorreta++;
            erradas++;
            document.getElementById("spanErradas").innerHTML = erradas;
            numeroDaQuestaoAtual++;
        }
    });
}

function limparCoresBackgroundOpcoes() {
    const options = document.getElementsByName("option");
    options.forEach((option) => {
        document.getElementById(option.labels[0].id).classList.remove("text-danger-with-bg");
        document.getElementById(option.labels[0].id).classList.remove("text-success-with-bg");
    });
}

function desmarcarRadioButtons() {
    const options = document.getElementsByName("option");
    for (let i = 0; i < options.length; i++) {
        options[i].checked = false;
    }
}

function finalizarJogo() {
    let textoParaMensagemFinal = null;
    let classComCoresParaMensagemFinal = null;
    const porcentagemFinalDeAcertos = pontuacaoFinal / quantidadeDeQuestoes;

    // Define o estilo baseado na pontuação
    let estiloEscolhido = "Clássico"; 
    if (porcentagemFinalDeAcertos >= 0.8) estiloEscolhido = "Elegante";
    else if (porcentagemFinalDeAcertos >= 0.6) estiloEscolhido = "Clássico";
    else if (porcentagemFinalDeAcertos >= 0.4) estiloEscolhido = "Minimalista";
    else estiloEscolhido = "Street";

    if (porcentagemFinalDeAcertos <= 0.3) {
        textoParaMensagemFinal = "Parece que você precisa estudar mais sobre moda...";
        classComCoresParaMensagemFinal = "text-danger-with-bg";
    } else if (porcentagemFinalDeAcertos > 0.3 && porcentagemFinalDeAcertos < 0.9) {
        textoParaMensagemFinal = "Você tem um bom conhecimento!";
        classComCoresParaMensagemFinal = "text-warning-with-bg";
    } else {
        textoParaMensagemFinal = "Uau, você é um expert em moda!";
        classComCoresParaMensagemFinal = "text-success-with-bg";
    }

    textoParaMensagemFinal += "<br> Seu estilo é: <strong>" + estiloEscolhido + "</strong>";
    textoParaMensagemFinal += "<br> Você acertou " + Math.round((porcentagemFinalDeAcertos) * 100) + "% das questões.";

    document.getElementById('msgFinal').innerHTML = textoParaMensagemFinal;
    document.getElementById('msgFinal').classList.add(classComCoresParaMensagemFinal);
    document.getElementById('spanPontuacaoFinal').innerHTML = pontuacaoFinal;
    document.getElementById('jogo').classList.add("text-new-gray");

    btnProx.disabled = true;
    btnSubmeter.disabled = true;
    btnTentarNovamente.disabled = false;

    // SIMULAÇÃO DO ENVIO PARA O BANCO (Para você testar sem back-end)
    alert(`Fim de jogo!\nEstilo: ${estiloEscolhido}\nPontuação: ${pontuacaoFinal}\n\n(Aqui o JavaScript enviaria esses dados para o banco de dados)`);
}