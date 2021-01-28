const { Sequelize,DataTypes } = require("sequelize");

module.exports = async function (sequelize) {
  return await sequelize.define("table-order", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    id_transaction: {
      type: DataTypes.STRING
    },

    order_status: {
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


  });
};
