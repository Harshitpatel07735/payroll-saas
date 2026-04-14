const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const ComplianceService = require('../services/ComplianceService');
const router = express.Router();

router.get('/pf-ecr', auth, async (req, res) => {
    const { month, year } = req.query;
    try {
        const ecrText = await ComplianceService.generatePF_ECR(req.user.companyId, month, year);
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename=PF_ECR_${month}_${year}.txt`);
        res.send(ecrText);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/esi-return', auth, async (req, res) => {
    const { month, year } = req.query;
    try {
        const data = await ComplianceService.generateESI_Return(req.user.companyId, month, year);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
