const { DataTypes, STRING } = require('sequelize');
const db = require('./model-index');
module.exports = db.define('class', {
    name: STRING
})