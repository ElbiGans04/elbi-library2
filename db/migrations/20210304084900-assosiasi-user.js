'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_class', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    });

    await queryInterface.addColumn(
        'user_class', // name of Target model
        'userId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'users', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
    );
    await queryInterface.addColumn(
        'user_class', // name of Target model
        'classId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'classes', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
    );


    
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_class');
  }
};