'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

function MfaVerify() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/mfa/verify', { code });
            if (data?.ok !== true) {
                setError('Verification could not be completed. Try again.');
                return;
            }
            window.location.replace('/admin/form-panel');
        } catch (e) {
            const errorMsg = e.response?.data?.error || 'Invalid code. Try again.';
            const lockedState = e.response?.status === 423 || e.response?.data?.locked === true;

            setError(errorMsg);
            setCode('');

            if (lockedState) {
                setIsLocked(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
            <form
                onSubmit={submit}
                className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl text-slate-100"
            >
                <h1 className="text-2xl font-semibold text-white">
                    Two-Factor Authentication
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                    Open your authenticator app and enter the 6-digit TOTP code.
                </p>

                <input
                    className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 disabled:opacity-50"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder="123456"
                    disabled={isLocked || loading}
                    autoFocus
                />

                <button
                    className="mt-5 w-full rounded-xl bg-yellow-600 px-4 py-3 font-semibold text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-yellow-900/20"
                    type="submit"
                    disabled={loading || isLocked || code.length !== 6}
                >
                    {loading ? 'Verifying...' : 'Verify TOTP Code'}
                </button>

                {error && (
                    <div
                        className={`mt-4 rounded-xl border p-3.5 text-xs text-center font-medium ${
                            isLocked
                                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        }`}
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {isLocked ? (
                    <div className="mt-6 text-center">
                        <Link
                            href="/mfa/reset"
                            className="inline-block w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition"
                        >
                            Reset Authenticator via Email OTP
                        </Link>
                    </div>
                ) : (
                    <div className="mt-6 text-center">
                        <Link
                            href="/mfa/reset"
                            className="text-xs text-slate-500 hover:text-slate-300 underline transition"
                        >
                            Lost your device? Reset authenticator with Email OTP
                        </Link>
                    </div>
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