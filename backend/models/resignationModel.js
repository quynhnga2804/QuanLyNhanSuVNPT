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
  ManagerID: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  Reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ResignationsDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ApprovedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'resignations',
  timestamps: false, // Không sử dụng timestamps
});
module.exports = Resignation;
