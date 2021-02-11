module.exports = async function () {
    const {Sequelize, DataTypes, Op} = require('sequelize');
    const sequelize = new Sequelize(process.env.APP_DATABASE, process.env.APP_USER, process.env.APP_PASSWORD, {
        dialect: process.env.APP_DIALECT,
        host: process.env.APP_HOST,
        logging: false
    });

    
    const user = await require('./model-user')(sequelize);
    const book = await require(`./model-books`)(sequelize);
    const order = await require(`./model-order`)(sequelize);
    const forget = await require(`./model-forget`)(sequelize);
    const officer = await require(`./model-officer`)(sequelize);
    const role = await require(`./model-role`)(sequelize);
    const userClass = await require(`./model-class`)(sequelize);

    // Assosiasi User dengan order
    await user.hasMany(order, {
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'NO ACTION'
    });
    await order.belongsTo(user, {foreignKey: 'user_id'});
    
    // assosiasi officer lupa
    await officer.hasMany(forget, {
        foreignKey: 'officer_id',
        onDelete: 'RESTRICT',
        onUpdate: 'NO ACTION'
    });
    await forget.belongsTo(officer, {foreignKey: 'officer_id'});

    // Assosiasi Buku
    await book.hasOne(order, {
        foreignKey: 'book_id',
        onDelete: 'RESTRICT',
        onUpdate: 'NO ACTION'
    });
    await order.belongsTo(book, {foreignKey: 'book_id'});



    // Assosiasi officer dengan role    
    await role.belongsToMany(officer, { through: 'officer_role', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
    await officer.belongsToMany(role, { through: 'officer_role', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
    
    // assosiasi user dengan class
    await userClass.belongsToMany(user, { through: 'user_class', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
    await user.belongsToMany(userClass, { through: 'user_class', onUpdate: 'CASCADE', onDelete: 'CASCADE'});

    return {sequelize, Op ,officer, user, book, order, forget, role, userClass}
}