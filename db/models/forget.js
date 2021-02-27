'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class forget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  forget.init({
    token: {
      type: DataTypes.STRING
    },
    
    tokenExp: {
        type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'forget',
    timestamps: false
  });
  return forget;
};