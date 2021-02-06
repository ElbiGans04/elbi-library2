module.exports = function( sequelize ) {
    const { DataTypes } = require('sequelize');
    return sequelize.define('forget', {
        token: {
            type: DataTypes.STRING
        },

        tokenExp: {
            type: DataTypes.BIGINT(20)
        }
    }, {
        timestamps: false
    })
}