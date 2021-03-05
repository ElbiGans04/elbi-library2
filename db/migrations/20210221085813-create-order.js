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
<<<<<<< HEAD
        type: Sequelize.STRING
=======
        type: Sequelize.STRING,
        allowNull: false
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
      },
      
      return_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      
      order_day: {
        type: Sequelize.INTEGER,
<<<<<<< HEAD
=======
        allowNull: false,
        validate: {
          isNumeric: true
        }
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
      },
      
      order_price: {
        type: Sequelize.STRING,
<<<<<<< HEAD
        allowNull: false
      },
      
      order_date: {
        type: Sequelize.BIGINT(20)
=======
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
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
      },
      
      order_officer_buy : {
        type: Sequelize.STRING
      },
      
      order_officer_return : {
        type: Sequelize.STRING
      }
<<<<<<< HEAD
=======
    }, {
      modelName: 'order',
      timestamps: false
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};