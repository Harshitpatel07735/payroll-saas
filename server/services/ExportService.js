const ExcelJS = require('exceljs');

class ExportService {
    static async exportEmployeesToExcel(employees) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Employees');

        worksheet.columns = [
            { header: 'Employee ID', key: 'employeeId', width: 15 },
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Department', key: 'department', width: 20 },
            { header: 'Designation', key: 'designation', width: 20 },
            { header: 'Basic Salary', key: 'basic', width: 15 },
            { header: 'HRA', key: 'hra', width: 15 },
            { header: 'DA', key: 'da', width: 15 },
        ];

        employees.forEach(emp => {
            worksheet.addRow({
                employeeId: emp.employeeId,
                name: emp.name,
                email: emp.email,
                department: emp.department,
                designation: emp.designation,
                basic: emp.salaryStructure.basic,
                hra: emp.salaryStructure.hra,
                da: emp.salaryStructure.da
            });
        });

        // Styling
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }
}

module.exports = ExportService;
