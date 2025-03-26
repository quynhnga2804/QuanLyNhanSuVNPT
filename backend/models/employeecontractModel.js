const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployeeContract = sequelize.define('EmployeeContract', {
  ID_Contract: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'laborcontracts',
      key: 'ID_Contract'
    }
  },
  EmployeeID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'employees',
      key: 'EmployeeID'
    }
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  EndDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'employeescontracts',
  timestamps: false,
});

module.exports = EmployeeContract;
