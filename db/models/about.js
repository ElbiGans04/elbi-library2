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
    appName: DataTypes.STRING(1000),
    start: DataTypes.STRING(1000),
    end: DataTypes.STRING(1000),
    author: DataTypes.STRING(1000),
    dbms: DataTypes.STRING(1000),
    language: DataTypes.STRING(1000),
    framework: DataTypes.STRING(1000),
    fines: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'about',
    timestamps: false
  });
  return about;
};