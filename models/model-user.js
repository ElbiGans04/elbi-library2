module.exports = async function (sequelize) {
    const { DataTypes } = require("sequelize")
    const member = await sequelize.define('member', {
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
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