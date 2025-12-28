const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/send-confirmation', async (req, res) => {
    const { email, phone, date, time, consultantName, fee } = req.body;

    // 1. Ethereal પર ડમી એકાઉન્ટ બનાવો (દર વખતે નવું બનશે)
    let testAccount = await nodemailer.createTestAccount();

    // 2. Transporter સેટ કરો
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
            user: testAccount.user, // ડમી યુઝર
            pass: testAccount.pass, // ડમી પાસવર્ડ
        },
    });

    try {
        let info = await transporter.sendMail({
            from: '"Finova Admin" <admin@finova.com>',
            to: email, // યુઝરે નાખેલું ઈમેલ
            subject: `Booking Confirmed: ${consultantName}`,
            html: `<h3>Success! Your appointment is on ${date} at ${time}.</h3>`
        });

        // આ URL પર ક્લિક કરવાથી તમે મોકલેલો મેસેજ જોઈ શકશો
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.status(200).json({ 
            success: true, 
            preview: nodemailer.getTestMessageUrl(info) // બ્રાઉઝરમાં જોવા માટે
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));