const sequelize = require('../config/database');

const User = require('./userModel');
const Division = require('./divisionModel');
const Department = require('./departmentModel');
const Employee = require('./employeeModel');

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

module.exports = {
  sequelize,
  User,
  Division,
  Department,
  Employee,
};
