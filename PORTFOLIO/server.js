const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the portfolio HTML file
app.use(express.static(__dirname));



const EMAIL = 'shayonmozumdar7@gmail.com';
const APP_PASSWORD = 'hzvz fcil hshw hkys';  // ← Replace with your 16-char app password

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: APP_PASSWORD
    }
});

// ─── Contact Form Endpoint ───
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all required fields.'
        });
    }

    // Email to you (notification)
    const mailToYou = {
        from: `"Portfolio Contact" <${EMAIL}>`,
        to: EMAIL,
        replyTo: email,
        subject: `📬 Portfolio: ${subject || 'New Message'} — from ${name}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
                <div style="background: linear-gradient(135deg, #0a7d63, #5b4cc4); padding: 24px 32px;">
                    <h2 style="color: #fff; margin: 0; font-size: 20px;">New Portfolio Message</h2>
                </div>
                <div style="padding: 32px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 80px;">From</td>
                            <td style="padding: 8px 0; color: #111827; font-weight: 600;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0a7d63;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subject</td>
                            <td style="padding: 8px 0; color: #111827;">${subject || 'No subject'}</td>
                        </tr>
                    </table>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
                    <div style="color: #374151; line-height: 1.7; white-space: pre-wrap;">${message}</div>
                </div>
                <div style="background: #f3f4f6; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af;">
                    Sent from your portfolio contact form
                </div>
            </div>
        `
    };

    // Auto-reply to the sender
    const mailToSender = {
        from: `"Shayon Mozumdar" <${EMAIL}>`,
        to: email,
        subject: `Thanks for reaching out, ${name}! 👋`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
                <div style="background: linear-gradient(135deg, #0a7d63, #5b4cc4); padding: 24px 32px;">
                    <h2 style="color: #fff; margin: 0; font-size: 20px;">Thanks for your message!</h2>
                </div>
                <div style="padding: 32px; color: #374151; line-height: 1.8;">
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>Thanks for getting in touch! I've received your message and will get back to you within <strong>24 hours</strong>.</p>
                    <p>Here's a copy of what you sent:</p>
                    <blockquote style="border-left: 3px solid #0a7d63; padding: 12px 16px; background: #f0fdf4; border-radius: 0 8px 8px 0; margin: 16px 0; color: #374151;">
                        ${message}
                    </blockquote>
                    <p>Best regards,<br><strong>Shayon Mozumdar</strong><br>Full Stack Developer</p>
                </div>
                <div style="background: #f3f4f6; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af;">
                    This is an automated reply — no need to respond to this email.
                </div>
            </div>
        `
    };

    try {
        // Send both emails
        await transporter.sendMail(mailToYou);
        await transporter.sendMail(mailToSender);

        console.log(`✓ Message from ${name} (${email})`);
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('✕ Email error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Portfolio server running at http://localhost:${PORT}`);
    console.log(`📬 Contact form endpoint: http://localhost:${PORT}/api/contact\n`);
});
