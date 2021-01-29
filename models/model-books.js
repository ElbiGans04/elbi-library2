const {DataTypes, Op} = require('sequelize');
module.exports = async function (sequelize) {
    return await sequelize.define('book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        book_image: {
            type: DataTypes.BLOB('long')
        },

        book_type: {
            type: DataTypes.STRING
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

        book_publisher: {
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


    })
}