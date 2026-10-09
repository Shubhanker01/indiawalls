'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
                const res = await axios.post('/api/auth/mfa/enroll');
                setFactorId(res.data.factorId);
                setQrCode(res.data.qrCode);
                setSecret(res.data.secret);
            } catch (e) {
                setError(e.response?.data?.error || 'Could not start setup.');
            }
        })();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/mfa/verify', { factorId, code });
            if (res.data.ok === true) {
                router.push('/admin/form-panel');
            }
        } catch (e) {
            setError(e.response?.data?.error || 'Invalid code. Try again.');
            setCode('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit}>
            <h1>Set up two-factor authentication</h1>
            <p>Scan this QR code with your authenticator app, then enter the 6-digit code.</p>

            {qrCode && <img src={qrCode} alt="Authenticator QR code" width={200} height={200} />}
            {secret && <p>Can't scan? Enter this key manually: <code>{secret}</code></p>}

            <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                placeholder="123456"
            />
            <button type="submit" disabled={loading || !factorId || code.length !== 6}>
                Verify
            </button>
            {error && <p role="alert">{error}</p>}
        </form>
    );
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <MfaSetup />
        </Suspense>
    );
}