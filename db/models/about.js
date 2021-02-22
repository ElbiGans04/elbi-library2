'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class about extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  about.init({
    appName: DataTypes.STRING,
    start: DataTypes.STRING,
    end: DataTypes.STRING,
    author: DataTypes.STRING,
    dbms: DataTypes.STRING,
    language: DataTypes.STRING,
    framework: DataTypes.STRING,
    fines: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'about',
    timestamps: false
  });
  return about;
};