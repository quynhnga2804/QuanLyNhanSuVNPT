const sequelize = require('./database');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối cơ sở dữ liệu thành công.');
    await sequelize.sync({ alter: true });
    console.log('Đồng bộ hóa cơ sở dữ liệu thành công.');
  } catch (error) {
    console.error('Không thể kết nối đến cơ sở dữ liệu:', error);
  }
}

testConnection();