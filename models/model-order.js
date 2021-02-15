const { Sequelize,DataTypes } = require("sequelize");

module.exports = async function (sequelize) {
  return await sequelize.define("order", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

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
    timestamps: false,
    
  });
};
