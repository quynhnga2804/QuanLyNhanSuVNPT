const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserNotification = sequelize.define('UserNotification', {
  UserNotificationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  EmployeeID: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  NotificationID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  IsDeleted: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0,
  },
  IsRead: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0,
  }
}, {
  tableName: 'usernotifications',
  timestamps: false,
});

module.exports = UserNotification;
