'use client';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

function MfaVerify() {
    const router = useRouter();

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post('/api/auth/mfa/verify', { code });
            router.push('/admin/form-panel');
        } catch (e) {
            setError(e.response?.data?.error || 'Invalid code. Try again.');
            setCode('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <form
                onSubmit={submit}
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
            >
                <h1 className="text-2xl font-semibold text-slate-900">
                    Enter your authentication code
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    Open your authenticator app and enter the 6-digit code.
                </p>
                <input
                    className="mt-6 w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder="123456"
                    autoFocus
                />
                <button
                    className="mt-4 w-full rounded-md bg-black px-4 py-3 font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                    disabled={loading || code.length !== 6}
                >
                    Verify
                </button>
                {error && (
                    <p className="mt-4 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                )}
            </form>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <MfaVerify />
        </Suspense>
    );
}