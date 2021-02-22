'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('publishers', [{name: 'erlangga'}])
      
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('publishers', null, {});
  }
};
