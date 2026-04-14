const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Determines PT rates'
    },
    gstin: { type: DataTypes.STRING },
    pan: { type: DataTypes.STRING },
    pfCode: { type: DataTypes.STRING },
    esiCode: { type: DataTypes.STRING },
    ptCode: { type: DataTypes.STRING },
    logoUrl: { type: DataTypes.STRING },
    settings: {
        type: DataTypes.JSONB,
        defaultValue: {
            workingDaysDefault: 26,
            financialYear: 'April-March',
            pfEnabled: true,
            esiEnabled: true
        }
    }
});

module.exports = Company;
