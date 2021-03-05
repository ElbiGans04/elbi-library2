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
        type: Sequelize.STRING,
        allowNull: false
      },
      
      return_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      
      order_day: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      
      order_price: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      
      order_date: {
        type: Sequelize.BIGINT,
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      
      order_officer_buy : {
        type: Sequelize.STRING
      },
      
      order_officer_return : {
        type: Sequelize.STRING
      }
    }, {
      modelName: 'order',
      timestamps: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};