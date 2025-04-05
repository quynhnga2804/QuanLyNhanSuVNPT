const { Sequelize } = require('sequelize');
require('dotenv').config(); // Đảm bảo dotenv được load trước khi sử dụng process.env

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    timezone: '+07:00' // Đổi sang múi giờ của bạn, mới thêm hôm 03/04/2025
  }
);

module.exports = sequelize;