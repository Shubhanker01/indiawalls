import nodemailer from 'nodemailer';

const GMAIL_SENDER = 'shubhanker263@gmail.com';

let transporter;

function getAdminRecipients() {
    return [...new Set(
        [process.env.ADMIN_EMAIL, process.env.ALLOWED_ADMIN_EMAILS]
            .filter(Boolean)
            .flatMap((value) => value.split(','))
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean)
    )];
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[character]);
}

export async function sendPasswordLockoutAlertEmail({ identifier, attempts, lockedAt }) {
    const appPassword = process.env.GMAIL_APP_PASSWORD;
    if (!appPassword) {
        throw new Error('GMAIL_APP_PASSWORD is not configured.');
    }

    const recipients = getAdminRecipients();
    if (recipients.length === 0) {
        throw new Error('ADMIN_EMAIL or ALLOWED_ADMIN_EMAILS must be configured.');
    }

    if (!identifier || !Number.isInteger(attempts) || !lockedAt) {
        throw new Error('A locked account identifier, attempt count, and lock time are required.');
    }

    transporter ??= nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_SENDER,
            pass: appPassword,
        },
    });

    const lockTime = new Date(lockedAt).toISOString();
    const safeIdentifier = escapeHtml(identifier);
    await transporter.sendMail({
        from: {
            name: 'Rajasthan Walls Security',
            address: GMAIL_SENDER,
        },
        to: recipients,
        subject: 'Admin security alert: account locked',
        text:
            `The account ${identifier} was locked after ${attempts} failed password attempts at ${lockTime}. ` +
            'The account password was invalidated as part of the lockout response.',
        html:
            `<p>An account was locked after repeated failed password attempts.</p>` +
            `<p><strong>Account:</strong> ${safeIdentifier}</p>` +
            `<p><strong>Failed attempts:</strong> ${attempts}</p>` +
            `<p><strong>Locked at (UTC):</strong> ${lockTime}</p>` +
            '<p>The account password was invalidated as part of the lockout response.</p>',
    });
}
