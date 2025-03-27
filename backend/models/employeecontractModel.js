const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployeeContract = sequelize.define('EmployeeContract', {
  employcontractID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_Contract: {
    type: DataTypes.STRING(10), 
    allowNull: false,
    // references: {
    //   model: 'laborcontracts',
    //   key: 'ID_Contract'
    // }
  },
  EmployeeID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    // references: {
    //   model: 'employees',
    //   key: 'EmployeeID'
    // }
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: true, 
  },
  EndDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'employeescontracts',
  timestamps: false,
});

module.exports = EmployeeContract;
