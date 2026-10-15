import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function middleware(req) {
    const { supabase, getResponse } = createSupabaseServerClient({
        request: req,
        response: NextResponse.next({ request: req }),
        updateRequestCookies: true,
    });

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    const pathname = req.nextUrl.pathname;
    const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
    const isAdminLogin = pathname === '/admin';

    if (!isAdminRoute || isAdminLogin) {
        return getResponse();
    }

    if (userError) {
        console.error('[AUTH] Could not verify the admin session:', userError.message);
    }

    if (userError || !user) {
        return getResponse(
            NextResponse.json(
                {
                    error: 'Unauthorized Access',
                    message: 'A verified admin session is required to access this route.',
                    status: 401,
                },
                { status: 401 }
            )
        );
    }

    const { data: assurance, error: assuranceError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) {
        console.error('[AUTH] Could not verify the admin assurance level:', assuranceError.message);
        return getResponse(
            NextResponse.json(
                { error: 'Could not verify authentication level.' },
                { status: 500 }
            )
        );
    }

    if (assurance?.currentLevel !== 'aal2') {
        const nextPath = assurance?.nextLevel === 'aal2' ? '/mfa' : '/mfa/setup';
        return getResponse(NextResponse.redirect(new URL(nextPath, req.url)));
    }

    return getResponse();
}

export const config = {
    matcher: ['/admin/:path*'],
};
