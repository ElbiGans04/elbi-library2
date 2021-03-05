'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nisn: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true
        }
      }, 
      name: {
          type: Sequelize.STRING,
          allowNull: false
      }
    }, {
      modelName: 'user',
      timestamps: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};