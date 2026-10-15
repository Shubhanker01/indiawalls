import nodemailer from 'nodemailer';

const GMAIL_SENDER =
    process.env.GMAIL_USER || process.env.GMAIL_SENDER_EMAIL || 'shubhanker263@gmail.com';

let transporter;

export async function sendMfaResetOtpEmail(to, otp, { lockout = false } = {}) {
    const appPassword = process.env.GMAIL_APP_PASSWORD;
    if (!appPassword) {
        throw new Error('GMAIL_APP_PASSWORD is not configured.');
    }

    if (!to || !/^\d{6}$/.test(otp)) {
        throw new Error('A recipient email and valid 6-digit OTP are required.');
    }

    transporter ??= nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_SENDER,
            pass: appPassword,
        },
    });

    const subject = lockout
        ? 'ALERT: Admin MFA locked after failed attempts'
        : 'Your MFA reset recovery code';
    const message = lockout
        ? `ALERT: 5 failed MFA attempts detected. MFA has been frozen. Use this OTP to reset your authenticator: ${otp}. It expires in 10 minutes.`
        : `Your MFA reset recovery code is ${otp}. It expires in 10 minutes.`;
    const htmlMessage = lockout
        ? `<p><strong>ALERT:</strong> 5 failed MFA attempts detected. MFA has been frozen.</p><p>Use this OTP to reset your authenticator:</p><p style="font-size:24px;font-weight:bold;letter-spacing:6px">${otp}</p><p>This code expires in 10 minutes. If you did not request this code, contact an administrator.</p>`
        : `<p>Your MFA reset recovery code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:6px">${otp}</p><p>This code expires in 10 minutes. If you did not request this code, ignore this email.</p>`;

    const result = await transporter.sendMail({
        from: {
            name: 'Rajasthan Walls Security',
            address: GMAIL_SENDER,
        },
        to,
        subject,
        text: message,
        html: htmlMessage,
    });

    if (!result.accepted?.length || result.rejected?.length) {
        throw new Error(
            `MFA reset email was not accepted by the mail server (accepted: ${result.accepted?.length || 0}, rejected: ${result.rejected?.length || 0}).`
        );
    }
}
