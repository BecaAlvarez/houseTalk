const express = require("express"); //importando a biblioteca express
const app = express(); //Criar rotas, rodar aplicação etc..
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");



connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) =>{
        console.log(msgErro);
    })


//Dizendo para express usar o EJS como view engine. Para desenhar em html
app.set('view engine', 'ejs')
//usar a pag para arquivos staticos(xml, css..)
app.use(express.static('public'));


//Permite envie os dados eo bordyparser traduz os dados em uma estrtura em js, decodificar
app.use(bodyParser.urlencoded({extended: false}))

//Permitir ler os dados enviados via json, utilizado para API 
app.use(bodyParser.json());




//Rotas

// Nome da roda, o que faz (requisição e resposta)

//Rota pag inicio
app.get("/", (req, res) => {
    //Equivalente select * from 
    Pergunta.findAll({raw: true, order: [
        ['id', 'DESC']
    ]}).then(perguntas => {//listar as perguntas
        //enviar para o front-eend
        res.render("index", {
            perguntas: perguntas
        });
    });
    
});

//rota pag perguntar
app.get("/perguntar", (req, res)=> {
    res.render("perguntar");
})

app.post("/salvarpergunta", (req, res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    //Insert na tabela pergunta no BD
    Pergunta.create({
        titulo: titulo,
        descricao: descricao,
    }).then(() => {
        res.redirect("/")
    });
});

//Rota das perguntas
app.get("/perguntas/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id},
    }).then(pergunta => {
        if(pergunta != undefined){ // pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then( respostas => {
                res.render("question", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });    
        }else{ //não encontrada
            res.redirect("/");
        }
    })
})

//Rota das resposta
app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId,
    }).then(() =>{
        res.redirect("/perguntas/" + perguntaId);
        
    });
})

//Chamar  servidor: Roda na porta 8080
app.listen(8080, () =>{
    console.log("App rodando");
});


