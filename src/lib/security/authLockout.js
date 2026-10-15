import crypto from 'node:crypto';
import dbConnect from '../dbConnect.js';
import { sendPasswordLockoutAlertEmail } from '../email/passwordLockoutAlert.js';
import { sendPasswordRecoveryEmail } from '../email/passwordRecovery.js';
import { sendMfaResetOtpEmail } from '../email/mfaResetOtp.js';
import AuthSecurityTracker from '../../models/AuthSecurityTracker.mjs';
import { supabaseAdmin } from '../supabase/admin.js';

export const MAX_PASSWORD_ATTEMPTS = 5;
export const MAX_MFA_ATTEMPTS = 5;
export const MAX_OTP_VERIFY_ATTEMPTS = 3;
export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Normalizes email identifier for consistent tracking.
 */
export function normalizeIdentifier(email) {
    return (email || '').trim().toLowerCase();
}

const PASSWORD_RECOVERY_EMAIL_RETRY_MS = 60 * 1000;
const PASSWORD_RECOVERY_LINK_TTL_MS = 15 * 60 * 1000;

function getPasswordRecoveryUrl(tokenHash) {
    const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    if (
        !['http:', 'https:'].includes(siteUrl.protocol) ||
        siteUrl.username ||
        siteUrl.password
    ) {
        throw new Error('NEXT_PUBLIC_SITE_URL must be a valid HTTP or HTTPS origin.');
    }

    const recoveryUrl = new URL('/password-reset', siteUrl);
    recoveryUrl.searchParams.set('token_hash', tokenHash);
    recoveryUrl.searchParams.set('type', 'recovery');
    return recoveryUrl.toString();
}

async function sendRecoveryEmailForLockedAccount(identifier, tracker, invalidatePassword = false) {
    const now = Date.now();
    const hasUsableToken =
        tracker.passwordResetToken &&
        tracker.passwordResetExpires &&
        tracker.passwordResetExpires.getTime() > now;

    if (
        tracker.passwordRecoveryEmailSentAt &&
        hasUsableToken &&
        tracker.passwordRecoveryEmailSentAt.getTime() > now - PASSWORD_RECOVERY_LINK_TTL_MS
    ) {
        return true;
    }

    if (
        tracker.passwordRecoveryEmailAttemptedAt &&
        tracker.passwordRecoveryEmailAttemptedAt.getTime() > now - PASSWORD_RECOVERY_EMAIL_RETRY_MS
    ) {
        return false;
    }

    tracker.passwordRecoveryEmailAttemptedAt = new Date(now);
    await tracker.save();

    try {
        let tokenHash = hasUsableToken ? tracker.passwordResetToken : null;

        if (!tokenHash) {
            const { data: linkData, error: linkError } =
                await supabaseAdmin.auth.admin.generateLink({
                    type: 'recovery',
                    email: identifier,
                });

            if (linkError) {
                throw linkError;
            }

            tokenHash = linkData?.properties?.hashed_token;
            if (!tokenHash) {
                throw new Error('Supabase did not return a password recovery token.');
            }

            tracker.passwordResetToken = tokenHash;
            tracker.passwordResetExpires = new Date(now + PASSWORD_RECOVERY_LINK_TTL_MS);
            tracker.passwordRecoveryEmailSentAt = null;
            await tracker.save();

            if (invalidatePassword) {
                const userId = linkData?.user?.id;
                if (!userId) {
                    throw new Error('Supabase did not return the account for the recovery link.');
                }

                const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                    userId,
                    {
                        password: crypto.randomBytes(32).toString('hex') + '!' + Date.now() + 'Aa1#',
                    }
                );
                if (updateError) {
                    throw updateError;
                }
            }
        }

        await sendPasswordRecoveryEmail(identifier, getPasswordRecoveryUrl(tokenHash));
        tracker.passwordRecoveryEmailSentAt = new Date();
        await tracker.save();
        console.info(`[AUTH_SECURITY] Password recovery email accepted for "${identifier}".`);
        return true;
    } catch (emailError) {
        await tracker.save();
        console.error('[AUTH_SECURITY] Password recovery email delivery failed:', {
            code: emailError?.code,
            responseCode: emailError?.responseCode,
            command: emailError?.command,
            message: emailError?.message,
        });
        return false;
    }
}

