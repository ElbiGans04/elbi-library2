'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('books', [{
          book_image: '/assets/img/tmp/1614588324846-elbiLibrary-gambar2.jpg',
          book_price: 3000,
          book_stock: 10,
          book_title: 'fael ganteng',
          book_launching: '20210212',
          book_author: 'rhafael bijaksana',
          book_page_thickness: '125',
          book_isbn: '2390022',
      }]);

      await queryInterface.bulkInsert('book_category', [{
          bookId: 1,
          categoryId: 1,
<<<<<<< HEAD
          updatedAt: new Date(),
          createdAt: new Date()
=======
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
      }]);

      await queryInterface.bulkInsert('book_publisher', [{
          bookId: 1,
<<<<<<< HEAD
          updatedAt: new Date(),
          createdAt: new Date(),
=======
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
          publisherId: 1
      }]);
      
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('books', null, {});
  }
};
