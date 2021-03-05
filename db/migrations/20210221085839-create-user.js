'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
<<<<<<< HEAD
    console.log(queryInterface)
=======
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nisn: {
        type: Sequelize.INTEGER,
<<<<<<< HEAD
        allowNull: false
=======
        allowNull: false,
        validate: {
          isNumeric: true
        }
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
      }, 
      name: {
          type: Sequelize.STRING,
          allowNull: false
      }
<<<<<<< HEAD
=======
    }, {
      modelName: 'user',
      timestamps: false
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};