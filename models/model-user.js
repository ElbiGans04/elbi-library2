module.exports = async function (sequelize) {
    const { DataTypes } = require("sequelize")
    const member = await sequelize.define('user', {
        nisn: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });



    // Return Model
    return member
}