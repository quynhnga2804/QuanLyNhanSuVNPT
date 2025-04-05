
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
    ID_Attendance: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  EmployeeID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'employees',
      key: 'EmployeeID',
    },
  },
  AttendancesDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  CheckInTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  CheckInLocation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  CheckOutTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  CheckOutLocation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  TotalHoursWorked: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
}, {
  tableName: 'attendances',
  timestamps: false, // Không sử dụng timestamps
});
module.exports = Attendance;