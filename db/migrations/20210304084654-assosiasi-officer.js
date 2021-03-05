'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('officer_role', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }
    });

    await queryInterface.addColumn(
        'officer_role', // name of Target model
        'roleId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'roles', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
    );
    await queryInterface.addColumn(
        'officer_role', // name of Target model
        'officerId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'officers', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
    );
    await queryInterface.addColumn(
        'forgets', // name of Target model
        'officer_id', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'officers', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('officer_role');
  }
};