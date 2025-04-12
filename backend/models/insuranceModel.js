// models/bophan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Insurance = sequelize.define('Insurance', {
  InsuranceType: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  Employee: {
    type: DataTypes.DECIMAL(6,3),
    allowNull: false,
  },
  Employer: {
    type: DataTypes.DECIMAL(6,3),
    allowNull: false,
  },
  ChangeDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'insurances',
  timestamps: false,
});

module.exports = Insurance;
