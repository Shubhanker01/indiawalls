import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// Basic RFC 5322 compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request) {
    let body;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    // 1. Type check and length cap (prevents DoS payloads)
    let rawEmail = typeof body?.email === 'string' ? body.email.trim() : '';
    let rawPassword = typeof body?.password === 'string' ? body.password : '';

    if (rawEmail.length > 254 || rawPassword.length > 128) {
        return NextResponse.json({ error: 'Input length exceeds limit.' }, { status: 400 });
    }

    // 2. Email format validation
    const email = rawEmail.toLowerCase();
    if (!email || !EMAIL_REGEX.test(email)) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!rawPassword) {
        return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    // 3. Initialize response & Supabase client
    let response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    // 4. Authenticate
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: rawPassword,
    });

    if (error || !data.user) {
        // Return a generic error message to prevent user enumeration
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }



    return getResponse();
}