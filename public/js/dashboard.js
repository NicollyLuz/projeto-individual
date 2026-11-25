// ============================================================
// mudarTela(t): alterna entre "Visão geral", "Estilos" e "Quiz"
// ============================================================
function mudarTela(t) {
  // Esconde todas as telas e tira o "active" de todos os botões
  document.querySelectorAll('.tela').forEach(x => x.classList.remove('ativa'));
  document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));

  // Mostra a tela pedida e marca o botão correspondente
  // Ex: t="visaoGeral" → tela-visaoGeral + btnVisaoGeral
  document.getElementById(`tela-${t}`).classList.add('ativa');
  document.getElementById(`btn${t[0].toUpperCase() + t.slice(1)}`).classList.add('active');
}

// ============================================================
// carregar(): busca os dados do banco e manda pro render()
// ============================================================
async function carregar() {
  try {
    const r = await fetch('/dados-dashboard');
    if (r.ok) render(await r.json());
  } catch (e) { console.error(e); }
}

// ============================================================
// render(d): preenche a tela com os dados recebidos
// d = { totalUsuarios, ranking[], ultimos[] }
// ============================================================
function render(d) {
  // Saudação com nome salvo no login
  nomeUsuario.innerText = `Olá, ${localStorage.getItem('nomeUsuario') || 'Visitante'}!`;

  // ---- KPIs ----
  // Conta usuários ÚNICOS que fizeram o quiz (Set remove duplicados)
  const unicos = new Set(d.ultimos.map(i => i.nome)).size;
  // Porcentagem (máx 100%) de cadastrados que fizeram o quiz
  const pct = d.totalUsuarios ? Math.min(100, Math.round(unicos / d.totalUsuarios * 100)) : 0;

  kpiTotalQuizzes.innerText     = unicos;
  kpiTotalUsuarios.innerText    = d.totalUsuarios;
  kpiPorcentagem.innerText      = pct + "%";
  barraProgresso.style.width    = pct + "%";
  kpiEstiloMaisVotado.innerText = d.ranking[0]?.estilo_escolhido || "-";  // ?. = opcional

  // ---- Ranking (lista com barrinhas) ----
  const totalVotos = d.ranking.reduce((s, r) => s + r.votos, 0);
  listaRanking.innerHTML = d.ranking.length === 0
    // Se não tem dados, mostra aviso
    ? "<p style='color:#888;text-align:center;padding:20px'>Nenhum quiz ainda.</p>"
    // Senão, monta um bloco HTML pra cada estilo
    : d.ranking.map((r, i) => {
        const p = totalVotos ? Math.round(r.votos / totalVotos * 100) : 0;
        return `<div class="ranking-item">
          <div class="rank-number">${i + 1}º</div>
          <div class="rank-info">
            <div class="rank-header"><span class="rank-name">${r.estilo_escolhido}</span>
            <span class="rank-votes">${r.votos}</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width:${p}%"></div></div>
            <span class="rank-percent">${p}%</span>
          </div></div>`;
      }).join("");

  // KPI líder e menos votado (.at(-1) = último elemento)
  kpiLider.innerText       = d.ranking[0]?.estilo_escolhido || "-";
  kpiMenosVotado.innerText = d.ranking.at(-1)?.estilo_escolhido || "-";

  // ---- Tabela de últimos resultados ----
  corpoTabela.innerHTML = d.ultimos.length === 0
    ? "<tr><td colspan='3' style='text-align:center;color:#888;padding:20px'>Nenhum resultado.</td></tr>"
    : d.ultimos.map(i => {
        // Formata data como DD/MM HH:MM
        const dt = new Date(i.data_realizacao);
        const data = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) +
                     ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        // Cria classe do badge removendo acentos (Clássico → classico)
        const badge = i.estilo_escolhido.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return `<tr><td>${i.nome}</td>
          <td><span class="badge badge-${badge}">${i.estilo_escolhido}</span></td>
          <td>${data}</td></tr>`;
      }).join("");

  // Desenha/atualiza o gráfico
  grafico(d);
}

// ============================================================
// grafico(d): desenha o gráfico de rosca com Chart.js
// ============================================================
let meuGrafico = null;  // guarda a instância pra poder destruir depois

function grafico(d) {
  if (meuGrafico) meuGrafico.destroy();  // remove o anterior

  const labels = d.ranking.map(r => r.estilo_escolhido);

  meuGrafico = new Chart(graficoRosca, {
    type: 'doughnut',
    data: {
      // Se não tem dados, mostra "Sem dados" cinza
      labels: labels.length ? labels : ['Sem dados'],
      datasets: [{
        data: labels.length ? d.ranking.map(r => r.votos) : [1],
        backgroundColor: labels.length ? ['#5c1324','#a63d55','#d97a7a','#8c7a7a','#e0b0b0'] : ['#f0e6e6'],
        borderWidth: 0
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
  });
}

// ============================================================
// fazerLogout(): limpa o usuário salvo e volta pro login
// ============================================================
function fazerLogout() {
  if (confirm("Deseja realmente sair do painel?")) {
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('idUsuario');
    location.href = "login.html";
  }
}

// ============================================================
// INICIALIZAÇÃO: roda ao carregar + auto-refresh a cada 5s
// ============================================================
window.onload = () => { carregar(); setInterval(carregar, 5000); };