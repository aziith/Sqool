const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject,
            text,
            html,
        });
        console.log(`[Email Sent] Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('[Email Error]', error);
        // During development, we don't want to crash if email fails, 
        // just log it and proceed (optional based on requirements)
        // throw error; 
    }
};

const sendOTPEmail = async (email, otp) => {
    const subject = 'Your Verification Code - Sqool';
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #1e3a8a;">Verify Your Account</h2>
            <p>Hello,</p>
            <p>Your one-time password (OTP) for registration is:</p>
            <div style="background: #f1f5f9; padding: 15px; text-align: center; border-radius: 10px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3b82f6;">${otp}</span>
            </div>
            <p>This code will expire in 60 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
            <p style="font-size: 12px; color: #64748b;">&copy; 2026 Sqool. All rights reserved.</p>
        </div>
    `;
    
    return sendEmail({
        to: email,
        subject,
        text: `Your verification code is: ${otp}`,
        html,
    });
};

module.exports = {
    sendEmail,
    sendOTPEmail,
};
