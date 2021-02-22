'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('abouts', [{appName: 'elbi-library', start: '18 January 2021', end: '22 February 2021', author: 'Rhafael Bijaksana', dbms: 'postgreSql', framework: 'Express', language: 'Node Js', fines: 1000}], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('abouts', null, {});
  }
};
