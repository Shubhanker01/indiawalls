import { apiResponse } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { handlePasswordResetSuccess } from '@/lib/security/authLockout';

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return apiResponse({ error: 'Invalid request body.' }, { status: 400 });
    }

    const password = typeof body?.password === 'string' ? body.password : '';
    if (password.length < 8 || password.length > 128) {
        return apiResponse(
            { error: 'Your new password must be between 8 and 128 characters.' },
            { status: 400 }
        );
    }

    const response = apiResponse({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return getResponse(
            apiResponse(
                { error: 'Your recovery session is invalid or expired. Request a new recovery email.' },
                { status: 401 }
            )
        );
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
        return getResponse(
            apiResponse({ error: updateError.message }, { status: 400 })
        );
    }

    await handlePasswordResetSuccess(user.email);
    return getResponse(
        apiResponse({ ok: true, message: 'Your password has been reset. You can now sign in.' })
    );
}
