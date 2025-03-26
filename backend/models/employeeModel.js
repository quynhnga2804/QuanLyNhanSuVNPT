const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  EmployeeID: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  FullName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PhoneNumber: {
    type: DataTypes.STRING(11),
    allowNull: true,
  },
  DateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Gender: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  Address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  PersonalEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  WorkEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    references: {
      model: 'users',
      key: 'WorkEmail',
    },
  },
  JobTitle: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Position: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  DepartmentID: {
    type: DataTypes.STRING(10),
    allowNull: true,
    references: {
      model: 'departments',
      key: 'DepartmentID',
    },
  },
}, {
  tableName: 'employees',
  timestamps: false, // Không sử dụng timestamps
});
module.exports = Employee;
