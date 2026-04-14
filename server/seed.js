const sequelize = require('./config/database');
const Company = require('./models/Company');
const User = require('./models/User');
const Employee = require('./models/Employee');

async function seed() {
    await sequelize.sync({ force: true });
    
    const company = await Company.create({
        name: 'Apex Manufacturing Solutions',
        state: 'Gujarat',
        address: 'GIDC Industrial Estate, Ahmedabad, Gujarat',
        pfCode: 'GJ/AHM/1234567',
        esiCode: '31000123450011001',
        settings: {
            workingDaysDefault: 26,
            financialYear: 'April-March'
        }
    });

    await User.create({
        name: 'Admin User',
        email: 'admin@apex.com',
        password: 'password1234',
        role: 'Admin',
        companyId: company.id
    });

    await Employee.create({
        employeeId: 'EMP001',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        department: 'Production',
        designation: 'Machine Operator',
        salaryStructure: {
            basic: 12000,
            hra: 2400,
            da: 1200,
            conveyance: 500,
            otherAllowances: 0
        },
        companyId: company.id
    });

    console.log('Seed data created successfully');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
