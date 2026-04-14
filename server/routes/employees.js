const express = require('express');
const Employee = require('../models/Employee');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const employees = await Employee.findAll({ 
            where: { companyId: req.user.companyId } 
        });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const ExportService = require('../services/ExportService');

router.get('/export', auth, async (req, res) => {
    try {
        const employees = await Employee.findAll({ 
            where: { companyId: req.user.companyId } 
        });
        const buffer = await ExportService.exportEmployeesToExcel(employees);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=employees.xlsx');
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, authorize('Admin', 'Accountant', 'HR'), async (req, res) => {
    try {
        const employee = await Employee.create({
            ...req.body,
            companyId: req.user.companyId
        });
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
