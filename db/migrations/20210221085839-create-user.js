'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log(queryInterface)
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nisn: {
        type: Sequelize.INTEGER,
        allowNull: false
      }, 
      name: {
          type: Sequelize.STRING,
          allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};