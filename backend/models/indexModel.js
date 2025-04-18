const sequelize = require('../config/database');

const User = require('./userModel');
const Division = require('./divisionModel');
const Department = require('./departmentModel');
const Employee = require('./employeeModel');
const LaborContract = require('./laborcontractModel');
const EmployeeContract = require('./employeecontractModel');
const Notification = require('./notificationModel');
const UserNotification = require('./userNotificationModel');
const Attendance = require('./attendanceModel');
const PayrollCycle = require('./payrollCycleModel');
const OverTime = require('./overtimeModel');
const MonthlySalary = require('./monthlysalaryModel');
const Resignation = require('./resignationModel');
const LeaveRquest = require('./leaverequestModel');


// Thiết lập quan hệ giữa các bảng

// 1. Một Department thuộc về một Division (1 - N)
Department.belongsTo(Division, { foreignKey: 'DivisionID' });
Division.hasMany(Department, { foreignKey: 'DivisionID' });

// 2. Một Employee thuộc về một Department (1 - N)
Employee.belongsTo(Department, { foreignKey: 'DepartmentID' });
Department.hasMany(Employee, { foreignKey: 'DepartmentID' });

// 3. Một Employee có một User (1 - 1) thông qua WorkEmail
Employee.belongsTo(User, { foreignKey: 'WorkEmail' });
User.hasOne(Employee, { foreignKey: 'WorkEmail' });

// 👉 Thiết lập quan hệ giữa EmployeeContract và LaborContract:
EmployeeContract.belongsTo(LaborContract, { foreignKey: 'ID_Contract' });
LaborContract.hasMany(EmployeeContract, { foreignKey: 'ID_Contract' });

// 👉 Thiết lập quan hệ giữa EmployeeContract và Employee:
EmployeeContract.belongsTo(Employee, { foreignKey: 'EmployeeID' });
Employee.hasMany(EmployeeContract, { foreignKey: 'EmployeeID' });

Notification.hasMany(UserNotification, { foreignKey: 'NotificationID' });
UserNotification.belongsTo(Notification, { foreignKey: 'NotificationID' });

Employee.hasMany(UserNotification, { foreignKey: 'EmployeeID' });
UserNotification.belongsTo(Employee, { foreignKey: 'EmployeeID' });

Employee.hasMany(Attendance, { foreignKey: 'EmployeeID'});
Attendance.belongsTo(Employee, { foreignKey: 'EmployeeID'});

Employee.hasMany(OverTime, { foreignKey: 'EmployeeID'});
OverTime.belongsTo(Employee, { foreignKey: 'EmployeeID'});

PayrollCycle.hasMany(OverTime, {foreignKey: 'ID_PayrollCycle'});
OverTime.belongsTo(PayrollCycle, { foreignKey: 'ID_PayrollCycle'});

Employee.hasMany(MonthlySalary, { foreignKey: 'EmployeeID'});
MonthlySalary.belongsTo(Employee, { foreignKey: 'EmployeeID'});

PayrollCycle.hasMany(MonthlySalary, {foreignKey: 'ID_PayrollCycle'});
MonthlySalary.belongsTo(PayrollCycle, { foreignKey: 'ID_PayrollCycle'});

Resignation.belongsTo(Employee, { foreignKey: 'EmployeeID'});
Employee.hasMany(Resignation, { foreignKey: 'EmployeeID'});

Employee.hasMany(LeaveRquest, { foreignKey: 'EmployeeID' });
LeaveRquest.belongsTo(Employee, { foreignKey: 'EmployeeID' });

module.exports = {
  sequelize,
  User,
  Division,
  Department,
  Employee,
  LaborContract,
  EmployeeContract,
  Attendance,
  PayrollCycle,
  OverTime,
  MonthlySalary,
  Resignation,
  LeaveRquest
};
