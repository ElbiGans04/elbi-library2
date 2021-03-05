'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('forgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
<<<<<<< HEAD
        type: Sequelize.STRING
      },
      
      tokenExp: {
          type: Sequelize.BIGINT(20)
      }
=======
        type: Sequelize.STRING(200)
      },
      
      tokenExp: {
          type: Sequelize.BIGINT
      }
    }, {
      modelName: 'forget',
      timestamps: false
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('forgets');
  }
};