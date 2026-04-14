const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class Form16Service {
    static async generateForm16(employee, company, financialYear, totalEarnings, totalTDS) {
        const doc = new PDFDocument({ margin: 50 });
        const filename = `Form16_${employee.employeeId}_${financialYear}.pdf`;
        const artifactsDir = path.join(__dirname, '../artifacts');
        const filePath = path.join(artifactsDir, filename);

        // Ensure directory exists
        if (!fs.existsSync(artifactsDir)) {
            fs.mkdirSync(artifactsDir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc.fontSize(18).text(company.name, { align: 'center' });
        doc.fontSize(10).text(company.address, { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text('FORM NO. 16', { align: 'center', underline: true });
        doc.fontSize(10).text('[See rule 31(1)(a)]', { align: 'center' });
        doc.moveDown();
        doc.text('Certificate under section 203 of the Income-tax Act, 1961 for tax deducted at source on salary', { align: 'center' });
        doc.moveDown();

        // Part A
        doc.fontSize(12).text('PART A: Details of Tax Deducted and Deposited', { bold: true });
        doc.moveDown(0.5);
        doc.fontSize(10);
        doc.text(`Employee Name: ${employee.name}`);
        doc.text(`Employee PAN: ${employee.pan || 'N/A'}`);
        doc.text(`Company TAN: ${company.tan || 'N/A'}`);
        doc.text(`Financial Year: ${financialYear}`);
        doc.text(`Assessment Year: ${parseInt(financialYear.split('-')[1]) + 2000}-${parseInt(financialYear.split('-')[1]) + 2001}`);
        doc.moveDown();

        // Summary Table
        const tableTop = 300;
        doc.text('QUARTER', 50, tableTop, { bold: true });
        doc.text('GROSS SALARY', 150, tableTop, { bold: true });
        doc.text('TDS DEDUCTED', 300, tableTop, { bold: true });
        doc.text('TDS DEPOSITED', 450, tableTop, { bold: true });

        // Line items (Summary for all quarters)
        doc.text('Summary', 50, tableTop + 20);
        doc.text(totalEarnings.toFixed(2), 150, tableTop + 20);
        doc.text(totalTDS.toFixed(2), 300, tableTop + 20);
        doc.text(totalTDS.toFixed(2), 450, tableTop + 20);

        doc.moveDown(5);
        doc.fontSize(12).text(`TOTAL TAX DEPOSITED: ₹${totalTDS.toFixed(2)}`, { align: 'right', bold: true });
        
        doc.end();
        return filePath;
    }
}

module.exports = Form16Service;
