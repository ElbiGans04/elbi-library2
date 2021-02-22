'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('officers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
        name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      
      email: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
              isEmail: true
          }
      },
      
      password: {
          type: Sequelize.STRING,
          allowNull: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('officers');
  }
};