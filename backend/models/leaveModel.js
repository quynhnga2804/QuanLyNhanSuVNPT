const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Leave = sequelize.define('Leave', {
    LeaveRequestID: { 
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
  LeaveReason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  EndDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ApprovedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'leaves',
  timestamps: false,
});
module.exports = Leave;
