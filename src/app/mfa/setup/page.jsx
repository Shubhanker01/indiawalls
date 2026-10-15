'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api/client';

function MfaSetup() {
    const router = useRouter();

    const [factorId, setFactorId] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return; // avoids double enroll in strict mode
        started.current = true;
        (async () => {
            try {
                const data = await apiPost('/api/auth/mfa/enroll');
                setFactorId(data.factorId);
                setQrCode(data.qrCode);
                setSecret(data.secret);
            } catch (e) {
                setError(e.data?.error || 'Could not start setup.');
            }
        })();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await apiPost('/api/auth/mfa/verify', { factorId, code });
            if (data.ok === true) {
                router.push('/admin/form-panel');
            }
        } catch (e) {
            setError(e.data?.error || 'Invalid code. Try again.');
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
                    Set up two-factor authentication
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    Scan this QR code with your authenticator app, then enter the 6-digit code.
                </p>

                {qrCode && (
                    <img
                        className="mx-auto mt-6"
                        src={qrCode}
                        alt="Authenticator QR code"
                        width={200}
                        height={200}
                    />
                )}
                {secret && (
                    <p className="mt-4 break-words text-sm text-slate-600">
                        Can&apos;t scan? Enter this key manually:{' '}
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
                            {secret}
                        </code>
                    </p>
                )}

                <input
                    className="mt-6 w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder="123456"
                />
                <button
                    className="mt-4 w-full rounded-md bg-black px-4 py-3 font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                    disabled={loading || !factorId || code.length !== 6}
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
            <MfaSetup />
        </Suspense>
    );
}