'use client';

import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

const FIELD_CLASS =
    'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-yellow-500';

export default function DeleteSpecificationForm() {
    const [specificationName, setSpecificationName] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');
        setIsDeleting(true);

        try {
            const response = await fetch('/api/specifications', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ specificationName: specificationName.trim() }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Specification could not be deleted.');
            }

            setSuccess(`Specification "${data.specification.specificationName}" was deleted.`);
            setSpecificationName('');
        } catch (requestError) {
            setError(requestError.message || 'Specification could not be deleted.');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-slate-300">
                This permanently deletes the specification. This action cannot be undone.
            </div>
            <label className="block text-sm font-medium text-slate-300">
                Specification title
                <input
                    required
                    maxLength={160}
                    value={specificationName}
                    onChange={(event) => setSpecificationName(event.target.value)}
                    placeholder="Enter the exact specification title"
                    className={FIELD_CLASS}
                />
            </label>
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
            <button
                type="submit"
                disabled={isDeleting || !specificationName.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isDeleting ? 'Deleting…' : 'Delete specification'}
            </button>
        </form>
    );
}
