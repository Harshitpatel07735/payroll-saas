const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Employee = require('../models/Employee');
const Company = require('../models/Company');
const { Attendance, Payroll } = require('../models/Payroll');
const PayrollService = require('../services/PayrollService');
const router = express.Router();

router.get('/stats', auth, async (req, res) => {
    try {
        const employeeCount = await Employee.count({ where: { companyId: req.user.companyId } });
        const lastPayroll = await Payroll.findOne({
            where: { companyId: req.user.companyId },
            order: [['createdAt', 'DESC']]
        });
        
        res.json({
            totalEmployees: employeeCount,
            monthlyPayroll: lastPayroll ? lastPayroll.netSalary : 0,
            pendingFilings: 2, // Hardcoded for now
            avgSalary: employeeCount > 0 ? 18500 : 0 // Hardcoded for simplified demo
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/process', auth, authorize('Admin', 'Accountant'), async (req, res) => {
    try {
        const { month, year, attendanceData } = req.body;
        const company = await Company.findByPk(req.user.companyId);
        
        const results = [];
        for (const data of attendanceData) {
            const employee = await Employee.findOne({ 
                where: { employeeId: data.employeeId, companyId: req.user.companyId } 
            });
            
            if (!employee) continue;

            // Save attendance
            await Attendance.upsert({
                employeeId: employee.id,
                month,
                year,
                presentDays: data.presentDays,
                absentDays: data.absentDays,
                leaveDays: data.leaveDays
            });

            // Calculate payroll
            const payrollData = PayrollService.calculatePayroll(employee, data, company);
            
            // Save/Update payroll
            const [payrollRecord] = await Payroll.upsert({
                employeeId: employee.id,
                month,
                year,
                basicSalary: payrollData.earnedBasic,
                grossSalary: payrollData.fixedGross,
                earnedGross: payrollData.earnedGross,
                deductions: payrollData.deductions,
                employerContributions: payrollData.employerContributions,
                netSalary: payrollData.netSalary,
                companyId: company.id,
                status: 'Draft'
            });

            results.push({ id: payrollRecord.id, employeeId: employee.employeeId, ...payrollData });
        }

        res.json({ message: 'Payroll processed successfully', results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:month/:year', auth, async (req, res) => {
    try {
        const payrolls = await Payroll.findAll({
            where: { 
                companyId: req.user.companyId,
                month: req.params.month,
                year: req.params.year
            },
            include: [Employee]
        });
        res.json(payrolls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const WhatsAppService = require('../services/WhatsAppService');

router.post('/whatsapp-notify', auth, async (req, res) => {
    const { payrollId } = req.body;
    try {
        const payroll = await Payroll.findByPk(payrollId, {
            include: [Employee]
        });

        if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });

        const result = await WhatsAppService.sendPayslipNotification(
            payroll.Employee.mobile || '910000000000', // Default mock if missing
            {
                employeeName: payroll.Employee.name,
                month: payroll.month,
                year: payroll.year,
                netSalary: payroll.netSalary,
                downloadUrl: `https://apex-payroll.com/payslip/${payroll.id}` // Placeholder URL
            }
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
