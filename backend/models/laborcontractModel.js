const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LaborContract = sequelize.define('LaborContract', {
  ID_Contract: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    autoIncrement: true,
  },
  ContractType: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'laborcontracts',
  timestamps: false,
});

module.exports = LaborContract;
