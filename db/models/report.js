'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.report.belongsToMany(models.user, { through: 'user_report', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
        models.user.belongsToMany(models.report, { through: 'user_report', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
        models.report.belongsToMany(models.book, { through: 'book_report', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
        models.book.belongsToMany(models.report, { through: 'book_report', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
    }
  };
  report.init({
    id_transaction: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'report',
    timestamps: false
  });
  return report;
};