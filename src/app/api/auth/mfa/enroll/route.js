// route to enroll a user in MFA
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request) {
    const response = NextResponse.json({ ok: true, nextStep: 'mfa-setup' });
    const { supabase } = createSupabaseServerClient({ request, response });

    // Must already be signed in (AAL1)
    const { data: { user } } = await supabase.auth.getUser();
    console.log(user)
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    // Remove abandoned, unverified factors from earlier attempts
    const { data: factors } = await supabase.auth.mfa.listFactors();
    for (const f of factors?.all ?? []) {
        if (f.factor_type === 'totp' && f.status === 'unverified') {
            await supabase.auth.mfa.unenroll({ factorId: f.id });
        }
    }

    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: `Authenticator ${Date.now()}`, // unique, avoids duplicate-name errors
    });

    if (error) {
        console.error('MFA enroll failed:', {
            message: error.message,
            code: error.code,
            status: error.status,
        });
        return NextResponse.json({ error: 'Could not start enrollment.' }, { status: 400 });
    }

    const result = NextResponse.json({
        ok: true,
        factorId: data.id,
        qrCode: data.totp.qr_code, // SVG data URL, use as <img src>
        secret: data.totp.secret,  // manual-entry fallback
    });
    return result;
}