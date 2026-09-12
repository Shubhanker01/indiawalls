import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function middleware(req) {
    const { supabase, getResponse } = createSupabaseServerClient({
        request: req,
        response: NextResponse.next({ request: req }),
        updateRequestCookies: true,
    });

    const { data: { user } } = await supabase.auth.getUser();
    const isLoggedIn = !!user;
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
    const isAdminLogin = req.nextUrl.pathname === "/admin";

    if (isOnAdmin && !isAdminLogin && !isLoggedIn) {
        const loginUrl = new URL("/admin", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return getResponse();
}

export const config = {
    matcher: ["/admin/:path*"],
};