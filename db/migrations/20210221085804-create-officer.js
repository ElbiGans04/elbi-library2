'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('officers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },      
      email: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
              isEmail: true
          }
      },
      
      password: {
          type: Sequelize.STRING,
          allowNull: false,
      }
    }, {
      modelName: 'officer',
      timestamps: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('officers');
  }
};