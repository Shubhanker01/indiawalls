import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requestMfaResetOtp } from '@/lib/security/authLockout';

export async function POST(request) {
    let body = {};
    try {
        body = await request.json();
    } catch {
        // Optional body if user is authenticated via cookies
    }

    const response = NextResponse.json({ ok: true });
    const { supabase } = createSupabaseServerClient({ request, response });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const email = user?.email || (typeof body?.email === 'string' ? body.email.trim().toLowerCase() : null);

    if (!email) {
        return NextResponse.json({ error: 'Admin email is required to request MFA reset OTP.' }, { status: 400 });
    }

    try {
        const result = await requestMfaResetOtp(email);
        return NextResponse.json({
            ok: true,
            message: result.message,
        });
    } catch (err) {
        return NextResponse.json({ error: err.message || 'Failed to dispatch reset OTP.' }, { status: 500 });
    }
}

