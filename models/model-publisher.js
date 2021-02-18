const { DataTypes } = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('publisher', {
        name: DataTypes.STRING
    })
}