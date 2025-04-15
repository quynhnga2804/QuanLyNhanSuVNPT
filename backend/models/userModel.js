// models/nguoidung.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  WorkEmail: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  UserName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  LastPasswordChange: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Role: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
