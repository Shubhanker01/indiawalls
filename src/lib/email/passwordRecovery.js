import nodemailer from 'nodemailer';

const GMAIL_SENDER = process.env.GMAIL_SENDER_EMAIL || 'shubhanker263@gmail.com';

let transporter;

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[character]);
}

export async function sendPasswordRecoveryEmail(to, recoveryUrl) {
    const appPassword = process.env.GMAIL_APP_PASSWORD;
    if (!appPassword) {
        throw new Error('GMAIL_APP_PASSWORD is not configured.');
    }

    if (!to || !recoveryUrl) {
        throw new Error('A recipient email and password recovery URL are required.');
    }

    transporter ??= nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_SENDER,
            pass: appPassword,
        },
    });

    const result = await transporter.sendMail({
        from: {
            name: 'Rajasthan Walls Security',
            address: GMAIL_SENDER,
        },
        to,
        subject: 'Reset your Rajasthan Walls admin password',
        text:
            `Your account was locked after 5 failed password attempts. Use this link to set a new password: ${recoveryUrl}\n\n` +
            'This link expires in 15 minutes. If you did not attempt to sign in, contact an administrator.',
        html:
            '<p>Your account was locked after 5 failed password attempts.</p>' +
            `<p><a href="${escapeHtml(recoveryUrl)}">Set a new password</a></p>` +
            '<p>This link expires in 15 minutes. If you did not attempt to sign in, contact an administrator.</p>',
    });

    if (!result.accepted?.length || result.rejected?.length) {
        throw new Error(
            `Recovery email was not accepted by the mail server (accepted: ${result.accepted?.length || 0}, rejected: ${result.rejected?.length || 0}).`
        );
    }

    return result;
}
