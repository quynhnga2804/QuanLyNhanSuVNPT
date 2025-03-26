const { DataTypes, INTEGER, DECIMAL } = require('sequelize');
const sequelize = require('../config/database');

const JobProfile = sequelize.define('JobProfile', {
  EmployeeID: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  EmploymentStatus: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  StandardWorkingHours: {
    type: INTEGER,
    allowNull: true,
  },
  EmployeesType: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  RemainingLeaveDays: {
    type: INTEGER,
    allowNull: true,
  },
  EmergencyContactNumber	: {
    type: DataTypes.STRING(11),
    allowNull: true,
  },
  EmergencyContactName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ResignationsDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ResignationsReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  BaseSalary: {
    type: DECIMAL(18,2),
    allowNull: true,
  },
  Allowance: {
    type: DECIMAL(18,2),
    allowNull: true,
  },
}, {
  tableName: 'jobprofiles',
  timestamps: false, // Không sử dụng timestamps
});

module.exports = JobProfile;
