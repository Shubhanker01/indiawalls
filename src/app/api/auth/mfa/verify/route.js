import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
    checkMfaLockout,
    handleMfaFailure,
    handleMfaSuccess,
} from '@/lib/security/authLockout';

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const code = typeof body?.code === 'string' ? body.code.trim() : '';
    if (!/^\d{6}$/.test(code)) {
        return NextResponse.json({ error: 'Enter a valid 6-digit code.' }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    // 1. Enforce 5-attempt hard lockout: check if MFA input is frozen
    const mfaLock = await checkMfaLockout(user.email);
    if (mfaLock.locked) {
        return NextResponse.json(
            {
                error: mfaLock.message,
                locked: true,
                redirect: '/mfa/reset',
            },
            { status: 423 } // 423 Locked
        );
    }

    // 2. Identify factor to challenge
    // Setup sends factorId from /enroll; sign-in sends none, so list verified factors
    let factorId = typeof body?.factorId === 'string' ? body.factorId : null;
    if (!factorId) {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        factorId = factors?.totp?.[0]?.id ?? null;
    }

    if (!factorId) {
        return NextResponse.json({ error: 'No MFA factor found for this account.' }, { status: 400 });
    }

    // 3. Challenge + verify in one call
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });

    if (error) {
        // Enforce 5-attempt hard lockout: increment failures, freeze input, dispatch recovery OTP
        const failResult = await handleMfaFailure(user);
        const status = failResult.locked ? 423 : 401;

        return NextResponse.json(
            {
                error: failResult.message,
                locked: failResult.locked,
                redirect: failResult.locked ? '/mfa/reset' : undefined,
                attemptsRemaining: failResult.attemptsRemaining,
            },
            { status }
        );
    }

    // Reset failure counter on successful TOTP verification
    await handleMfaSuccess(user);

    return getResponse();
}