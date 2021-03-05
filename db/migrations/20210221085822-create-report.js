'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_transaction: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      date: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      price: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    }, {
      modelName: 'report',
      timestamps: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reports');
  }
};