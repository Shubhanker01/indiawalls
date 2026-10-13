import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export function createSupabaseServerClient({ request, response, updateRequestCookies = false }) {
    let currentResponse = response;
    // Default 7-day session lifetime to prevent abrupt 30-minute lockouts
    const DEFAULT_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

    const supabase = createServerClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    if (updateRequestCookies) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                        currentResponse = NextResponse.next({ request });
                    }

                    cookiesToSet.forEach(({ name, value, options }) => {
                        const isProduction = process.env.NODE_ENV === 'production';
                        const updatedOptions = {
                            ...options,
                            httpOnly: true, // Prevent XSS theft across all environments
                            secure: isProduction,
                            sameSite: 'lax',
                            path: '/',
                            maxAge: options?.maxAge ?? DEFAULT_EXPIRY_SECONDS,
                        };
                        currentResponse.cookies.set(name, value, updatedOptions);
                    });
                },
            },
        }
    );

    return {
        supabase,
        getResponse: (customResponse) => {
            if (customResponse) {
                currentResponse.cookies.getAll().forEach((cookie) => customResponse.cookies.set(cookie));
                return customResponse;
            }
            return currentResponse;
        },
    };
}