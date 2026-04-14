const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
    static generatePayslip(payroll, employee, company) {
        const doc = new PDFDocument({ margin: 50 });
        const filename = `Payslip_${employee.employeeId}_${payroll.month}_${payroll.year}.pdf`;
        const artifactsDir = path.join(__dirname, '../artifacts');
        const filePath = path.join(artifactsDir, filename);

        // Ensure directory exists
        if (!fs.existsSync(artifactsDir)) {
            fs.mkdirSync(artifactsDir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text(company.name, { align: 'center' });
        doc.fontSize(10).text(company.address, { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text('PAYSLIP', { align: 'center', underline: true });
        doc.moveDown();

        // Employee Details
        doc.fontSize(10).text(`Employee Name: ${employee.name}`);
        doc.text(`Employee ID: ${employee.employeeId}`);
        doc.text(`Designation: ${employee.designation}`);
        doc.text(`Period: ${payroll.month}/${payroll.year}`);
        doc.moveDown();

        // Earnings and Deductions Table
        const tableTop = 220;
        doc.text('EARNINGS', 50, tableTop, { bold: true });
        doc.text('AMOUNT', 200, tableTop, { bold: true });
        doc.text('DEDUCTIONS', 300, tableTop, { bold: true });
        doc.text('AMOUNT', 450, tableTop, { bold: true });

        // Line items
        doc.text('Basic', 50, tableTop + 20);
        doc.text(payroll.earnedGross.toFixed(2), 200, tableTop + 20);
        
        doc.text('Provident Fund', 300, tableTop + 20);
        doc.text(payroll.deductions.pf.toFixed(2), 450, tableTop + 20);

        doc.text('Employee ESI', 300, tableTop + 40);
        doc.text(payroll.deductions.esi.toFixed(2), 450, tableTop + 40);

        doc.text('Professional Tax', 300, tableTop + 60);
        doc.text(payroll.deductions.pt.toFixed(2), 450, tableTop + 60);

        doc.moveDown(5);
        doc.fontSize(12).text(`NET SALARY: ₹${payroll.netSalary.toFixed(2)}`, { align: 'right', bold: true });
        
        doc.end();
        return filePath;
    }

    static async generateBulkPayslips(payrolls, employees, company) {
        const filePaths = [];
        for (const payroll of payrolls) {
            const employee = employees.find(emp => emp.id === payroll.employeeId);
            if (employee) {
                const filePath = this.generatePayslip(payroll, employee, company);
                filePaths.push({ filePath, employee, payroll });
            }
        }
        return filePaths;
    }
}

module.exports = PDFService;
