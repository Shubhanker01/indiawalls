import { apiResponse } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requestMfaResetOtp } from '@/lib/security/authLockout';

export async function POST(request) {
    const response = apiResponse({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        return getResponse(
            apiResponse({ error: 'Session expired. Please sign in again.' }, { status: 401 })
        );
    }

    try {
        const result = await requestMfaResetOtp(user.email);
        return getResponse(
            apiResponse({
                ok: true,
                message: result.message,
            })
        );
    } catch (err) {
        return getResponse(
            apiResponse({ error: err.message || 'Failed to dispatch reset OTP.' }, { status: 500 })
        );
    }
}
