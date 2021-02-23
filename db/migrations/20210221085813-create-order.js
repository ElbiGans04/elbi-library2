'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_transaction: {
        type: Sequelize.STRING
      },
      
      return_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      
      order_day: {
        type: Sequelize.INTEGER,
      },
      
      order_price: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      order_date: {
        type: Sequelize.BIGINT(20)
      },
      
      order_officer_buy : {
        type: Sequelize.STRING
      },
      
      order_officer_return : {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};