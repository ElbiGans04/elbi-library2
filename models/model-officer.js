const db = require('./model-index');
const {DataTypes} = require('sequelize');
module.exports = db.define('officer', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {timestamps: false})