import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export function createSupabaseServerClient({ request, response, updateRequestCookies = false }) {
    let currentResponse = response;
    const SHORT_EXPIRY_SECONDS = 1800;
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
                        const updatedOptions = {
                            ...options,
                            maxAge: SHORT_EXPIRY_SECONDS
                        }
                        currentResponse.cookies.set(name, value, updatedOptions);
                    });
                },
            },
        }
    );

    return {
        supabase,
        getResponse: () => currentResponse,
    };
}