/**
 * Checks if an email account is currently locked due to brute-force password failures.
 */
export async function checkLoginLockout(email) {
    const identifier = normalizeIdentifier(email);
    if (!identifier) {
        return { locked: false, attemptsRemaining: MAX_PASSWORD_ATTEMPTS };
    }

    await dbConnect();
    const tracker = await AuthSecurityTracker.findOne({ identifier });

    if (tracker?.isPasswordLocked) {
        const recoveryEmailSent = await sendRecoveryEmailForLockedAccount(identifier, tracker);
        return {
            locked: true,
            attemptsRemaining: 0,
            message: recoveryEmailSent
                ? 'Your account is locked after 5 failed login attempts. A password recovery link has been sent to your email.'
                : 'Your account is locked after 5 failed login attempts, but we could not send a recovery email. Please contact an administrator.',
        };
    }

    const currentFailures = tracker?.passwordFailures || 0;
    const attemptsRemaining = Math.max(0, MAX_PASSWORD_ATTEMPTS - currentFailures);

    return {
        locked: false,
        attempts: currentFailures,
        attemptsRemaining,
    };
}

/**
 * Records a failed password attempt, checks threshold, and triggers emergency lockout if 5 attempts reached.
 */
export async function handleLoginFailure(email) {
    const identifier = normalizeIdentifier(email);
    if (!identifier) {
        return {
            locked: false,
            attemptsRemaining: MAX_PASSWORD_ATTEMPTS,
            message: 'Invalid email or password.',
        };
    }

    await dbConnect();
    const tracker = await AuthSecurityTracker.findOneAndUpdate(
        { identifier },
        {
            $inc: { passwordFailures: 1 },
            $set: { lastFailedAt: new Date() },
        },
        { upsert: true, returnDocument: 'after' }
    );

    // Check if threshold breached
    if (tracker.passwordFailures >= MAX_PASSWORD_ATTEMPTS) {
        tracker.isPasswordLocked = true;
        tracker.lockedAt = new Date();

        const recoveryEmailSent = await sendRecoveryEmailForLockedAccount(identifier, tracker, true);

        await tracker.save();

        try {
            await sendPasswordLockoutAlertEmail({
                identifier,
                attempts: tracker.passwordFailures,
                lockedAt: tracker.lockedAt,
            });
        } catch (emailErr) {
            console.error('[AUTH_SECURITY] Password lockout alert email failed:', emailErr);
        }

        console.warn(
            `[SECURITY ALERT] Account "${identifier}" LOCKED after ${tracker.passwordFailures} failed attempts. Password invalidated.`
        );

        return {
            locked: true,
            attemptsRemaining: 0,
            message: recoveryEmailSent
                ? 'Your account is locked after 5 failed login attempts. A password recovery link has been sent to your email.'
                : 'Your account is locked after 5 failed login attempts, but we could not send a recovery email. Please contact an administrator.',
        };
    }

    await tracker.save();
    const remaining = Math.max(0, MAX_PASSWORD_ATTEMPTS - tracker.passwordFailures);

    return {
        locked: false,
        attemptsRemaining: remaining,
        message: `Invalid email or password. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`,
    };
}

export async function handlePasswordResetSuccess(email) {
    const identifier = normalizeIdentifier(email);
    if (!identifier) {
        throw new Error('A valid account email is required to reset the lockout.');
    }

    await dbConnect();
    await AuthSecurityTracker.findOneAndUpdate(
        { identifier },
        {
            $set: {
                passwordFailures: 0,
                isPasswordLocked: false,
                passwordResetToken: null,
                passwordResetExpires: null,
                passwordRecoveryEmailAttemptedAt: null,
                passwordRecoveryEmailSentAt: null,
                lockedAt: null,
            },
        }
    );
}

