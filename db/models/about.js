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
    appName: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    start: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    end: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    dbms: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    framework: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    fines: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    }
  }, {
    sequelize,
    modelName: 'about',
    timestamps: false
  });
  return about;
};