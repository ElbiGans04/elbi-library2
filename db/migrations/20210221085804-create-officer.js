'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('officers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
<<<<<<< HEAD
      },
        name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      
=======
      },      
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
      email: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
              isEmail: true
          }
      },
      
      password: {
          type: Sequelize.STRING,
          allowNull: false,
      }
<<<<<<< HEAD
=======
    }, {
      modelName: 'officer',
      timestamps: false
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('officers');
  }
};