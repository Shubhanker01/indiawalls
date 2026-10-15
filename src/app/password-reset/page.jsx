'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { apiPost } from '@/lib/api/client';

function PasswordResetForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tokenHash = searchParams.get('token_hash');
    const verificationStarted = useRef(false);
    const [isVerifying, setIsVerifying] = useState(Boolean(tokenHash));
    const [isRecoveryReady, setIsRecoveryReady] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!tokenHash || verificationStarted.current) return;
        verificationStarted.current = true;

        async function verifyRecoveryToken() {
            try {
                await apiPost('/api/auth/password-reset/verify', { token_hash: tokenHash });
                setIsRecoveryReady(true);
                router.replace('/password-reset');
            } catch (error) {
                setErrorMessage(
                    error.data?.error ||
                    'The password recovery link is invalid or expired. Request a new recovery email.'
                );
            } finally {
                setIsVerifying(false);
            }
        }

        verifyRecoveryToken();
    }, [router, tokenHash]);

    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage('');

        if (password !== confirmPassword) {
            setErrorMessage('The passwords do not match.');
            return;
        }

        setIsSaving(true);
        try {
            await apiPost('/api/auth/password-reset', { password });
            setIsSuccess(true);
        } catch (error) {
            setErrorMessage(error.data?.error || 'Unable to reset your password. Try again.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
            <Link
                href="/admin"
                className="absolute left-8 top-8 flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-slate-200"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
            </Link>

            <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-100 shadow-2xl">
                <div className="mb-6 space-y-2 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-400">
                        {isSuccess ? <CheckCircle2 className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        {isSuccess ? 'Password Reset' : 'Reset Your Password'}
                    </h1>
                    <p className="text-xs text-slate-400">
                        {isSuccess
                            ? 'Your password has been updated. Sign in with your new password.'
                            : 'Set a new password using the secure recovery link sent to your email.'}
                    </p>
                </div>

                {errorMessage && (
                    <div role="alert" className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-center text-xs font-medium text-red-400">
                        {errorMessage}
                    </div>
                )}

                {isVerifying && (
                    <p className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying your recovery link...
                    </p>
                )}

                {!isVerifying && !isRecoveryReady && !errorMessage && (
                    <p className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center text-xs text-slate-400">
                        Open the password recovery link sent to your email to choose a new password.
                    </p>
                )}

                {!isVerifying && isRecoveryReady && !isSuccess && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="new-password" className="mb-2 block text-xs font-medium text-slate-300">
                                New Password
                            </label>
                            <input
                                id="new-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                maxLength={128}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:border-yellow-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="mb-2 block text-xs font-medium text-slate-300">
                                Confirm New Password
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                maxLength={128}
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:border-yellow-500 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-600 py-3 text-sm font-medium text-white shadow-lg shadow-yellow-900/20 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            {isSaving ? 'Updating Password...' : 'Set New Password'}
                        </button>
                    </form>
                )}

                {!isVerifying && isSuccess && (
                    <button
                        type="button"
                        onClick={() => router.push('/admin')}
                        className="w-full rounded-xl bg-yellow-600 py-3 text-sm font-medium text-white transition hover:bg-yellow-500"
                    >
                        Return to Sign In
                    </button>
                )}
            </section>
        </main>
    );
}

export default function PasswordResetPage() {
    return (
        <Suspense fallback={<main className="min-h-screen bg-slate-950" />}>
            <PasswordResetForm />
        </Suspense>
    );
}
