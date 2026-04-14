const Employee = require('../models/Employee');
const { Payroll } = require('../models/Payroll');

class ComplianceService {
    /**
     * Generates a PF ECR (Electronic Challan-cum-Return) text file format
     * Format: UAN # Member Name # Gross # EPF Wage # EPS Wage # EDLI Wage # EE Share # ER Share ...
     */
    static async generatePF_ECR(companyId, monthInput, year) {
        // Map "April" -> 4, etc.
        const monthMap = {
            'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
            'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
        };
        const month = monthMap[monthInput] || parseInt(monthInput);

        const payrolls = await Payroll.findAll({
            where: { month, year: parseInt(year) },
            include: [{
                model: Employee,
                where: { companyId }
            }]
        });

        if (payrolls.length === 0) {
            throw new Error(`No payroll records found for ${monthInput} ${year}. Please run payroll first.`);
        }

        let ecrContent = "";
        payrolls.forEach(p => {
            const uan = p.Employee.pan || "NA"; // Ideally should be UAN field
            const name = p.Employee.name;
            const gross = p.grossSalary;
            const epfWage = p.basicSalary; // EPF usually on Basic
            const epsWage = Math.min(p.basicSalary, 15000); // Capped at 15k
            const edliWage = epsWage;
            
            const eeShare = Math.round(epfWage * 0.12);
            const erEps = Math.round(epsWage * 0.0833);
            const erEpf = eeShare - erEps;

            // Govt ECR format uses #~# or similar delimiters
            ecrContent += `${uan}#~#${name}#~#${gross}#~#${epfWage}#~#${epsWage}#~#${edliWage}#~#${eeShare}#~#${erEpf}#~#${erEps}#~#0#~#0\n`;
        });

        return ecrContent;
    }

    static async generateESI_Return(companyId, monthInput, year) {
        const monthMap = {
            'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
            'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
        };
        const month = monthMap[monthInput] || parseInt(monthInput);

        const payrolls = await Payroll.findAll({
            where: { month, year: parseInt(year) },
            include: [{
                model: Employee,
                where: { companyId }
            }]
        });

        if (payrolls.length === 0) {
            throw new Error(`No payroll records found for ${monthInput} ${year}.`);
        }

        const data = payrolls.map(p => ({
            ipNumber: p.Employee.aadhaar || '0000000000',
            ipName: p.Employee.name,
            noOfDaysForWhichWagesPaid: 30, // Mocked for now
            totalMonthlyWages: p.grossSalary,
            reason: '0'
        }));

        return data;
    }
}

module.exports = ComplianceService;
