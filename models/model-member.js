module.exports = async function (sequelize) {
    const { DataTypes } = require("sequelize")
    const member = await sequelize.define('member', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate : {
                isAlphanumeric: true,
            }
        },

        role: {
            type: DataTypes.STRING,
            defaultValue: `user`
        }
    });



    // Return Model
    return member
}