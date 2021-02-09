const { DataTypes, STRING } = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('class', {
        name: STRING
    })
}