/**
 * Resets password failure counter and lockout flags upon successful authentication.
 */
export async function handleLoginSuccess(email) {
    const identifier = normalizeIdentifier(email);
    if (!identifier) return;

    await dbConnect();
    await AuthSecurityTracker.findOneAndUpdate(
        { identifier },
        {
            $set: {
                passwordFailures: 0,
                isPasswordLocked: false,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        }
    );
}

/**
 * Checks if MFA is frozen due to 5 consecutive TOTP failures.
 */
export async function checkMfaLockout(email) {
    const identifier = normalizeIdentifier(email);
    if (!identifier) {
        return { locked: false, attemptsRemaining: MAX_MFA_ATTEMPTS };
    }

    await dbConnect();
    const tracker = await AuthSecurityTracker.findOne({ identifier }).lean();

    if (tracker?.isMfaLocked) {
        return {
            locked: true,
            attemptsRemaining: 0,
            message:
                'MFA input is frozen due to 5 failed attempts. Please verify the emergency OTP dispatched to your email to reset your authenticator.',
        };
    }

    const currentFailures = tracker?.mfaFailures || 0;
    const attemptsRemaining = Math.max(0, MAX_MFA_ATTEMPTS - currentFailures);

    return {
        locked: false,
        attempts: currentFailures,
        attemptsRemaining,
    };
}

/**
 * Records a failed MFA TOTP verification, locks MFA at 5 attempts, and generates emergency email OTP.
 */
export async function handleMfaFailure(user) {
    const email = user?.email;
    const identifier = normalizeIdentifier(email);

    if (!identifier) {
        return {
            locked: false,
            attemptsRemaining: MAX_MFA_ATTEMPTS,
            message: 'Invalid code. Try again.',
        };
    }

    await dbConnect();
    const tracker = await AuthSecurityTracker.findOneAndUpdate(
        { identifier },
        {
            $inc: { mfaFailures: 1 },
            $set: { lastFailedAt: new Date() },
        },
        { upsert: true, returnDocument: 'after' }
    );

    if (tracker.mfaFailures >= MAX_MFA_ATTEMPTS) {
        tracker.isMfaLocked = true;
        tracker.lockedAt = new Date();

        // Generate emergency 6-digit OTP
        const otp = String(crypto.randomInt(100000, 999999));
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

        tracker.mfaOtpHash = otpHash;
        tracker.mfaOtpExpires = new Date(Date.now() + OTP_TTL_MS);
        tracker.mfaOtpAttempts = 0;
        await tracker.save();

        console.warn(
            `[SECURITY ALERT] MFA LOCKED for "${identifier}" after 5 failed TOTP attempts. ` +
            `Emergency 6-digit OTP generated: [ ${otp} ] (Expires in 10 minutes).`
        );

        return {
            locked: true,
            attemptsRemaining: 0,
            otp, // Available in server logs/testing
            message:
                'MFA locked: 5 failed attempts reached. Authenticator input is frozen. An emergency 6-digit recovery OTP has been dispatched to your email to reset your authenticator.',
        };
    }

    await tracker.save();
    const remaining = Math.max(0, MAX_MFA_ATTEMPTS - tracker.mfaFailures);

    return {
        locked: false,
        attemptsRemaining: remaining,
        message: `Invalid code. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`,
    };
}

/**
 * Resets MFA failure counters upon successful TOTP verification.
 */
export async function handleMfaSuccess(user) {
    const identifier = normalizeIdentifier(user?.email);
    if (!identifier) return;

    await dbConnect();
    await AuthSecurityTracker.findOneAndUpdate(
        { identifier },
        {
            $set: {
                mfaFailures: 0,
                isMfaLocked: false,
                mfaOtpHash: null,
                mfaOtpExpires: null,
                mfaOtpAttempts: 0,
            },
        }
    );
}

/**
 * Manually or programmatically triggers an emergency OTP for MFA reset.
 */
export async function requestMfaResetOtp(email) {
    const identifier = normalizeIdentifier(email);
    if (!identifier) {
        throw new Error('Valid email required for MFA reset.');
    }

    await dbConnect();
    const otp = String(crypto.randomInt(100000, 999999));
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    await AuthSecurityTracker.findOneAndUpdate(
        { identifier },
        {
            $set: {
                mfaOtpHash: otpHash,
                mfaOtpExpires: new Date(Date.now() + OTP_TTL_MS),
                mfaOtpAttempts: 0,
                isMfaLocked: true,
            },
        },
        { upsert: true, returnDocument: 'after' }
    );

    await sendMfaResetOtpEmail(identifier, otp);

    return {
        success: true,
        message: 'A 6-digit recovery OTP has been dispatched to your email.',
    };
}

/**
 * Verifies email OTP and purges old MFA factors, restoring account to clean AAL1 so admin can re-enroll.
 */
export async function verifyMfaResetOtpAndPurgeFactors(user, submittedOtp) {
    const email = user?.email;
    const identifier = normalizeIdentifier(email);

    if (!identifier || !submittedOtp) {
        return { success: false, error: 'Email and 6-digit OTP code are required.' };
    }

    await dbConnect();
    const tracker = await AuthSecurityTracker.findOne({ identifier });

    if (!tracker || !tracker.mfaOtpHash || !tracker.mfaOtpExpires) {
        return { success: false, error: 'No active OTP found. Please request a new OTP.' };
    }

    if (new Date() > tracker.mfaOtpExpires) {
        return { success: false, error: 'Recovery OTP has expired. Please request a new OTP.' };
    }

    if ((tracker.mfaOtpAttempts || 0) >= MAX_OTP_VERIFY_ATTEMPTS) {
        return {
            success: false,
            error: 'Maximum OTP verification attempts exceeded. Please request a new OTP.',
        };
    }

    // Verify OTP using constant-time comparison
    const submittedHash = crypto.createHash('sha256').update(submittedOtp.trim()).digest('hex');
    const isMatch = crypto.timingSafeEqual(
        Buffer.from(submittedHash, 'utf8'),
        Buffer.from(tracker.mfaOtpHash, 'utf8')
    );

    if (!isMatch) {
        tracker.mfaOtpAttempts = (tracker.mfaOtpAttempts || 0) + 1;
        await tracker.save();
        const left = MAX_OTP_VERIFY_ATTEMPTS - tracker.mfaOtpAttempts;
        return {
            success: false,
            error: `Invalid OTP code. (${Math.max(0, left)} attempt${left === 1 ? '' : 's'} remaining)`,
        };
    }

    // OTP is valid! Purge all enrolled factors for the user so they can set up a fresh authenticator
    const { data: factorsData, error: listError } = await supabaseAdmin.auth.admin.mfa.listFactors({
        userId: user.id,
    });
    if (listError) {
        console.error('[AUTH_SECURITY] listFactors failed:', listError.message);
        return { success: false, error: 'Could not reset MFA. Please try again.' };
    }

    for (const factor of factorsData?.factors || []) {
        const { error: deleteError } = await supabaseAdmin.auth.admin.mfa.deleteFactor({
            id: factor.id, // was `factorId`, which the SDK ignores
            userId: user.id,
        });
        if (deleteError) {
            console.error('[AUTH_SECURITY] deleteFactor failed:', deleteError.message);
            return { success: false, error: 'Could not reset MFA. Please try again.' };
        }
    }

    // Reset MFA security tracker
    tracker.mfaFailures = 0;
    tracker.isMfaLocked = false;
    tracker.mfaOtpHash = null;
    tracker.mfaOtpExpires = null;
    tracker.mfaOtpAttempts = 0;
    await tracker.save();

    console.info(`[AUTH_SECURITY] Successfully reset and un-enrolled MFA for user "${identifier}".`);

    return {
        success: true,
        message: 'MFA authenticator successfully reset. Please register your new authenticator app.',
    };
}
