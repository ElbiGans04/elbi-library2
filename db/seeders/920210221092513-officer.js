'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      let fael = await queryInterface.bulkInsert('officers', [{email: 'rhafaelbijaksana04@gmail.com', password: 'v6nPZnCrdcgRaic4lHYf8WY1NSLdykrTKZiB1A/7eB0='}])
      await queryInterface.bulkInsert('officer_role', [{roleId: 1, officerId: fael}])
      let elbi = await queryInterface.bulkInsert('officers', [{email: 'elbijr2@gmail.com', password: 'v6nPZnCrdcgRaic4lHYf8WY1NSLdykrTKZiB1A/7eB0='}])
      await queryInterface.bulkInsert('officer_role', [{roleId: 2, officerId: elbi}])
      
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('officers', null, {});
  }
};
