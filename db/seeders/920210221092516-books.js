'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('books', [{
          book_image: '/assets/img/tmp/1614927127418-elbiLibrary-1614758571821-elbiLibrary-gambar2.jpg',
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
      }]);

      await queryInterface.bulkInsert('book_publisher', [{
          bookId: 1,
          publisherId: 1
      }]);
      
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('books', null, {});
  }
};
