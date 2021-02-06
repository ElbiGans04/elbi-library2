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
    const forget = await require(`./model-forget`)(sequelize)

    await member.hasOne(order, {
        foreignKey: 'member_id',
        onDelete: 'RESTRICT',
        onUpdate: 'NO ACTION'
    });
    await order.belongsTo(member, {foreignKey: 'member_id'});
    
    await book.hasOne(order, {
        foreignKey: 'book_id',
        onDelete: 'RESTRICT',
        onUpdate: 'NO ACTION'
    });
    await order.belongsTo(book, {foreignKey: 'book_id'});

    await member.hasOne(forget, {
        foreignKey: 'member_id',
        onDelete: 'RESTRICT',
        onUpdate: 'NO ACTION'
    });
    await forget.belongsTo(member, {foreignKey: 'member_id'});

    return {member, sequelize, book, order, forget, Op}
}