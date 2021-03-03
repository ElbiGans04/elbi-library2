const { DataTypes } = require('sequelize');
const db = require('./model-index');
module.exports = db.define('forget', {
    token: {
        type: DataTypes.STRING
    },
    
    tokenExp: {
        type: DataTypes.BIGINT(20)
    }
}, {
    timestamps: false
})