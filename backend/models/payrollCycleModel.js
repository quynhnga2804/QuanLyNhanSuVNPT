const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PayrollCycle = sequelize.define('PayrollCycle', {
    ID_PayrollCycle: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  PayrollName: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  EndDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'payrollCycles',
  timestamps: false, // Không sử dụng timestamps
});
module.exports = PayrollCycle;
