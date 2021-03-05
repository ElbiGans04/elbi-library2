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
      appName: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      start: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      end: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      dbms: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      language: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      framework: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      fines: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true
        }
      }
    }, {
      modelName: 'about',
      timestamps: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('abouts');
  }
};