const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resignation = sequelize.define('Resignation', {
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
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'resignations',
  timestamps: false, // Không sử dụng timestamps
});
module.exports = Resignation;
