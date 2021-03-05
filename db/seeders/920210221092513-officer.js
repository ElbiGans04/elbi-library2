"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("officers", [
      {
        email: "root@gmail.com",
        password: "v6nPZnCrdcgRaic4lHYf8WY1NSLdykrTKZiB1A/7eB0=",
      },
      {
        email: "rhafaelbijaksana04@gmail.com",
        password: "v6nPZnCrdcgRaic4lHYf8WY1NSLdykrTKZiB1A/7eB0=",
      },
      {
        email: "admin@gmail.com",
        password: "v6nPZnCrdcgRaic4lHYf8WY1NSLdykrTKZiB1A/7eB0=",
      },
    ]);
    await queryInterface.bulkInsert("officer_role", [
      {
        roleId: 1,
        officerId: 1,
      },
      {
        roleId: 2,
        officerId: 2,
      },
      {
        roleId: 3,
        officerId: 3,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("officers", null, {});
  },
};
