module.exports = function ( sequelize ) {
    const {DataTypes} = require('sequelize');

    return sequelize.define('officer', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    }, {
        timestamps: false
    });

}