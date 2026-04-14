const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = process.env.USE_SQLITE === 'true' 
    ? new Sequelize({
        dialect: 'sqlite',
        storage: './payroll.sqlite',
        logging: false
      })
    : new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        }
      });

module.exports = sequelize;
