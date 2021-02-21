module.exports = function (sequelize) {
    const { DataTypes } = require('sequelize');

    // kembalikan
    return sequelize.define('about', {
        appName: DataTypes.STRING,
        start: DataTypes.STRING,
        end: DataTypes.STRING,
        author: DataTypes.STRING,
        dbms: DataTypes.STRING,
        language: DataTypes.STRING,
        framework: DataTypes.STRING,
        fines: DataTypes.INTEGER
    })
}