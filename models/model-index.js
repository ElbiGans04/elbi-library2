module.exports = async function () {
    const {Sequelize, DataTypes, Op} = require('sequelize');
    const sequelize = new Sequelize('elbi-library2', 'root', '', {
        dialect: 'mysql',
        host: 'localhost',
        logging: false
    });
    
    const member = await require('./model-member')(sequelize)
    return {member, sequelize}
}