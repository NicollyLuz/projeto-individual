// ==========================================
// 1. NAVEGAÇÃO ENTRE AS TELAS (Visão geral / Estilos)
// ==========================================
function mudarTela(telaAlvo) {
    document.querySelectorAll('.tela').forEach(tela => tela.classList.remove('ativa'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    if (telaAlvo === 'visaoGeral') {
        document.getElementById('tela-visaoGeral').classList.add('ativa');
        document.getElementById('btnVisaoGeral').classList.add('active');
    } else if (telaAlvo === 'estilos') {
        document.getElementById('tela-estilos').classList.add('ativa');
        document.getElementById('btnEstilos').classList.add('active');
    }
}

// ==========================================
// 2. BUSCAR DADOS DO BANCO (Via Node.js)
// ==========================================
async function carregarDadosDoBanco() {
    try {
        // AQUI ESTÁ A MUDANÇA: Chama a rota que criamos no index.js
        const resposta = await fetch('/dados-dashboard');
        
        if (!resposta.ok) throw new Error('Falha na resposta do servidor');
        
        const dados = await resposta.json();
        renderizarDashboard(dados);

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        alert("Não foi possível carregar os dados do banco de dados. Verifique se o servidor está rodando.");
    }
}

// ==========================================
// 3. PREENCHER A TELA COM OS DADOS REAIS
// ==========================================
function renderizarDashboard(dados) {
    // Nome do usuário logado (Pega do localStorage que o login salvou)
    const nomeSalvo = localStorage.getItem('nomeUsuario') || 'Visitante';
    document.getElementById("nomeUsuario").innerText = "Olá, " + nomeSalvo + "!";

    // --- TELA 1: VISÃO GERAL ---
    document.getElementById("kpiTotalQuizzes").innerText = dados.totalQuizzes;
    document.getElementById("kpiTotalUsuarios").innerText = dados.totalUsuarios;
    document.getElementById("kpiEstiloMaisVotado").innerText = dados.estiloMaisVotado;
    document.getElementById("kpiPorcentagem").innerText = dados.porcentagemEngajamento;
    
    // Atualiza a barrinha de progresso rosa
    document.getElementById("barraProgresso").style.width = dados.porcentagemEngajamento;

    // --- TELA 2: ESTILOS (RANKING) ---
    const ranking = dados.ranking;
    
    if (ranking.length > 0) {
        document.getElementById("kpiLider").innerText = ranking[0].nome;
        document.getElementById("kpiLiderDesc").innerText = ranking[0].porcentagem + " dos leitores";
        
        const ultimo = ranking[ranking.length - 1];
        document.getElementById("kpiMenosVotado").innerText = ultimo.nome;
        document.getElementById("kpiMenosVotadoDesc").innerText = ultimo.porcentagem + " dos leitores";
        
        document.getElementById("kpiQtdEstilos").innerText = ranking.length;
    } else {
        document.getElementById("kpiLider").innerText = "-";
        document.getElementById("kpiLiderDesc").innerText = "Aguardando respostas";
        document.getElementById("kpiMenosVotado").innerText = "-";
        document.getElementById("kpiMenosVotadoDesc").innerText = "Aguardando respostas";
        document.getElementById("kpiQtdEstilos").innerText = "0";
    }

    // Preenche a lista do Ranking
    const containerRanking = document.getElementById("listaRanking");
    containerRanking.innerHTML = "";
    
    if (ranking.length === 0) {
        containerRanking.innerHTML = "<p style='color:#888; font-size:0.9rem;'>Nenhum quiz respondido ainda.</p>";
    } else {
        ranking.forEach((item, index) => {
            containerRanking.innerHTML += `
                <div class="ranking-item">
                    <div class="rank-number">${index + 1}º</div>
                    <div class="rank-info">
                        <div class="rank-header">
                            <span class="rank-name">${item.nome}</span>
                            <span class="rank-votes">${item.votos}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${item.porcentagem};"></div>
                        </div>
                        <span class="rank-percent">${item.porcentagem}</span>
                    </div>
                </div>
            `;
        });
    }

    // --- TABELA DE ÚLTIMOS RESULTADOS ---
    const corpoTabela = document.getElementById("corpoTabela");
    corpoTabela.innerHTML = "";

    if (dados.ultimosResultados.length === 0) {
        corpoTabela.innerHTML = "<tr><td colspan='3' style='text-align:center; color:#888;'>Nenhum resultado recente.</td></tr>";
    } else {
        dados.ultimosResultados.forEach(item => {
            // Formata a data
            const dataObj = new Date(item.data_realizacao);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            // Cria a classe da cor baseada no estilo
            const classeBadge = item.estilo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            corpoTabela.innerHTML += `
                <tr>
                    <td>${item.leitora}</td>
                    <td><span class="badge badge-${classeBadge}">${item.estilo}</span></td>
                    <td>${dataFormatada}</td>
                </tr>
            `;
        });
    }
}

// ==========================================
// 4. AÇÕES
// ==========================================
function fazerLogout() {
    if (confirm("Deseja realmente sair do painel?")) {
        localStorage.removeItem('nomeUsuario');
        window.location.href = "login.html"; // Redireciona para a tela de login
    }
}

// Inicia a busca assim que a página carregar
window.onload = carregarDadosDoBanco;