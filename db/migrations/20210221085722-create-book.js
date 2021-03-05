'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
<<<<<<< HEAD
      name: {
        type: Sequelize.STRING
      },
      book_image: {
        type: Sequelize.BLOB('long')
    },
    
    book_type: {
        type: Sequelize.STRING,
        allowNull: false
    },
=======

      book_image: {
        type: Sequelize.STRING,
        allowNull: false
      },
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
    
    book_price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    
    book_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    
    book_title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {      
            // isAlphanumeric: true  
        }
    },
    
    book_launching: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    
    book_author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            // isAlphanumeric: true
        }
    },
    
    book_page_thickness: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    
    book_isbn : {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    }
<<<<<<< HEAD
=======
     
    }, {
        modelName: 'book',
        timestamps: false
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('books');
  }
};