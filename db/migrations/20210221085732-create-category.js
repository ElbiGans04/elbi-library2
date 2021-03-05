'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
<<<<<<< HEAD
        type: Sequelize.STRING
      }
=======
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      modelName: 'category',
      timestamps: false
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('categories');
  }
};