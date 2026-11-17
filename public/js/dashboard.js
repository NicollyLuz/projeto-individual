// Variáveis globais dos gráficos
let chartRosca;
let chartLinha;

// Função de logout
function logout() {
    sessionStorage.clear(); // Limpa os dados do usuário
    window.location.href = "login.html";
}

// Mostra o nome do usuário logado na tela
window.onload = function() {
    const nome = sessionStorage.NOME_USUARIO || "visitante";
    document.getElementById('nomeUsuario').innerText = `Olá, ${nome}!`;
    
    inicializarGraficos();
    carregarDadosDashboard();
    
    // Atualiza a cada 5 segundos (tempo real)
    setInterval(carregarDadosDashboard, 5000);
};

// Cria os gráficos vazios
function inicializarGraficos() {
    const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
    chartRosca = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#5c1324', '#a63d55', '#d17a8a', '#e8b4be', '#f2d5d5'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    const ctxLine = document.getElementById('lineChart').getContext('2d');
    chartLinha = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Quizzes',
                data: [],
                borderColor: '#5c1324',
                backgroundColor: 'rgba(92, 19, 36, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#5c1324',
                pointRadius: 4,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
    });
}

// Busca os dados no Node.js e atualiza a tela
function carregarDadosDashboard() {
    fetch('http://localhost:3000/api/dashboard/dados') // <-- URL DO NODE
        .then(response => response.json())
        .then(dados => {
            
            // 1. Atualizar os Cards (KPIs)
            document.getElementById('kpiTotalQuizzes').innerText = dados.totalQuizzes;
            document.getElementById('kpiTotalUsuarios').innerText = dados.totalUsuarios;
            
            // Calcular porcentagem de quem fez o quiz
            let porcentagem = 0;
            if (dados.totalUsuarios > 0) {
                porcentagem = Math.round((dados.totalQuizzes / dados.totalUsuarios) * 100);
            }
            document.getElementById('kpiPorcentagem').innerText = porcentagem + "%";
            document.getElementById('barraProgresso').style.width = porcentagem + "%";

            // Descobrir o estilo mais votado
            if (dados.estilos.length > 0) {
                // Ordena do mais votado para o menos
                const estilosOrdenados = dados.estilos.sort((a, b) => b.total - a.total);
                const maisVotado = estilosOrdenados[0];
                document.getElementById('kpiEstiloMaisVotado').innerText = maisVotado.estilo_escolhido;
                document.getElementById('kpiEstiloDesc').innerText = `${maisVotado.total} votos`;
            }

            // 2. Atualizar Gráfico de Rosca
            chartRosca.data.labels = dados.estilos.map(item => item.estilo_escolhido);
            chartRosca.data.datasets[0].data = dados.estilos.map(item => item.total);
            chartRosca.update();

            // 3. Atualizar Gráfico de Linha
            chartLinha.data.labels = dados.porDia.map(item => item.momento_grafico);
            chartLinha.data.datasets[0].data = dados.porDia.map(item => item.quantidade);
            chartLinha.update();
        })
        .catch(error => console.error("Erro ao buscar dados da dashboard:", error));
}