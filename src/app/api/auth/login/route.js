import { apiResponse } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
    checkLoginLockout,
    handleLoginFailure,
    handleLoginSuccess,
} from '@/lib/security/authLockout';

// Basic RFC 5322 compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request) {
    let body;

    try {
        body = await request.json();
    } catch {
        return apiResponse({ error: 'Invalid request body.' }, { status: 400 });
    }

    // 1. Type check and length cap (prevents DoS payloads)
    let rawEmail = typeof body?.email === 'string' ? body.email.trim() : '';
    let rawPassword = typeof body?.password === 'string' ? body.password : '';

    if (rawEmail.length > 254 || rawPassword.length > 128) {
        return apiResponse({ error: 'Input length exceeds limit.' }, { status: 400 });
    }

    // 2. Email format validation
    const email = rawEmail.toLowerCase();
    if (!email || !EMAIL_REGEX.test(email)) {
        return apiResponse({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!rawPassword) {
        return apiResponse({ error: 'Password is required.' }, { status: 400 });
    }

    // 3. Brute-force protection: Check 5-attempt account lockout status
    const lockout = await checkLoginLockout(email);
    if (lockout.locked) {
        return apiResponse(
            { error: lockout.message, locked: true },
            { status: 423 } // 423 Locked
        );
    }

    // 4. Initialize response & Supabase client
    let response = apiResponse({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    // 5. Authenticate
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: rawPassword,
    });

    if (error || !data?.user) {
        // Enforce 5-attempt threshold lockout, invalidate old password, and dispatch reset link
        const failResult = await handleLoginFailure(email);
        const status = failResult.locked ? 423 : 401;

        return apiResponse(
            {
                error: failResult.message,
                locked: failResult.locked,
                attemptsRemaining: failResult.attemptsRemaining,
            },
            { status }
        );
    }

    // Reset failed counter upon successful password authentication
    await handleLoginSuccess(email);

    // 6. Check Authenticator Assurance Level (MFA)
    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    let nextStep = 'done';

    if (aalError) {
        return apiResponse({ error: 'Internal server error occurred.' }, { status: 500 });
    }

    if (aal?.nextLevel === 'aal1') {
        nextStep = 'mfa-setup';
    } else if (aal?.nextLevel === 'aal2') {
        nextStep = 'mfa';
    }

    return getResponse(apiResponse({ ok: true, nextStep }));
}