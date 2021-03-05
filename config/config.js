const fs = require('fs');
const path = require('path');
const env = require('dotenv').config({path: path.resolve(__dirname, '.env')})

module.exports = {
  development: {
    username: process.env.APP_USER,
    password: process.env.APP_PASSWORD,
    database: process.env.APP_DATABASE,
    host: '127.0.0.1',
    // port: 3306,
    port: process.env.APP_DB_PORT,
    dialect: process.env.APP_DIALECT,
    logging: false,
    timestamps: false,
    dialectOptions: {
      bigNumberStrings: true
    },
    pool:{
      min: 0,
      max: 10,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    timestamps: false,
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  production: {
    username: process.env.APP_USER,
    password: process.env.APP_PASSWORD,
    host: process.env.APP_HOST,
    database: process.env.APP_DATABASE,
    port: process.env.APP_DB_PORT,
    timestamps: false,
    ssl: true,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true, // This will help you. But you will see nwe error
        rejectUnauthorized: false // This line will fix new error
      }
    },
  }
};