const { DataTypes } = require('sequelize');
module.exports = ( sequelize ) => {
    return sequelize.define('category', {
        name: DataTypes.STRING
    }, {
        timestamps: false
    })
}