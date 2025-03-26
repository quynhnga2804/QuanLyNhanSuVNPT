// models/phongban.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
  DepartmentID: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  DepartmentName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  DivisionID: {
    type: DataTypes.STRING(10),
    allowNull: true,
    references: {
      model: 'divisions',
      key: 'DivisionID',
    },
  },
}, {
  tableName: 'departments',
  timestamps: false,
});

module.exports = Department;
