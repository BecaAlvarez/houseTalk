const Sequelize = require('sequelize');

//conectar o BD

const connection = new Sequelize('nome do banco de dados', 'servidor', 'senha do servidor', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;
