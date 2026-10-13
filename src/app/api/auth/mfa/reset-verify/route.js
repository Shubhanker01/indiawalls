import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { verifyMfaResetOtpAndPurgeFactors } from '@/lib/security/authLockout';
import { supabaseAdmin } from '@/lib/supabase/admin';

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

    let {
        data: { user },
    } = await supabase.auth.getUser();

    // Fallback: lookup user by provided email if session cookies were cleared
    if (!user && typeof body?.email === 'string') {
        const email = body.email.trim().toLowerCase();
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        user = usersData?.users?.find((u) => (u.email || '').toLowerCase() === email) || null;
    }

    if (!user) {
        return NextResponse.json(
            { error: 'Session expired. Please log in first or provide your admin email.' },
            { status: 401 }
        );
    }

    const result = await verifyMfaResetOtpAndPurgeFactors(user, otp);

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return getResponse(
        NextResponse.json({
            ok: true,
            message: result.message,
            nextStep: 'mfa-setup',
            redirect: '/mfa/setup',
        })
    );
}

