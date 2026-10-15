'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';

const FIELD_CLASS =
    'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-yellow-500';

export default function UpdateManufacturingUnitForm() {
    const [units, setUnits] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState('');
    const [form, setForm] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadUnits() {
            try {
                const response = await fetch('/api/manufacturing-units', {
                    cache: 'no-store',
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Could not load manufacturing units.');
                }
                if (isMounted) setUnits(data.units);
            } catch (requestError) {
                if (isMounted) {
                    setError(requestError.message || 'Could not load manufacturing units.');
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadUnits();
        return () => {
            isMounted = false;
        };
    }, []);

    function selectUnit(slug) {
        setSelectedSlug(slug);
        setError('');
        setSuccess('');
        const unit = units.find((item) => item.slug === slug);
        setForm(
            unit
                ? {
                      city: unit.city || '',
                      address: unit.address || '',
                      mapsUrl: unit.mapsUrl || '',
                      region: unit.region || '',
                  }
                : null
        );
    }

    function updateField(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');
        setIsSaving(true);

        try {
            const response = await fetch(
                `/api/manufacturing-units?slug=${encodeURIComponent(selectedSlug)}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Manufacturing unit could not be updated.');
            }

            setUnits((current) =>
                current.map((unit) =>
                    unit.slug === selectedSlug ? { ...unit, ...data.unit } : unit
                )
            );
            setForm({
                city: data.unit.city,
                address: data.unit.address,
                mapsUrl: data.unit.mapsUrl || '',
                region: data.unit.region || '',
            });
            setSuccess(`"${data.unit.city}" was updated.`);
        } catch (requestError) {
            setError(requestError.message || 'Manufacturing unit could not be updated.');
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
                Select a manufacturing unit
                <select
                    value={selectedSlug}
                    onChange={(event) => selectUnit(event.target.value)}
                    disabled={isLoading || units.length === 0}
                    className={FIELD_CLASS}
                >
                    <option value="">
                        {isLoading ? 'Loading units…' : 'Choose a unit'}
                    </option>
                    {units.map((unit) => (
                        <option key={unit.slug} value={unit.slug}>
                            {unit.city}{unit.address ? ` — ${unit.address}` : ''}
                        </option>
                    ))}
                </select>
            </label>

            {!isLoading && !error && units.length === 0 && (
                <p className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-6 text-sm text-slate-400">
                    No manufacturing units are available to update.
                </p>
            )}

            {form && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
                        <div>
                            <h3 className="text-lg font-bold text-white">Update unit details</h3>
                            <p className="mt-1 text-sm text-slate-400">
                                Edit the city, address, map URL, and state or region.
                            </p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="text-sm font-medium text-slate-300">
                                City / unit name
                                <input
                                    required
                                    maxLength={120}
                                    value={form.city}
                                    onChange={(event) => updateField('city', event.target.value)}
                                    className={FIELD_CLASS}
                                />
                            </label>
                            <label className="text-sm font-medium text-slate-300">
                                State or region
                                <input
                                    maxLength={120}
                                    value={form.region}
                                    onChange={(event) => updateField('region', event.target.value)}
                                    className={FIELD_CLASS}
                                />
                            </label>
                            <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                                Address
                                <textarea
                                    rows={2}
                                    maxLength={300}
                                    value={form.address}
                                    onChange={(event) => updateField('address', event.target.value)}
                                    className={FIELD_CLASS}
                                />
                            </label>
                            <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                                Google Maps URL
                                <input
                                    type="url"
                                    maxLength={2000}
                                    value={form.mapsUrl}
                                    onChange={(event) => updateField('mapsUrl', event.target.value)}
                                    placeholder="https://maps.google.com/?q=Jaipur"
                                    className={FIELD_CLASS}
                                />
                            </label>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={isSaving || !form.city.trim()}
                        className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isSaving ? 'Saving…' : 'Update manufacturing unit'}
                    </button>
                </form>
            )}
        </div>
    );
}
