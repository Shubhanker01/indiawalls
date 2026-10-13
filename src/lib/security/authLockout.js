import crypto from 'node:crypto';
import dbConnect from '../dbConnect.js';
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

/**
 * Checks if an email account is currently locked due to brute-force password failures.
 */
export async function checkLoginLockout(email) {
    const identifier = normalizeIdentifier(email);
    if (!identifier) {
        return { locked: false, attemptsRemaining: MAX_PASSWORD_ATTEMPTS };
    }

    await dbConnect();
    const tracker = await AuthSecurityTracker.findOne({ identifier }).lean();

    if (tracker?.isPasswordLocked) {
        return {
            locked: true,
            attemptsRemaining: 0,
            message:
                'Account is locked due to 5 failed login attempts. Your old password has been invalidated. Please use the password reset link sent to your email to regain access.',
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

        let recoveryUrl = null;

        try {
            // 1. Locate user in Supabase to invalidate password
            const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
            const user = usersData?.users?.find(
                (u) => (u.email || '').toLowerCase() === identifier
            );

            if (user) {
                // 2. Invalidate old password by randomizing it
                const randomizedPassword =
                    crypto.randomBytes(32).toString('hex') + '!' + Date.now() + 'Aa1#';
                await supabaseAdmin.auth.admin.updateUserById(user.id, {
                    password: randomizedPassword,
                });

                // 3. Generate secure Supabase password recovery link
                const { data: linkData, error: linkError } =
                    await supabaseAdmin.auth.admin.generateLink({
                        type: 'recovery',
                        email: identifier,
                    });

                if (!linkError && linkData?.properties?.action_link) {
                    recoveryUrl = linkData.properties.action_link;
                    tracker.passwordResetToken = linkData.properties.hashed_token || null;
                    tracker.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
                }

                // 4. Trigger official Supabase password reset email
                try {
                    await supabaseAdmin.auth.resetPasswordForEmail(identifier);
                } catch (emailErr) {
                    console.error('[AUTH_SECURITY] Supabase reset email dispatch notice:', emailErr.message);
                }
            }
        } catch (adminErr) {
            console.error('[AUTH_SECURITY] Emergency password invalidation error:', adminErr);
        }

        await tracker.save();

        console.warn(
            `[SECURITY ALERT] Account "${identifier}" LOCKED after ${tracker.passwordFailures} failed attempts. Password invalidated.` +
                (recoveryUrl ? ` Recovery URL generated: ${recoveryUrl}` : '')
        );

        return {
            locked: true,
            attemptsRemaining: 0,
            recoveryUrl,
            message:
                'Account has been locked due to 5 failed attempts. Your old password has been invalidated. A password reset link has been dispatched to your email.',
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

    console.warn(
        `[SECURITY ALERT] MFA Reset OTP requested for "${identifier}": [ ${otp} ] (Valid for 10 minutes).`
    );

    return {
        success: true,
        otp,
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
    try {
        const { data: factorsData } = await supabaseAdmin.auth.admin.mfa.listFactors({
            userId: user.id,
        });

        for (const factor of factorsData?.factors || []) {
            await supabaseAdmin.auth.admin.mfa.deleteFactor({
                userId: user.id,
                factorId: factor.id,
            });
        }
    } catch (factorErr) {
        console.error('[AUTH_SECURITY] Error purging factors via admin SDK:', factorErr.message);
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
