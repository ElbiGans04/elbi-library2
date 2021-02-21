const { DataTypes } = require('sequelize');
const db = require('./model-index');
module.exports = db.define('publisher', {
    name: DataTypes.STRING
}, {timestamps: false});