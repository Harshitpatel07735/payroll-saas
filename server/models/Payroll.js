const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: { type: DataTypes.UUID, allowNull: false },
    month: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    presentDays: { type: DataTypes.FLOAT, defaultValue: 0 },
    absentDays: { type: DataTypes.FLOAT, defaultValue: 0 },
    leaveDays: { type: DataTypes.FLOAT, defaultValue: 0 },
    overtimeHours: { type: DataTypes.FLOAT, defaultValue: 0 }
});

const Payroll = sequelize.define('Payroll', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: { type: DataTypes.UUID, allowNull: false },
    month: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    basicSalary: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    grossSalary: { type: DataTypes.FLOAT, allowNull: false },
    earnedGross: { type: DataTypes.FLOAT, allowNull: false },
    deductions: {
        type: DataTypes.JSONB,
        defaultValue: {
            pf: 0,
            esi: 0,
            pt: 0,
            tds: 0,
            loans: 0,
            others: 0
        }
    },
    employerContributions: {
        type: DataTypes.JSONB,
        defaultValue: {
            pf: 0,
            esi: 0
        }
    },
    netSalary: { type: DataTypes.FLOAT, allowNull: false },
    status: {
        type: DataTypes.ENUM('Draft', 'Finalized', 'Paid'),
        defaultValue: 'Draft'
    },
    payslipUrl: { type: DataTypes.STRING },
    companyId: { type: DataTypes.UUID, allowNull: false }
});

module.exports = { Attendance, Payroll };
