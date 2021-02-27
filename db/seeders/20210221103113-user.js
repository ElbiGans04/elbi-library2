'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{name: 'abdu rohman', nisn: 1029101}, {name: 'fiky', nisn: 2901920}]);
    await queryInterface.bulkInsert('user_class', [{classId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date()}, {classId: 2, userId: 2,  createdAt: new Date(), updatedAt: new Date()},]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {}, {})
    await queryInterface.bulkDelete('user_class', {}, {})
  }
};
