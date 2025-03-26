const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MonthlySalary = sequelize.define('MonthlySalary', {
    ID_Salary: {
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
    ID_PayrollCycle: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: 'payrollcycles',
            key: 'ID_PayrollCycle',
        },
    },
    InsuranceFee: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
    },
    TaxPayable: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
    },
    Forfeit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
    },
    PrizeMoney: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
    },
    TotalOTSalary: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
    },
    NetSalary: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
    },
    PaymentDate: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    tableName: 'monthlysalaries',
    timestamps: false, // Không sử dụng timestamps
});
module.exports = MonthlySalary;
