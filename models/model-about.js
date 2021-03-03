const db = require('./model-index');
const { DataTypes } = require('sequelize');
module.exports = db.define('about', {
    appName: DataTypes.STRING(1000),
    start: DataTypes.STRING(1000),
    end: DataTypes.STRING(1000),
    author: DataTypes.STRING(1000),
    dbms: DataTypes.STRING(1000),
    language: DataTypes.STRING(1000),
    framework: DataTypes.STRING(1000),
    fines: DataTypes.INTEGER

})