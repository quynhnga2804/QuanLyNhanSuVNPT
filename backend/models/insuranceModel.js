const { DataTypes, INTEGER, DECIMAL } = require('sequelize');
const sequelize = require('../config/database');

const Insurance = sequelize.define('Insurance', {
  InsurancesNumber: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  InsurancesStartDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  InsurancesContributionAmount: {
    type: DECIMAL(18,2),
    allowNull: true,
  },
  Status: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'insurances',
  timestamps: false, // Không sử dụng timestamps
});

module.exports = Insurance;
