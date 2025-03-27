const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LaborContract = sequelize.define('LaborContract', {
  ID_Contract: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ContractType: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'laborcontracts',
  timestamps: false,
});

module.exports = LaborContract;
