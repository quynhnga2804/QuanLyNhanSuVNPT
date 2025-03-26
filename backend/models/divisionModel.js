// models/bophan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Division = sequelize.define('Division', {
  DivisionID: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  DivisionsName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  EstablishmentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'divisions',
  timestamps: false,
});

module.exports = Division;
