const db = require('./model-index');
const { DataTypes } = require('sequelize');
module.exports = db.define('about', {
    appName: DataTypes.STRING,
    start: DataTypes.STRING,
    end: DataTypes.STRING,
    author: DataTypes.STRING,
    dbms: DataTypes.STRING,
    language: DataTypes.STRING,
    framework: DataTypes.STRING,
    fines: DataTypes.INTEGER

})