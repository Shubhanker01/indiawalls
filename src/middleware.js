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
    const pathname = req.nextUrl.pathname;
    const isOnAdmin = pathname.startsWith("/admin");
    const isAdminLogin = pathname === "/admin";
    const isErrorRoute = pathname.startsWith("/admin/form-panel") || pathname.startsWith("/admin/api");

    if (isOnAdmin && !isAdminLogin && !pathname.startsWith("/admin/api") && isLoggedIn) {
        const { data: assurance, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (error) {
            return NextResponse.json({ error: "Could not verify authentication level." }, { status: 500 });
        }
        if (assurance?.nextLevel === "aal1") {
            return NextResponse.redirect(new URL("/mfa/setup", req.url));
        }
        if (assurance?.currentLevel === "aal1" && assurance?.nextLevel === "aal2") {
            return NextResponse.redirect(new URL("/mfa", req.url));
        }
    }

    if (isOnAdmin && !isAdminLogin && !isLoggedIn && !isErrorRoute) {
        const loginUrl = new URL("/admin", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }
    if (isErrorRoute && !isLoggedIn) {
        return NextResponse.json(
            {
                error: "Unauthorized Access",
                message: "Sorry this page is forbidden",
                status: 403,
            },
            { status: 403 }
        );
    }

    return getResponse();
}

export const config = {
    matcher: ["/admin/:path*"],
};