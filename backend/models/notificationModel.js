const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  NotificationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sentID: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  receivedID: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  Title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Type: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ExpiredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'notifications',
  timestamps: false,
});

module.exports = Notification;
