'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('publishers', {
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
      modelName: 'publisher',
      timestamps: false
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('publishers');
  }
};