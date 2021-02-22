'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [{name: 'librarian'}, {name: 'admin'}])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', {}, {})
  }
};
