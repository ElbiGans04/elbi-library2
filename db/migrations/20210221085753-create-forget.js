'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('forgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
      },
      
      tokenExp: {
          type: Sequelize.BIGINT(20)
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('forgets');
  }
};