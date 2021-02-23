'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class officer extends Model {
    static associate(models) {
      models.officer.hasMany(models.forget, {
        foreignKey: 'officer_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      models.forget.belongsTo(models.officer, {foreignKey: 'officer_id'});
      models.role.belongsToMany(models.officer, { through: 'officer_role', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
      models.officer.belongsToMany(models.role, { through: 'officer_role', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
    }
  };
  officer.init({    
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'officer',
    timestamps: false
  });
  return officer;
};