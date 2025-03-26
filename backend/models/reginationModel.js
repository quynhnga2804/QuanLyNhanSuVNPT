const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Regination = sequelize.define('Regination', {
    ID_Resignation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  EmployeeID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'employees',
      key: 'EmployeeID',
    },
  },
  Reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ResignationsDate: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'reginations',
  timestamps: false, // Không sử dụng timestamps
});
module.exports = Regination;
