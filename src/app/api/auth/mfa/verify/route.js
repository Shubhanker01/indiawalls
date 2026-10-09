import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const code = typeof body?.code === 'string' ? body.code.trim() : '';
    if (!/^\d{6}$/.test(code)) {
        return NextResponse.json({ error: 'Enter the 6-digit code.' }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    // Setup sends the factorId from /enroll; sign-in sends none, so use the verified factor
    let factorId = typeof body?.factorId === 'string' ? body.factorId : null;
    if (!factorId) {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        factorId = factors?.totp?.[0]?.id ?? null;
    }
    if (!factorId) {
        return NextResponse.json({ error: 'No factor found.' }, { status: 400 });
    }

    // Challenge + verify in one call; on success the session becomes AAL2
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
    if (error) {
        return NextResponse.json({ error: 'Invalid code. Try again.' }, { status: 401 });
    }

    const result = NextResponse.json({ ok: true });
    getResponse().cookies.getAll().forEach((c) => result.cookies.set(c));
    return result;
}