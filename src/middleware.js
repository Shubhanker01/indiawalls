// src/middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isLoggedIn = !!token;
    const isAdmin = token?.role === "ADMIN";
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
    const isAdminLogin = req.nextUrl.pathname === "/admin";

    if (isOnAdmin && !isAdminLogin && (!isLoggedIn || !isAdmin)) {
        const loginUrl = new URL("/admin", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};