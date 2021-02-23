'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userClass extends Model {
    static associate(models) {
      // define association here
    }
  };
  userClass.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'class',
    timestamps: false
  });
  return userClass;
};