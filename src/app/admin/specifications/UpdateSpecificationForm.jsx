'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';

const FIELD_CLASS =
    'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-yellow-500';

export default function UpdateSpecificationForm() {
    const [items, setItems] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState('');
    const [form, setForm] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadSpecifications() {
            try {
                const response = await fetch('/api/specifications');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Could not load specifications.');
                }
                if (isMounted) setItems(data.specifications);
            } catch (requestError) {
                if (isMounted) setError(requestError.message || 'Could not load specifications.');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadSpecifications();
        return () => {
            isMounted = false;
        };
    }, []);

    function selectSpecification(slug) {
        setSelectedSlug(slug);
        setError('');
        setSuccess('');
        const selected = items.find((item) => item.slug === slug);
        setForm(
            selected
                ? {
                    title: selected.specificationName,
                    description: selected.description,
                    label: selected.label,
                    specifications: selected.specifications || [],
                }
                : null
        );
    }

    function updateField(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    function updateRow(index, field, value) {
        setForm((current) => ({
            ...current,
            specifications: current.specifications.map((row, rowIndex) =>
                rowIndex === index ? { ...row, [field]: value } : row
            ),
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');
        setIsSaving(true);

        try {
            const response = await fetch(
                `/api/specifications?slug=${encodeURIComponent(selectedSlug)}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Specification could not be updated.');
            }

            setItems((current) =>
                current.map((item) =>
                    item.slug === selectedSlug
                        ? { ...item, ...data.specification }
                        : item
                )
            );
            setForm({
                title: data.specification.specificationName,
                description: data.specification.description,
                label: data.specification.label,
                specifications: data.specification.specifications,
            });
            setSuccess(`Specification "${data.specification.specificationName}" was updated.`);
        } catch (requestError) {
            setError(requestError.message || 'Specification could not be updated.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6">
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

            <label className="block text-sm font-medium text-slate-300">
                Choose a specification to update
                <span className="relative block">
                    <select
                        value={selectedSlug}
                        onChange={(event) => selectSpecification(event.target.value)}
                        disabled={isLoading || items.length === 0}
                        className={FIELD_CLASS}
                    >
                        <option value="">
                            {isLoading ? 'Loading specifications…' : 'Select a specification'}
                        </option>
                        {items.map((item) => (
                            <option key={item.slug} value={item.slug}>
                                {item.specificationName}
                            </option>
                        ))}
                    </select>
                    {isLoading && (
                        <Loader2 className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
                    )}
                </span>
            </label>

            {!isLoading && !error && items.length === 0 && (
                <p className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-6 text-sm text-slate-400">
                    No specifications are available to update.
                </p>
            )}

            {form && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
                        <div>
                            <h3 className="text-lg font-bold text-white">Specification details</h3>
                            <p className="mt-1 text-sm text-slate-400">
                                Update the title, description, label, and table rows. The slug and image remain unchanged.
                            </p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="text-sm font-medium text-slate-300">
                                Title
                                <input
                                    required
                                    maxLength={160}
                                    value={form.title}
                                    onChange={(event) => updateField('title', event.target.value)}
                                    className={FIELD_CLASS}
                                />
                            </label>
                            <label className="text-sm font-medium text-slate-300">
                                Label
                                <input
                                    required
                                    maxLength={160}
                                    value={form.label}
                                    onChange={(event) => updateField('label', event.target.value)}
                                    className={FIELD_CLASS}
                                />
                            </label>
                            <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                                Description
                                <textarea
                                    required
                                    rows={4}
                                    maxLength={5000}
                                    value={form.description}
                                    onChange={(event) => updateField('description', event.target.value)}
                                    className={FIELD_CLASS}
                                />
                            </label>
                        </div>
                    </section>

                    <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold text-white">Specification table</h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    Edit, add, or remove table rows.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setForm((current) => ({
                                        ...current,
                                        specifications: [...current.specifications, { label: '', value: '' }],
                                    }))
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-yellow-500"
                            >
                                <Plus className="h-4 w-4" />
                                Add row
                            </button>
                        </div>
                        {form.specifications.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-slate-700 px-4 py-6 text-center text-sm text-slate-500">
                                No table rows. Add one or save an empty array.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {form.specifications.map((row, index) => (
                                    <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                                        <label className="text-sm font-medium text-slate-300">
                                            Row {index + 1} label
                                            <input
                                                required
                                                maxLength={160}
                                                value={row.label}
                                                onChange={(event) => updateRow(index, 'label', event.target.value)}
                                                className={FIELD_CLASS}
                                            />
                                        </label>
                                        <label className="text-sm font-medium text-slate-300">
                                            Value
                                            <input
                                                required
                                                maxLength={500}
                                                value={row.value}
                                                onChange={(event) => updateRow(index, 'value', event.target.value)}
                                                className={FIELD_CLASS}
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            aria-label={`Remove row ${index + 1}`}
                                            onClick={() =>
                                                setForm((current) => ({
                                                    ...current,
                                                    specifications: current.specifications.filter(
                                                        (_, rowIndex) => rowIndex !== index
                                                    ),
                                                }))
                                            }
                                            className="mt-7 inline-flex h-11 items-center justify-center rounded-xl border border-red-500/30 px-3 text-red-300 transition hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isSaving ? 'Saving…' : 'Update specification'}
                    </button>
                </form>
            )}
        </div>
    );
}
