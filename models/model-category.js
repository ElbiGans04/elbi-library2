const { DataTypes } = require('sequelize');
const db = require('./model-index');
module.exports = db.define('category', {
        name: DataTypes.STRING
    }, {
        timestamps: false
})