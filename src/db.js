import Sequelize from 'sequelize';

const db = new Sequelize('chat_app', 'root', '', {
	host: 'localhost',
	dialect: 'my',
	operatorsAliases: false
});

export default db;