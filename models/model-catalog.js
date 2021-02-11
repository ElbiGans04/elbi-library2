const { DataTypes } = require('sequelize');
module.exports = ( sequelize ) => {
    return sequelize.define('catalog', {
        name: DataTypes.STRING
    }, {
        timestamps: false
    })
}