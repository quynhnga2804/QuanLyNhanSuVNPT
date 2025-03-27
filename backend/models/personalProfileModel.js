const { DataTypes, INTEGER, DECIMAL } = require('sequelize');
const sequelize = require('../config/database');

const PersonalProfile = sequelize.define('PersonalProfile', {
  EmployeeID: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  InsurancesNumber: {
    type: DataTypes.STRING(10),
    allowNull: true, 
  },
  Nationality: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  PlaceOfBirth: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ID_Card: {
    type: DataTypes.STRING(12),
    allowNull: true,
  },
  ID_CardIssuedPlace: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Education: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Degree: {
    type: DataTypes.STRING(100),    
    allowNull: true,
  },
  Major: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  WorkExperience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  TaxCode: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  BankAccount: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  BankName: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  MaritalStatus: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'personalprofiles',
  timestamps: false, // Không sử dụng timestamps
});

module.exports = PersonalProfile;
