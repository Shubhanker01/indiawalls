import { apiPost } from '@/lib/api/client';

export async function loginAdmin({ email, password }) {
    return apiPost('/api/auth/login', { email, password });
}