'use client';

import { useRef, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { apiPost } from '@/lib/api/client';

const FIELD_CLASS =
    'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-yellow-500';

export default function AddClientForm() {
    const formRef = useRef(null);
    const [name, setName] = useState('');
    const [logo, setLogo] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!logo) {
            setError('Choose a client logo image to upload.');
            return;
        }

        const formData = new FormData();
        formData.set('name', name.trim());
        formData.set('logo', logo);
        setIsSaving(true);

        try {
            const data = await apiPost('/api/clients', formData);

            setName('');
            setLogo(null);
            formRef.current?.reset();
            setSuccess(`Client "${data.client.name}" was added.`);
        } catch (requestError) {
            setError(requestError.message || 'Client could not be added.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                    {error}
                </p>
            )}
            {success && (
                <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                    {success}
                </p>
            )}

            <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
                <div>
                    <h3 className="text-lg font-bold text-white">New client details</h3>
                    <p className="mt-1 text-sm text-slate-400">
                        Provide the client name and upload its logo.
                    </p>
                </div>
                <label className="block text-sm font-medium text-slate-300">
                    Client name
                    <input
                        required
                        maxLength={160}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Client name"
                        className={FIELD_CLASS}
                    />
                </label>
                <label className="block text-sm font-medium text-slate-300">
                    Client logo
                    <input
                        required
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => setLogo(event.target.files?.[0] || null)}
                        className={`${FIELD_CLASS} file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-yellow-500`}
                    />
                    <span className="mt-2 block text-xs font-normal text-slate-500">
                        JPG, PNG, or WebP; maximum file size is 4 MB.
                    </span>
                </label>
            </section>

            <button
                type="submit"
                disabled={isSaving || !name.trim() || !logo}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {isSaving ? 'Adding client…' : 'Add client'}
            </button>
        </form>
    );
}
