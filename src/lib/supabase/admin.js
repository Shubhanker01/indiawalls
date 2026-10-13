import { createClient } from '@supabase/supabase-js';

let cachedAdmin = null;

export function getSupabaseAdmin() {
    if (cachedAdmin) return cachedAdmin;

    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
    }

    cachedAdmin = createClient(url, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });

    return cachedAdmin;
}

export const supabaseAdmin = getSupabaseAdmin();

