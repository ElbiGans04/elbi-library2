'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      let root = await queryInterface.bulkInsert('officers', [{email: 'root@gmail.com', password: 'v6nPZnCrdcgRaic4lHYf8WY1NSLdykrTKZiB1A/7eB0='}])
      await queryInterface.bulkInsert('officer_role', [{roleId: 1, officerId: root}])
      let fael = await queryInterface.bulkInsert('officers', [{email: 'rhafaelbijaksana04@gmail.com', password: 'v6nPZnCrdcgRaic4lHYf8WY1NSLdykrTKZiB1A/7eB0='}])
      await queryInterface.bulkInsert('officer_role', [{roleId: 2, officerId: fael}])
      let elbi = await queryInterface.bulkInsert('officers', [{email: 'elbijr2@gmail.com', password: 'v6nPZnCrdcgRaic4lHYf8WY1NSLdykrTKZiB1A/7eB0='}])
      await queryInterface.bulkInsert('officer_role', [{roleId: 3, officerId: elbi}])
      
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('officers', null, {});
  }
};
