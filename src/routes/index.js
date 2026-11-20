var express = require("express");
var router = express.Router();
var database = require("../database/config"); // CONEXÃO COM O BANCO

// Rota da página inicial (a que você já tinha)
router.get("/", function (req, res) {
    res.render("index");
});

// Rota do Dashboard (a que busca os dados no banco)
router.get("/dados-dashboard", async function (req, res) {
    try {
        // 1. Busca quantos usuários existem
        var usuarios = await database.executar("SELECT COUNT(*) as total FROM usuario");
        
        // 2. Busca quantos quizzes foram feitos
        var quizzes = await database.executar("SELECT COUNT(*) as total FROM resultados_quiz");
        
        // 3. Busca o ranking de estilos
        var ranking = await database.executar(`
            SELECT estilo_escolhido, COUNT(*) as votos 
            FROM resultados_quiz 
            GROUP BY estilo_escolhido 
            ORDER BY votos DESC
        `);

        // 4. Busca os últimos resultados
        var ultimos = await database.executar(`
            SELECT u.nome, r.estilo_escolhido, r.data_realizacao 
            FROM resultados_quiz r
            JOIN usuario u ON u.id = r.fk_usuario
            ORDER BY r.data_realizacao DESC LIMIT 5
        `);

        // Envia os dados para o HTML
        res.json({
            totalUsuarios: usuarios[0].total,
            totalQuizzes: quizzes[0].total,
            ranking: ranking,
            ultimos: ultimos
        });

    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: "Erro no banco" });
    }
});

// Rota para o Quiz salvar o resultado no banco
router.post("/quiz/salvar", async function (req, res) {
    try {
        // Pega os dados que o HTML enviou
        var idUsuario = req.body.fk_usuario;
        var estilo = req.body.estilo_escolhido;
        var pontuacao = req.body.pontuacao;

        // Verifica se os dados chegaram
        if (!idUsuario || !estilo) {
            return res.status(400).json({ erro: "Dados incompletos" });
        }

        // Comando SQL para inserir no banco
        var instrucao = `
            INSERT INTO resultados_quiz (fk_usuario, estilo_escolhido, pontuacao) 
            VALUES (${idUsuario}, '${estilo}', ${pontuacao})
        `;

        // Executa no banco
        await database.executar(instrucao);
        
        console.log("Quiz salvo com sucesso!");
        res.json({ mensagem: "Resultado salvo com sucesso!" });

    } catch (erro) {
        console.error("Erro ao salvar quiz:", erro);
        res.status(500).json({ erro: "Erro interno no servidor" });
    }
});

module.exports = router;