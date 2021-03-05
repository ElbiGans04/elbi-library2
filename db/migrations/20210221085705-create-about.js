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
<<<<<<< HEAD
      appName: Sequelize.STRING,
      start: Sequelize.STRING,
      end: Sequelize.STRING,
      author: Sequelize.STRING,
      dbms: Sequelize.STRING,
      language: Sequelize.STRING,
      framework: Sequelize.STRING,
      fines: Sequelize.INTEGER
=======
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
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('abouts');
  }
};