const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    mobile: { type: DataTypes.STRING },
    department: { type: DataTypes.STRING },
    designation: { type: DataTypes.STRING },
    bankName: { type: DataTypes.STRING },
    bankAccount: { type: DataTypes.STRING },
    ifsc: { type: DataTypes.STRING },
    pan: { type: DataTypes.STRING },
    aadhaar: { type: DataTypes.STRING },
    salaryStructure: {
        type: DataTypes.JSONB,
        defaultValue: {
            basic: 15000,
            hra: 3000,
            da: 0,
            conveyance: 1600,
            otherAllowances: 0
        }
    },
    statutoryFlags: {
        type: DataTypes.JSONB,
        defaultValue: {
            pfOptOut: false,
            esiOptOut: false,
            ptExempt: false
        }
    },
    companyId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Employee;
