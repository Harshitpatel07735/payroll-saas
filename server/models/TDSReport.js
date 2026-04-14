const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TDSReport = sequelize.define('TDSReport', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: { type: DataTypes.UUID, allowNull: false },
    financialYear: { type: DataTypes.STRING, allowNull: false }, // e.g., "2025-26"
    quarter: { type: DataTypes.INTEGER, allowNull: true }, // 1, 2, 3, 4
    totalEarnings: { type: DataTypes.FLOAT, defaultValue: 0 },
    tdsDeducted: { type: DataTypes.FLOAT, defaultValue: 0 },
    tdsDeposited: { type: DataTypes.FLOAT, defaultValue: 0 },
    section: { type: DataTypes.STRING, defaultValue: '192' }, // Section 192 (Salaries)
    status: {
        type: DataTypes.ENUM('Pending', 'Deposited', 'Filed'),
        defaultValue: 'Pending'
    },
    companyId: { type: DataTypes.UUID, allowNull: false }
});

module.exports = TDSReport;
