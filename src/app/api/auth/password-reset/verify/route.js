import { apiResponse } from '@/lib/api/response';
import dbConnect from '@/lib/dbConnect';
import AuthSecurityTracker from '@/models/AuthSecurityTracker.mjs';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return apiResponse({ error: 'Invalid request body.' }, { status: 400 });
    }

    const tokenHash = typeof body?.token_hash === 'string' ? body.token_hash.trim() : '';
    if (!tokenHash || tokenHash.length > 512) {
        return apiResponse(
            { error: 'The password recovery link is invalid or expired.' },
            { status: 400 }
        );
    }

    await dbConnect();
    const tracker = await AuthSecurityTracker.findOne({
        passwordResetToken: tokenHash,
        isPasswordLocked: true,
        passwordResetExpires: { $gt: new Date() },
    }).lean();

    if (!tracker) {
        return apiResponse(
            { error: 'The password recovery link is invalid or expired. Request a new recovery email.' },
            { status: 400 }
        );
    }

    const response = apiResponse({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });
    const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'recovery',
    });

    if (error) {
        return getResponse(
            apiResponse(
                { error: 'The password recovery link is invalid or expired. Request a new recovery email.' },
                { status: 400 }
            )
        );
    }

    return getResponse(apiResponse({ ok: true }));
}
