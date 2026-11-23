// ==========================================
// 1. IMPORTAÇÃO DAS BIBLIOTECAS
// ==========================================
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // IMPORTANTE: Permite que o HTML acesse o Node.js

const app = express();

// ==========================================
// 2. CONFIGURAÇÕES DO SERVIDOR (MIDDLEWARES)
// ==========================================
app.use(express.json()); // Avisa o servidor que ele vai receber dados em JSON
app.use(cors()); // Libera o acesso para o seu front-end (Live Server)

// ==========================================
// 3. CONEXÃO COM O BANCO DE DADOS
// ==========================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'fashionLux',
    password: 'fashionLux@123', // <--- COLOQUE A SENHA DO SEU MYSQL AQUI
    database: 'fashion'
});

// ==========================================
// 4. ROTAS DE USUÁRIOS (CADASTRO E LOGIN)
// ==========================================

// ROTA DE CADASTRO
app.post('/usuario/cadastrar', (req, res) => {
    // Pega os dados que o front-end (cadastro.html) enviou
    const { nomeServer, emailServer, senhaServer } = req.body;
    
    // Query SQL para inserir no banco
    const sql = "INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)";
    
    // Executa a query passando os valores (o '?' evita SQL Injection)
    db.query(sql, [nomeServer, emailServer, senhaServer], (err, result) => {
        if (err) {
            // Se der erro (ex: e-mail já existe), retorna status 400
            return res.status(400).send("E-mail já cadastrado ou erro no banco.");
        }
        // Se der certo, retorna status 201 (Criado)
        res.status(201).send("Cadastro realizado com sucesso!");
    });
});

// ROTA DE LOGIN
app.post('/usuario/autenticar', (req, res) => {
    const { emailServer, senhaServer } = req.body;
    
    // Busca o usuário no banco que tenha esse email e senha
    const sql = "SELECT id, nome, email FROM usuario WHERE email = ? AND senha = ?";
    
    db.query(sql, [emailServer, senhaServer], (err, results) => {
        if (err) return res.status(500).send("Erro no servidor.");
        
        // Se a lista vier vazia, significa que não achou o usuário
        if (results.length === 0) {
            return res.status(401).send("E-mail ou senha incorretos.");
        }
        
        // Se achou, retorna os dados do usuário em JSON
        // O front-end vai salvar esse ID para usar no Quiz
        res.json(results[0]); 
    });
});

// ==========================================
// 5. ROTAS DO QUIZ
// ==========================================

// SALVAR RESULTADO DO QUIZ
app.post('/api/quiz/salvar', (req, res) => {
    const { fk_usuario, estilo_escolhido, pontuacao } = req.body;
    
    const sql = "INSERT INTO resultados_quiz (fk_usuario, estilo_escolhido, pontuacao) VALUES (?, ?, ?)";
    
    db.query(sql, [fk_usuario, estilo_escolhido, pontuacao], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send("Salvo com sucesso!");
    });
});

// ==========================================
// 6. ROTAS DA DASHBOARD
// ==========================================

// ROTA: Alimentar o Gráfico de Rosca (Pessoas por estilo)
app.get('/api/dashboard/estilos', (req, res) => {
    const sql = "SELECT estilo_escolhido, COUNT(*) as total FROM resultados_quiz GROUP BY estilo_escolhido";
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        // Retorna ex: [{estilo_escolhido: 'Clássico', total: 18}, ...]
        res.json(results); 
    });
});

// ROTA: Alimentar o Gráfico de Linha (Quizzes por dia - TEMPO REAL)
app.get('/api/dashboard/quizzes-tempo-real', (req, res) => {
    // Agrupa os resultados por dia e conta quantos quizzes foram feitos
    const sql = `
        SELECT DATE_FORMAT(data_realizacao, '%d/%m') as momento_grafico, COUNT(*) as quantidade 
        FROM resultados_quiz 
        GROUP BY DATE(data_realizacao) 
        ORDER BY data_realizacao ASC LIMIT 7
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results); 
    });
});

// ROTA: Alimentar os Cards (KPIs) do topo da Dashboard
app.get('/api/dashboard/kpis', (req, res) => {
    // 1. Conta o total de usuários cadastrados
    const sqlUsuario = "SELECT COUNT(*) as total FROM usuario";
    // 2. Conta o total de quizzes feitos
    const sqlQuizzes = "SELECT COUNT(*) as total FROM resultados_quiz";

    db.query(sqlUsuario, (err, resUsuario) => {
        if (err) return res.status(500).send(err);
        
        db.query(sqlQuizzes, (err, resQuizzes) => {
            if (err) return res.status(500).send(err);
            
            // Retorna um objeto com os dois totais
            res.json({
                totalUsuario: resUsuario[0].total,
                totalQuizzes: resQuizzes[0].total
            });
        });
    });
});

// ==========================================
// 7. INICIALIZAÇÃO DO SERVIDOR
// ==========================================
app.listen(3000, () => console.log("Servidor rodando na porta 3000"));