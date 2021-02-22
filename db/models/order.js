'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    static associate(models) {
        models.user.hasMany(models.order, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        models.order.belongsTo(models.user, {foreignKey: 'user_id'});
    }
  };
  order.init({
    id_transaction: {
      type: DataTypes.STRING
    },
    
    return_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    
    order_day: {
      type: DataTypes.INTEGER,
    },
    
    order_price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    order_date: {
      type: DataTypes.BIGINT(20)
    },
    
    order_officer_buy : {
      type: DataTypes.STRING
    },
    
    order_officer_return : {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'order',
    timestamps: false
  });
  return order;
};