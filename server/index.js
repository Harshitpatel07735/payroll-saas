const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

// Import models to ensure associations are defined if needed
const User = require('./models/User');
const Company = require('./models/Company');
const Employee = require('./models/Employee');
const { Attendance, Payroll } = require('./models/Payroll');
const TDSReport = require('./models/TDSReport');

// Import routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const payrollRoutes = require('./routes/payroll');
const payslipRoutes = require('./routes/payslips');
const complianceRoutes = require('./routes/compliance');

// Associations
Company.hasMany(User, { foreignKey: 'companyId' });
User.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Employee, { foreignKey: 'companyId' });
Employee.belongsTo(Company, { foreignKey: 'companyId' });

Employee.hasMany(Attendance, { foreignKey: 'employeeId' });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(Payroll, { foreignKey: 'employeeId' });
Payroll.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(TDSReport, { foreignKey: 'employeeId' });
TDSReport.belongsTo(Employee, { foreignKey: 'employeeId' });
Company.hasMany(TDSReport, { foreignKey: 'companyId' });
TDSReport.belongsTo(Company, { foreignKey: 'companyId' });

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'UP' }));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/payslips', payslipRoutes);
app.use('/api/compliance', complianceRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
