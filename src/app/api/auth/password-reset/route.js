import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { handlePasswordResetSuccess } from '@/lib/security/authLockout';

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const password = typeof body?.password === 'string' ? body.password : '';
    if (password.length < 8 || password.length > 128) {
        return NextResponse.json(
            { error: 'Your new password must be between 8 and 128 characters.' },
            { status: 400 }
        );
    }

    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return getResponse(
            NextResponse.json(
                { error: 'Your recovery session is invalid or expired. Request a new recovery email.' },
                { status: 401 }
            )
        );
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
        return getResponse(
            NextResponse.json({ error: updateError.message }, { status: 400 })
        );
    }

    await handlePasswordResetSuccess(user.email);
    return getResponse(
        NextResponse.json({ ok: true, message: 'Your password has been reset. You can now sign in.' })
    );
}
