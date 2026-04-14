const express = require('express');
const { auth } = require('../middleware/auth');
const Employee = require('../models/Employee');
const Company = require('../models/Company');
const { Payroll } = require('../models/Payroll');
const PDFService = require('../services/PDFService');
const EmailService = require('../services/EmailService');
const router = express.Router();

router.get('/:id/download', auth, async (req, res) => {
    try {
        const payroll = await Payroll.findByPk(req.params.id, { include: [Employee] });
        if (!payroll) return res.status(404).json({ message: 'Payroll not found' });
        
        const company = await Company.findByPk(req.user.companyId);
        const filePath = PDFService.generatePayslip(payroll, payroll.Employee, company);

        res.download(filePath, (err) => {
            if (err) console.error(err);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/generate-bulk/:month/:year', auth, async (req, res) => {
    try {
        const { month, year } = req.params;
        const companyId = req.user.companyId;

        const payrolls = await Payroll.findAll({ where: { month, year, companyId } });
        const employees = await Employee.findAll({ where: { companyId } });
        const company = await Company.findByPk(companyId);

        if (payrolls.length === 0) return res.status(404).json({ message: 'No payrolls found for this month' });

        const generationResults = await PDFService.generateBulkPayslips(payrolls, employees, company);
        res.json({ message: `Successfully generated ${generationResults.length} payslips`, details: generationResults.map(r => r.filePath) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/email-all/:month/:year', auth, async (req, res) => {
    try {
        const { month, year } = req.params;
        const companyId = req.user.companyId;

        const payrolls = await Payroll.findAll({ where: { month, year, companyId } });
        const employees = await Employee.findAll({ where: { companyId } });
        const company = await Company.findByPk(companyId);

        const generationResults = await PDFService.generateBulkPayslips(payrolls, employees, company);
        
        const emailResults = [];
        for (const result of generationResults) {
            try {
                await EmailService.sendPayslipEmail(result.employee, result.payroll, result.filePath);
                emailResults.push({ employeeId: result.employee.employeeId, status: 'Sent' });
            } catch (error) {
                emailResults.push({ employeeId: result.employee.employeeId, status: 'Failed', error: error.message });
            }
        }

        res.json({ message: 'Email process completed', results: emailResults });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
