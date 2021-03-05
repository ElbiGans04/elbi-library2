'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_report', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }
    });

    await queryInterface.addColumn(
        'user_report', // name of Target model
        'reportId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'reports', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
    );
    await queryInterface.addColumn(
        'user_report', // name of Target model
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


    await queryInterface.createTable('book_report', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }
    });

    await queryInterface.addColumn(
        'book_report', // name of Target model
        'reportId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'reports', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
    );
    await queryInterface.addColumn(
        'book_report', // name of Target model
        'bookId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'books', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_report');
    await queryInterface.dropTable('book_report');
  }
};