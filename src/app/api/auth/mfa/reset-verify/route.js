import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { verifyMfaResetOtpAndPurgeFactors } from '@/lib/security/authLockout';

export const runtime = 'nodejs';

function copyAuthCookies(source, destination) {
    source.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
    return destination;
}

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const otp = typeof body?.otp === 'string' ? body.otp.trim() : '';
    if (!/^\d{6}$/.test(otp)) {
        return NextResponse.json({ error: 'Please enter a valid 6-digit OTP code.' }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    // The user must have passed the password step (aal1 session). The old fallback that looked a
    // user up by an email from the request body is removed: it let anyone holding only the admin's
    // email and an OTP strip the MFA factors without ever logging in.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 });
    }

    let result;
    try {
        result = await verifyMfaResetOtpAndPurgeFactors(user, otp);
    } catch (err) {
        console.error('MFA reset failed:', err?.message);
        return copyAuthCookies(getResponse(), NextResponse.json({ error: 'Could not reset MFA.' }, { status: 500 }));
    }

    if (!result?.success) {
        return copyAuthCookies(
            getResponse(),
            NextResponse.json({ error: result?.error || 'Invalid or expired code.' }, { status: 400 })
        );
    }

    return copyAuthCookies(
        getResponse(),
        NextResponse.json({
            ok: true,
            message: result.message,
            nextStep: 'mfa-setup',
            redirect: '/mfa/setup',
        })
    );
}