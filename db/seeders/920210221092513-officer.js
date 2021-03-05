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
<<<<<<< HEAD
        createdAt: new Date(),
        updatedAt: new Date(),
=======
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
      },
      {
        roleId: 2,
        officerId: 2,
<<<<<<< HEAD
        createdAt: new Date(),
        updatedAt: new Date(),
=======
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
      },
      {
        roleId: 3,
        officerId: 3,
<<<<<<< HEAD
        createdAt: new Date(),
        updatedAt: new Date(),
=======
>>>>>>> 64613cf (memperbaiki error saat menghapus foto dirouter book, mengubah file migrasi, memperbaharui readme, mengembalikan nilai seed pada about)
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("officers", null, {});
  },
};
