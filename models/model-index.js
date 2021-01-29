module.exports = async function () {
    const {Sequelize, DataTypes, Op} = require('sequelize');
    const sequelize = new Sequelize(process.env.APP_DATABASE, process.env.APP_USER, process.env.APP_PASSWORD, {
        dialect: process.env.APP_DIALECT,
        host: process.env.APP_HOST,
        logging: false
    });
    
    const member = await require('./model-member')(sequelize)
    const book = await require(`./model-books`)(sequelize)
    const order = await require(`./model-order`)(sequelize)

    await member.hasOne(order, {foreignKey: 'member_id'});
    await order.belongsTo(member, {foreignKey: 'member_id'});
    await book.hasOne(order, {foreignKey: 'book_id'});
    await order.belongsTo(book, {foreignKey: 'book_id'});

    return {member, sequelize, book, order}
}