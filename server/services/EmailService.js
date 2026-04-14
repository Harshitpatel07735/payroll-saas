const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
    static async sendPayslipEmail(employee, payroll, filePath) {
        if (!employee.email) {
            console.warn(`No email address found for employee ${employee.employeeId}`);
            return;
        }

        const emailData = {
            to: employee.email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: `Payslip for ${payroll.month} ${payroll.year}`,
            text: `Dear ${employee.name},\n\nPlease find attached your payslip for ${payroll.month} ${payroll.year}.\n\nRegards,\nPayroll Team`,
            html: `<p>Dear ${employee.name},</p><p>Please find attached your payslip for <strong>${payroll.month} ${payroll.year}</strong>.</p><p>Regards,<br>Payroll Team</p>`,
            attachments: [
                {
                    content: fs.readFileSync(filePath).toString('base64'),
                    filename: path.basename(filePath),
                    type: 'application/pdf',
                    disposition: 'attachment'
                }
            ]
        };

        try {
            await sgMail.send(emailData);
            console.log(`Payslip email sent successfully to ${employee.email}`);
        } catch (error) {
            console.error('Error sending email via SendGrid:', error);
            if (error.response) {
                console.error(error.response.body);
            }
            throw error;
        }
    }
}

module.exports = EmailService;
