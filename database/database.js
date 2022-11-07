const Sequelize = require('sequelize');

//conectar o BD
//'nome do banco de dados', 'servidor', 'senha do servidor'
const connection = new Sequelize('guiaperguntas', 'root', 'Ufp@197713', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;