'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('book_category', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }
    });

    await queryInterface.addColumn(
        'book_category', // name of Target model
        'categoryId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'categories', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
    );
    await queryInterface.addColumn(
        'book_category', // name of Target model
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

    // Assosiasi 2
    await queryInterface.addColumn(
        'orders', // name of Target model
        'book_id', // name of the key we're adding
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



    // assosiasi 3
    await queryInterface.createTable('book_publisher', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }
    });

    await queryInterface.addColumn(
        'book_publisher', // name of Target model
        'publisherId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'publishers', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
    );
    await queryInterface.addColumn(
        'book_publisher', // name of Target model
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
    await queryInterface.dropTable('book_category');
    await queryInterface.dropTable('book_publisher');
  }
};