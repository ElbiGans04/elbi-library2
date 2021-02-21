const db = require('./model-index');
const {DataTypes} = require('sequelize');


// Export
module.exports = db.define('user', {
    nisn: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});