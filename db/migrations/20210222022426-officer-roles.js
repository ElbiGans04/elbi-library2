
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('officer-role', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      officer_id: {
        type: Sequelize.INTERGER,
          // references: {
          //   model: 'officers', // name of Target model
          //   key: 'id', // key in Target model that we're referencing
          // },
          // onUpdate: 'CASCADE',
          // onDelete: 'CASCADE'
      },
      role_id: {
        type: Sequelize.INTERGER,
          // references: {
          //   model: 'roles', // name of Target model
          //   key: 'id', // key in Target model that we're referencing
          // },
          // onUpdate: 'CASCADE',
          // onDelete: 'CASCADE'
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('officer-role');
  }
};