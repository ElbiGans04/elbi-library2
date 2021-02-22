'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('abouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appName: Sequelize.STRING,
      start: Sequelize.STRING,
      end: Sequelize.STRING,
      author: Sequelize.STRING,
      dbms: Sequelize.STRING,
      language: Sequelize.STRING,
      framework: Sequelize.STRING,
      fines: Sequelize.INTEGER
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('abouts');
  }
};