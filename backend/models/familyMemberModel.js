const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FamilyMember = sequelize.define('FamilyMember', {
  FamilyMemberID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false,
  },
  EmployeeID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'employees',
      key: 'EmployeeID',
    },
  },
  FullName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Relationship: {
    type: DataTypes.STRING(100),
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
  PhoneNumber: {
    type: DataTypes.STRING(11),
    allowNull: true,
  },
}, {
  tableName: 'familymembers',
  timestamps: false, // Không sử dụng timestamps
});

module.exports = FamilyMember;
