const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Overtime = sequelize.define('Overtime', {
  ID_OT: {
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
  ReasonOT: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  OTType: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  DateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  OverTimesHours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  ID_PayrollCycle: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'payrollcycles',
      key: 'ID_PayrollCycle',
    },
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
  tableName: 'overtimes',
  timestamps: false,
});
module.exports = Overtime;
