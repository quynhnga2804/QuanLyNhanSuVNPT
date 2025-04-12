const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IncomeTax = sequelize.define('IncomeTax', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  MaxValue: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true,
  },
  TaxRate: {
    type: DataTypes.DECIMAL(6,3),
    allowNull: false,
  },
  ChangeDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'incometaxes',
  timestamps: false,
});

module.exports = IncomeTax;
