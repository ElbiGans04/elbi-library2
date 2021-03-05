"use strict";
const ModuleLibrary = require("../../controllers/module");
const moduleLibrary = new ModuleLibrary();
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "abouts",
      [
        {
          appName:
            `${moduleLibrary.encryptPub("Elbi Library")}`,
          start:
            `${moduleLibrary.encryptPub("10 January 2021")}`,
          end:
            `${moduleLibrary.encryptPub("28 february 2021")}`,
          author:
            `${moduleLibrary.encryptPub("Rhafael Bijaksana")}`,
          dbms:
            `${moduleLibrary.encryptPub("mysql")}`,
          language:
            `${moduleLibrary.encryptPub("node js")}`,
          framework:
            `${moduleLibrary.encryptPub("express")}`,
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
