'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
<<<<<<< HEAD
    await queryInterface.createTable('officer-role', {
=======
    await queryInterface.createTable('roles', {
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
<<<<<<< HEAD
      officer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'officers', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('officer-role');
=======
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isAlpha: true
        }
      }
    }, {
      modelName: 'role',
      timestamps: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles');
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
  }
};