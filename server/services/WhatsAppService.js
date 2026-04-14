const axios = require('axios');

class WhatsAppService {
    /**
     * Sends a payslip notification to an employee
     * @param {string} phone - Employee phone number (with country code)
     * @param {Object} payrollData - Payroll details for the month
     */
    static async sendPayslipNotification(phone, payrollData) {
        const { employeeName, month, year, netSalary, downloadUrl } = payrollData;

        // In production, we use Meta's WhatsApp Cloud API or Twilio
        // Example payload for Meta API:
        const payload = {
            messaging_product: "whatsapp",
            to: phone,
            type: "template",
            template: {
                name: "payslip_notification",
                language: { code: "en_US" },
                components: [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: employeeName },
                            { type: "text", text: `${month} ${year}` },
                            { type: "text", text: `₹${netSalary.toLocaleString()}` }
                        ]
                    },
                    {
                        type: "button",
                        sub_type: "url",
                        index: "0",
                        parameters: [{ type: "text", text: downloadUrl }]
                    }
                ]
            }
        };

        console.log(`[WhatsApp] Sending payslip to ${phone}...`);
        
        // Mocking the API call for development
        // if (process.env.WHATSAPP_TOKEN) {
        //     await axios.post(`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`, payload, {
        //         headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` }
        //     });
        // }

        return { success: true, message: `Payslip notification queued for ${employeeName}` };
    }
}

module.exports = WhatsAppService;
