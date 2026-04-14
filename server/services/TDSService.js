const { Payroll } = require('../models/Payroll');
const TDSReport = require('../models/TDSReport');
const { Op } = require('sequelize');

class TDSService {
    static async calculateTDSForFinancialYear(employeeId, financialYear, companyId) {
        // Year range for FY 2025-26: starts April 2025, ends March 2026
        const [startYearStr, endYearStr] = financialYear.split('-');
        const startYear = parseInt(startYearStr);
        const endYear = startYear + 1;

        const payrolls = await Payroll.findAll({
            where: {
                employeeId,
                companyId,
                [Op.or]: [
                    { year: startYear, month: { [Op.gte]: 4 } }, // April to December
                    { year: endYear, month: { [Op.lte]: 3 } }    // January to March
                ]
            }
        });

        let totalEarnings = 0;
        let tdsDeducted = 0;

        payrolls.forEach(p => {
            totalEarnings += p.earnedGross;
            tdsDeducted += p.deductions.tds || 0;
        });

        return { totalEarnings, tdsDeducted, payrollCount: payrolls.length };
    }

    static async generateQuarterlyTDSReport(companyId, year, quarter) {
        // Simplified Logic: 
        // Q1: April, May, June
        // Q2: July, Aug, Sept
        // Q3: Oct, Nov, Dec
        // Q4: Jan, Feb, March (next year)
        
        const months = quarter === 1 ? [4, 5, 6] : 
                       quarter === 2 ? [7, 8, 9] :
                       quarter === 3 ? [10, 11, 12] : [1, 2, 3];
        const searchYear = quarter === 4 ? year + 1 : year; // If Q4, the year is technically the next calendar year

        const payrolls = await Payroll.findAll({
            where: {
                companyId,
                year: searchYear,
                month: { [Op.in]: months }
            }
        });

        // Group by employee and aggregate
        const report = {};
        payrolls.forEach(p => {
            if (!report[p.employeeId]) {
                report[p.employeeId] = { earnings: 0, tds: 0 };
            }
            report[p.employeeId].earnings += p.earnedGross;
            report[p.employeeId].tds += p.deductions.tds || 0;
        });

        return report;
    }
}

module.exports = TDSService;
