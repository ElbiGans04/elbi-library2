'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    static associate(models) {
     models.book.hasMany(models.order, {
        foreignKey: 'book_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
        });
     models.order.belongsTo(models.book, {foreignKey: 'book_id'});
     models.publisher.belongsToMany(models.book, { through: 'book_publisher', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
     models.book.belongsToMany(models.publisher, { through: 'book_publisher', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
     models.category.belongsToMany(models.book, { through: 'book_category', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
     models.book.belongsToMany(models.category, { through: 'book_category', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
    }
  };
  book.init({
    book_image: {
      type: DataTypes.STRING,
      allowNull: false
    },
  
  book_price: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  
  book_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
          isNumeric: true
      }
  },
  
  book_title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {      
          // isAlphanumeric: true  
      }
  },
  
  book_launching: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          isNumeric: true
      }
  },
  
  book_author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          // isAlphanumeric: true
      }
  },
  
  book_page_thickness: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          isNumeric: true
      }
  },
  
  book_isbn : {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          isNumeric: true
      }
  }
  }, {
    sequelize,
    modelName: 'book',
    timestamps: false
  });
  return book;
};