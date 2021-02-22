'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.bulkInsert('classes', [{name: '12 rpl 1'}, {name: '12 rpl 2'}, {name: '12 rpl 3'}])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('classes', {}, {})
  }
};
