'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.class.belongsToMany(models.user, { through: 'user_class', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
      models.user.belongsToMany(models.class, { through: 'user_class', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
    }
  };
  user.init({
    nisn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'user',
    timestamps: false
  });
  return user;
};