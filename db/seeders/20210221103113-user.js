'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{name: 'abdu rohman', nisn: 1029101}, {name: 'fiky', nisn: 2901920}]);
<<<<<<< HEAD
    await queryInterface.bulkInsert('user_class', [{classId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date()}, {classId: 2, userId: 2,  createdAt: new Date(), updatedAt: new Date()},]);
=======
    await queryInterface.bulkInsert('user_class', [{classId: 1, userId: 1, }, {classId: 2, userId: 2,  },]);
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {}, {})
    await queryInterface.bulkDelete('user_class', {}, {})
  }
};
