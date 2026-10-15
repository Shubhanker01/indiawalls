'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ShieldAlert, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

function MfaReset() {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const [hasRequestedOtp, setHasRequestedOtp] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRequestOtp = async () => {
        setErrorMessage('');
        setStatusMessage('');
        setIsRequestingOtp(true);
        try {
            const { data } = await axios.post('/api/auth/mfa/reset-request');
            setHasRequestedOtp(true);
            setStatusMessage(data.message || 'A new 6-digit OTP has been dispatched to your email.');
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Unable to send OTP. Please check your email.');
        } finally {
            setIsRequestingOtp(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setStatusMessage('');
        setIsLoading(true);

        try {
            const { data } = await axios.post('/api/auth/mfa/reset-verify', { otp });
            if (data.ok) {
                setIsSuccess(true);
                setStatusMessage('MFA factor reset successfully! Redirecting to setup a new authenticator...');
                setTimeout(() => {
                    router.push('/mfa/setup');
                }, 1500);
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Failed to verify OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative">
            <Link
                href="/admin"
                className="absolute top-8 left-8 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
            </Link>

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-slate-100">
                <div className="mb-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-3">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        MFA Reset & Recovery
                    </h1>
                    <p className="text-xs text-slate-400">
                        Enter the emergency 6-digit OTP code sent to your admin email address to unfreeze and reset your authenticator.
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
                        {errorMessage}
                    </div>
                )}

                {statusMessage && (
                    <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs text-center font-medium flex items-center justify-center gap-2">
                        {isSuccess && <CheckCircle2 className="w-4 h-4" />}
                        {statusMessage}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={hasRequestedOtp || isRequestingOtp || isSuccess}
                    className="mb-4 w-full py-3 border border-yellow-600/50 bg-yellow-600/10 hover:bg-yellow-600/20 text-yellow-400 font-medium text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRequestingOtp ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending OTP...
                        </>
                    ) : (
                        'Send OTP'
                    )}
                </button>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                            6-Digit Emergency OTP
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-center tracking-widest text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-yellow-500 transition font-mono text-lg"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || otp.length !== 6 || isSuccess}
                        className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-medium text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Verifying Recovery OTP...
                            </>
                        ) : (
                            'Reset Authenticator'
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                    <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={isRequestingOtp || isSuccess}
                        className="text-xs text-yellow-500 hover:text-yellow-400 font-medium transition disabled:opacity-50"
                    >
                        {isRequestingOtp ? 'Dispatching OTP...' : "Didn't receive an OTP? Resend Emergency Code"}
                    </button>
                </div>
            </div>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <MfaReset />
        </Suspense>
    );
}
