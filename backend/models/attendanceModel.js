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
    allowNull: true,
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
    type: DataTypes.DATE,
    allowNull: false,
  },
  CheckOutTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  TotalHoursWorked: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  ID_PayrollCycle: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'payrollcycles',
      key: 'ID_PayrollCycle',
    },
  },
}, {
  tableName: 'attendances',
  timestamps: false, // Không sử dụng timestamps
});
module.exports = Attendance;