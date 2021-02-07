const { DataTypes } = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('role', {
        name: DataTypes.STRING
    }, {
        timestamps: false
    })
}