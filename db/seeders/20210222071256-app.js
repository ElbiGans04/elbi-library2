"use strict";
const ModuleLibrary = require("../../controllers/module");
const moduleLibrary = new ModuleLibrary();
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "abouts",
      [
        {
          appName: moduleLibrary.encryptPub("Elbi library"),
          start: moduleLibrary.encryptPub("18 January 2021"),
          end: moduleLibrary.encryptPub("22 February 2021"),
          author: moduleLibrary.encryptPub("Rhafael Bijaksana"),
          dbms: moduleLibrary.encryptPub("postgreSql"),
          framework: moduleLibrary.encryptPub("Express"),
          language: moduleLibrary.encryptPub("Node Js"),
          fines: 1000,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("abouts", null, {});
  },
};
