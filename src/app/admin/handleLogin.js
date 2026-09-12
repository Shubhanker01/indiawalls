'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';

export async function handleLogin(_previousState, formData) {
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');
    const requestedCallbackUrl = String(formData.get('callbackUrl') || '');
    const callbackUrl =
        requestedCallbackUrl.startsWith('/') && !requestedCallbackUrl.startsWith('//')
            ? requestedCallbackUrl
            : '/admin/form-panel';

    if (!email || !password) {
        return { error: 'Email and password are required.' };
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
        return { error: 'Invalid email or password.' };
    }

    redirect(callbackUrl);
}