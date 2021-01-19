module.exports = async function (sequelize) {
    const { DataTypes } = require("sequelize")
    const member = await sequelize.define('table-member', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        email: {
            type: DataTypes.STRING,
            isEmail: true,
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });



    // Return Model
    return member
}