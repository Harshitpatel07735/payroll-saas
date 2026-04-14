/**
 * Payroll Calculation Engine
 * Handles Indian Statutory Rules (PF, ESI, PT)
 */

class PayrollService {
    static calculatePF(basic, pfOptOut = false) {
        if (pfOptOut) return { employee: 0, employer: 0 };
        
        // PF restricted to 15000 if basic is higher
        const pfBasic = Math.min(basic, 15000);
        const employeePF = Math.round(pfBasic * 0.12);
        const employerPF = Math.round(pfBasic * 0.0367); // 3.67% to EPF, rest to EPS (8.33%)
        
        return { employee: employeePF, employer: employerPF };
    }

    static calculateESI(gross, esiOptOut = false) {
        if (esiOptOut || gross > 21000) return { employee: 0, employer: 0 };
        
        const employeeESI = Math.ceil(gross * 0.0075);
        const employerESI = Math.ceil(gross * 0.0325);
        
        return { employee: employeeESI, employer: employerESI };
    }

    static calculatePT(gross, state) {
        // Simplified PT Slabs for demonstration
        const slabs = {
            'Gujarat': [
                { limit: 6000, rate: 0 },
                { limit: 9000, rate: 80 },
                { limit: 12000, rate: 150 },
                { limit: Infinity, rate: 200 }
            ],
            'Maharashtra': [
                { limit: 7500, rate: 0 },
                { limit: 10000, rate: 175 },
                { limit: Infinity, rate: 250 } // Note: Feb is 300
            ],
            'Tamil Nadu': [
                { limit: 3500, rate: 0 },
                { limit: 9000, rate: 100 },
                { limit: Infinity, rate: 200 }
            ],
            'Karnataka': [
                { limit: 15000, rate: 0 },
                { limit: Infinity, rate: 200 }
            ]
        };

        const stateSlabs = slabs[state] || slabs['Gujarat'];
        const slab = stateSlabs.find(s => gross <= s.limit);
        return slab ? slab.rate : 200;
    }

    static calculatePayroll(employee, attendance, company) {
        const { salaryStructure, statutoryFlags } = employee;
        const { presentDays, absentDays, leaveDays } = attendance;
        const totalWorkingDays = company.settings.workingDaysDefault || 26;

        // Gross Salary components
        const basic = salaryStructure.basic;
        const hra = salaryStructure.hra || 0;
        const da = salaryStructure.da || 0;
        const conveyance = salaryStructure.conveyance || 0;
        const other = salaryStructure.otherAllowances || 0;

        const fixedGross = basic + hra + da + conveyance + other;
        
        // Earned components (Prorated based on attendance)
        // Basic is prorated, Allowances usually fixed or prorated depending on co policy.
        // For this build, we prorate everything except fixed allowances if specified.
        const attendanceRatio = presentDays / totalWorkingDays;
        
        const earnedBasic = Math.round(basic * attendanceRatio);
        const earnedGross = Math.round(fixedGross * attendanceRatio);

        const pf = this.calculatePF(earnedBasic, statutoryFlags.pfOptOut);
        const esi = this.calculateESI(earnedGross, statutoryFlags.esiOptOut);
        const pt = this.calculatePT(earnedGross, company.state);

        const totalDeductions = pf.employee + esi.employee + pt;
        const netSalary = earnedGross - totalDeductions;

        return {
            fixedGross,
            earnedGross,
            earnedBasic,
            deductions: {
                pf: pf.employee,
                esi: esi.employee,
                pt: pt,
                total: totalDeductions
            },
            employerContributions: {
                pf: pf.employer,
                esi: esi.employer
            },
            netSalary
        };
    }
}

module.exports = PayrollService;
